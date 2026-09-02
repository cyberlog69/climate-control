package com.climatesphere.app.presentation.home

import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WeatherModel

data class HomeUiState(
    val selectedLocation: LocationModel = LocationModel(
        name = "Tokyo, Japan",
        cityName = "Tokyo",
        country = "Japan",
        latitude = 35.6762,
        longitude = 139.6503
    ),
    val weather: WeatherModel? = null,
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val errorMessage: String? = null,
    val isSearching: Boolean = false,
    val searchResults: List<LocationModel> = emptyList(),
    val isSearchDialogOpen: Boolean = false
)
