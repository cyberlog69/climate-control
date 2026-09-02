package com.climatesphere.app.data.repository

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
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.flow

class WeatherRepositoryImpl(
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
}
