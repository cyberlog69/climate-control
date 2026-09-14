package com.climatesphere.app.presentation.home

import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WeatherModel

data class HomeUiState(
    val selectedLocation: LocationModel = LocationModel(
        name = "Detecting Location...",
        cityName = "Detecting...",
        country = "",
        latitude = 0.0,
        longitude = 0.0
    ),
    val weather: WeatherModel? = null,
    val isLoading: Boolean = true,
    val isRefreshing: Boolean = false,
    val errorMessage: String? = null,
    val isSearching: Boolean = false,
    val searchResults: List<LocationModel> = emptyList(),
    val isSearchDialogOpen: Boolean = false,
    val watchlist: List<LocationModel> = emptyList(),
    val isCurrentInWatchlist: Boolean = false,
    val isWatchlistSheetOpen: Boolean = false,
    val activeLocations: List<LocationModel> = listOf(selectedLocation),
    val activePageIndex: Int = 0
)
