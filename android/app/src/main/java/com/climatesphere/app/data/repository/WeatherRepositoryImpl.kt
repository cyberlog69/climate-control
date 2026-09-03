package com.climatesphere.app.data.repository

import android.content.Context
import android.location.Geocoder
import android.os.Build
import com.climatesphere.app.core.util.Resource
import com.climatesphere.app.data.local.WeatherDao
import com.climatesphere.app.data.mapper.mapAirQuality
import com.climatesphere.app.data.mapper.toDomainModel
import com.climatesphere.app.data.mapper.toEntity
import com.climatesphere.app.data.mapper.toLocationModel
import com.climatesphere.app.data.mapper.toWeatherModel
import com.climatesphere.app.data.remote.OpenMeteoApi
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WeatherModel
import com.climatesphere.app.domain.repository.WeatherRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import java.util.Locale
import kotlin.coroutines.resume

class WeatherRepositoryImpl(
    private val context: Context,
    private val api: OpenMeteoApi,
    private val dao: WeatherDao
) : WeatherRepository {

    override fun getWeatherForLocation(
        location: LocationModel,
        forceRefresh: Boolean
    ): Flow<Resource<WeatherModel>> = flow {
        emit(Resource.Loading())

        // 1. Fetch from Room cache first for instantaneous startup
        val cachedEntity = dao.getWeatherById().firstOrNull()
        val cachedModel = cachedEntity?.toDomainModel()

        if (cachedModel != null) {
            emit(Resource.Success(cachedModel))
        }

        val cacheAgeMillis = System.currentTimeMillis() - (cachedEntity?.cachedAtTimestamp ?: 0L)
        val isCacheStale = cacheAgeMillis > 15 * 60 * 1000 // 15 minutes

        // 2. Refresh from network if requested, stale, or no cache
        if (forceRefresh || isCacheStale || cachedModel == null) {
            try {
                coroutineScope {
                    val weatherDeferred = async {
                        api.getWeatherData(location.latitude, location.longitude)
                    }
                    val aqiDeferred = async {
                        try {
                            api.getAirQualityData(
                                latitude = location.latitude,
                                longitude = location.longitude
                            )
                        } catch (e: Exception) {
                            null
                        }
                    }

                    val weatherDto = weatherDeferred.await()
                    val aqiDto = aqiDeferred.await()

                    val airQualityModel = mapAirQuality(aqiDto?.current)
                    val freshWeather = weatherDto.toWeatherModel(location, airQualityModel)

                    // 3. Persist to Room Single Source of Truth
                    dao.insertWeather(freshWeather.toEntity())

                    emit(Resource.Success(freshWeather))
                }
            } catch (e: Exception) {
                if (cachedModel != null) {
                    emit(Resource.Success(cachedModel))
                } else {
                    emit(Resource.Error("Failed to load weather: ${e.localizedMessage ?: "Unknown network error"}"))
                }
            }
        }
    }

    override suspend fun searchLocations(query: String): List<LocationModel> {
        if (query.trim().length < 2) return emptyList()
        return try {
            val response = api.searchLocations(name = query.trim())
            response.results?.map { it.toLocationModel() } ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    override suspend fun getReverseGeocodedLocation(
        latitude: Double,
        longitude: Double
    ): LocationModel = withContext(Dispatchers.IO) {
        // 1. Try Android Native Geocoder
        if (Geocoder.isPresent()) {
            try {
                val geocoder = Geocoder(context, Locale.getDefault())
                val addresses = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    suspendCancellableCoroutine { cont ->
                        geocoder.getFromLocation(latitude, longitude, 1) { list ->
                            cont.resume(list)
                        }
                    }
                } else {
                    @Suppress("DEPRECATION")
                    geocoder.getFromLocation(latitude, longitude, 1) ?: emptyList()
                }

                val address = addresses.firstOrNull()
                if (address != null) {
                    val city = address.locality
                        ?: address.subAdminArea
                        ?: address.adminArea
                        ?: address.subLocality
                        ?: ""
                    val state = address.adminArea ?: ""
                    val country = address.countryName ?: ""
                    val primaryName = if (city.isNotBlank()) city else if (state.isNotBlank()) state else country

                    if (primaryName.isNotBlank()) {
                        val fullParts = listOfNotNull(
                            city.takeIf { it.isNotBlank() },
                            state.takeIf { it.isNotBlank() && it != city },
                            country.takeIf { it.isNotBlank() }
                        )
                        return@withContext LocationModel(
                            name = fullParts.joinToString(", "),
                            cityName = primaryName,
                            country = country,
                            latitude = latitude,
                            longitude = longitude
                        )
                    }
                }
            } catch (e: Exception) {
                // Native Geocoder failed or timed out, continue to network fallback
            }
        }

        // 2. Fallback to network reverse geocode (BigDataCloud client endpoint)
        try {
            val remote = api.reverseGeocode(latitude = latitude, longitude = longitude)
            val city = remote.city ?: remote.locality ?: remote.principalSubdivision ?: ""
            val state = remote.principalSubdivision ?: ""
            val country = remote.countryName ?: ""
            val primaryName = if (city.isNotBlank()) city else if (state.isNotBlank()) state else country

            if (primaryName.isNotBlank()) {
                val fullParts = listOfNotNull(
                    city.takeIf { it.isNotBlank() },
                    state.takeIf { it.isNotBlank() && it != city },
                    country.takeIf { it.isNotBlank() }
                )
                return@withContext LocationModel(
                    name = fullParts.joinToString(", "),
                    cityName = primaryName,
                    country = country,
                    latitude = latitude,
                    longitude = longitude
                )
            }
        } catch (e: Exception) {
            // Network fallback failed
        }

        // 3. Fallback to readable coordinates
        val formattedCoord = "%.2f°, %.2f°".format(latitude, longitude)
        return@withContext LocationModel(
            name = "Location ($formattedCoord)",
            cityName = formattedCoord,
            country = "",
            latitude = latitude,
            longitude = longitude
        )
    }
}
