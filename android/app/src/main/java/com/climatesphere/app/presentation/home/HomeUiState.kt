package com.climatesphere.app.presentation.home

import com.climatesphere.app.core.sensor.BarometerData
import com.climatesphere.app.data.local.entity.CarbonProfileEntity
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WeatherModel
import com.climatesphere.app.domain.model.WildfireHotspot
import com.climatesphere.app.domain.model.WildfireSentinelData

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
    val activePageIndex: Int = 0,
    val isCarbonSheetOpen: Boolean = false,
    val carbonProfile: CarbonProfileEntity? = null,
    val barometerData: BarometerData = BarometerData(),
    val isRenewableSheetOpen: Boolean = false,
    val isImpactSheetOpen: Boolean = false,
    val isComparisonSheetOpen: Boolean = false,
    val comparisonLocation: LocationModel? = null,
    val comparisonWeather: WeatherModel? = null,
    val isComparisonLoading: Boolean = false,
    val comparisonSearchResults: List<LocationModel> = emptyList(),
    // Live NASA EONET events; the bundled sample list is used until the feed responds.
    val wildfireHotspots: List<WildfireHotspot> = WildfireSentinelData.GLOBAL_HOTSPOTS,
    val isWildfireSampleData: Boolean = true,
    val wildfireUpdatedAt: String? = null
)
