package com.climatesphere.app.domain.repository

import com.climatesphere.app.core.util.Resource
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WeatherModel
import kotlinx.coroutines.flow.Flow

interface WeatherRepository {
    fun getWeatherForLocation(
        location: LocationModel,
        forceRefresh: Boolean = false
    ): Flow<Resource<WeatherModel>>

    suspend fun searchLocations(query: String): List<LocationModel>
}
