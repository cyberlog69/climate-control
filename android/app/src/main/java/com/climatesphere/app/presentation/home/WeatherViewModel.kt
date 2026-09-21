package com.climatesphere.app.presentation.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.climatesphere.app.core.update.AppUpdateInfo
import com.climatesphere.app.core.update.AppUpdateManager
import com.climatesphere.app.core.update.DownloadState
import com.climatesphere.app.core.util.Resource
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.repository.WeatherRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.io.File

import com.climatesphere.app.core.sensor.BarometerSensorManager
import com.climatesphere.app.data.local.CarbonDao
import com.climatesphere.app.data.local.entity.CarbonProfileEntity

class WeatherViewModel(
    private val repository: WeatherRepository,
    private val updateManager: AppUpdateManager,
    private val carbonDao: CarbonDao,
    private val barometerManager: BarometerSensorManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    private val _updateInfo = MutableStateFlow<AppUpdateInfo?>(null)
    val updateInfo: StateFlow<AppUpdateInfo?> = _updateInfo.asStateFlow()

    private val _isUpdateDialogOpen = MutableStateFlow(false)
    val isUpdateDialogOpen: StateFlow<Boolean> = _isUpdateDialogOpen.asStateFlow()

    val downloadState: StateFlow<DownloadState> = updateManager.downloadState

    private var weatherJob: Job? = null
    private var searchJob: Job? = null

    init {
        barometerManager.startListening()
        observeBarometer()
        observeCarbonProfile()
        initStartupLocation()
        checkForUpdates()
        observeWatchlist()
    }

    private fun observeBarometer() {
        viewModelScope.launch {
            barometerManager.barometerData.collect { data ->
                _uiState.update { it.copy(barometerData = data) }
            }
        }
    }

    private fun observeCarbonProfile() {
        viewModelScope.launch {
            carbonDao.getCarbonProfile().collect { profile ->
                _uiState.update { it.copy(carbonProfile = profile) }
            }
        }
    }

    fun saveCarbonProfile(profile: CarbonProfileEntity) {
        viewModelScope.launch {
            carbonDao.saveCarbonProfile(profile)
        }
    }

    fun setCarbonSheetOpen(isOpen: Boolean) {
        _uiState.update { it.copy(isCarbonSheetOpen = isOpen) }
    }

    override fun onCleared() {
        super.onCleared()
        barometerManager.stopListening()
    }

    private fun initStartupLocation() {
        viewModelScope.launch {
            // 1. Check local Room database for last cached location
            val cached = repository.getLastKnownCachedLocation()
            if (cached != null && (cached.latitude != 0.0 || cached.longitude != 0.0)) {
                selectLocation(cached)
            }

            // 2. Fetch fast IP location to resolve actual city instantly before or alongside GPS
            val ipLocation = repository.getIpLocation()
            if (ipLocation != null) {
                val current = _uiState.value.selectedLocation
                if (current.latitude == 0.0 && current.longitude == 0.0) {
                    selectLocation(ipLocation)
                }
            }
        }
    }

    private fun observeWatchlist() {
        viewModelScope.launch {
            repository.getWatchlist().collect { list ->
                _uiState.update { current ->
                    val combined = mutableListOf(current.selectedLocation)
                    for (item in list) {
                        if (!combined.any { it.cityName.equals(item.cityName, ignoreCase = true) }) {
                            combined.add(item)
                        }
                    }
                    val isCurInWatchlist = list.any {
                        it.cityName.equals(current.selectedLocation.cityName, ignoreCase = true)
                    }
                    current.copy(
                        watchlist = list,
                        activeLocations = combined,
                        isCurrentInWatchlist = isCurInWatchlist
                    )
                }
            }
        }
    }

    fun toggleWatchlistCurrentLocation() {
        viewModelScope.launch {
            val current = _uiState.value.selectedLocation
            val isSaved = _uiState.value.isCurrentInWatchlist
            val locationId = "loc_%.2f_%.2f".format(java.util.Locale.US, current.latitude, current.longitude)
            if (isSaved) {
                repository.removeFromWatchlist(locationId)
            } else {
                repository.addToWatchlist(current)
            }
        }
    }

    fun addToWatchlist(location: LocationModel) {
        viewModelScope.launch {
            repository.addToWatchlist(location)
        }
    }

    fun removeFromWatchlist(location: LocationModel) {
        viewModelScope.launch {
            val locationId = "loc_%.2f_%.2f".format(java.util.Locale.US, location.latitude, location.longitude)
            repository.removeFromWatchlist(locationId)
        }
    }

    fun setWatchlistSheetOpen(isOpen: Boolean) {
        _uiState.update { it.copy(isWatchlistSheetOpen = isOpen) }
    }

    fun onPageSelected(index: Int) {
        val locations = _uiState.value.activeLocations
        if (index in locations.indices) {
            val target = locations[index]
            if (target != _uiState.value.selectedLocation) {
                _uiState.update { current ->
                    val isCurInWatchlist = current.watchlist.any {
                        it.cityName.equals(target.cityName, ignoreCase = true)
                    }
                    current.copy(
                        selectedLocation = target,
                        activePageIndex = index,
                        isCurrentInWatchlist = isCurInWatchlist
                    )
                }
                loadWeather(forceRefresh = false)
            }
        }
    }

    fun loadWeather(forceRefresh: Boolean = false) {
        val currentLocation = _uiState.value.selectedLocation
        if (currentLocation.latitude == 0.0 && currentLocation.longitude == 0.0) {
            return
        }
        weatherJob?.cancel()
        weatherJob = viewModelScope.launch {
            repository.getWeatherForLocation(currentLocation, forceRefresh)
                .collect { resource ->
                    when (resource) {
                        is Resource.Loading -> {
                            _uiState.update {
                                it.copy(
                                    isLoading = it.weather == null,
                                    isRefreshing = forceRefresh && it.weather != null,
                                    errorMessage = null
                                )
                            }
                        }
                        is Resource.Success -> {
                            barometerManager.updateStationFallback(resource.data?.current?.surfacePressure)
                            _uiState.update {
                                it.copy(
                                    weather = resource.data,
                                    isLoading = false,
                                    isRefreshing = false,
                                    errorMessage = null
                                )
                            }
                        }
                        is Resource.Error -> {
                            _uiState.update {
                                it.copy(
                                    isLoading = false,
                                    isRefreshing = false,
                                    errorMessage = resource.message
                                )
                            }
                        }
                    }
                }
        }
    }

    fun selectLocation(location: LocationModel) {
        _uiState.update { current ->
            val combined = mutableListOf(location)
            for (item in current.watchlist) {
                if (!combined.any { it.cityName.equals(item.cityName, ignoreCase = true) }) {
                    combined.add(item)
                }
            }
            val isCurInWatchlist = current.watchlist.any {
                it.cityName.equals(location.cityName, ignoreCase = true)
            }
            current.copy(
                selectedLocation = location,
                activeLocations = combined,
                activePageIndex = 0,
                isCurrentInWatchlist = isCurInWatchlist,
                isSearchDialogOpen = false,
                isWatchlistSheetOpen = false,
                searchResults = emptyList()
            )
        }
        loadWeather(forceRefresh = true)
    }

    fun updateLocationFromCoordinates(latitude: Double, longitude: Double) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = it.weather == null) }
            val resolvedLocation = repository.getReverseGeocodedLocation(latitude, longitude)
            selectLocation(resolvedLocation)
        }
    }

    fun searchLocations(query: String) {
        searchJob?.cancel()
        if (query.trim().length < 2) {
            _uiState.update { it.copy(searchResults = emptyList(), isSearching = false) }
            return
        }

        searchJob = viewModelScope.launch {
            delay(300) // Debounce typing
            _uiState.update { it.copy(isSearching = true) }
            val results = repository.searchLocations(query)
            _uiState.update { it.copy(searchResults = results, isSearching = false) }
        }
    }

    fun setSearchDialogOpen(isOpen: Boolean) {
        _uiState.update {
            it.copy(
                isSearchDialogOpen = isOpen,
                searchResults = if (isOpen) it.searchResults else emptyList()
            )
        }
    }

    fun checkForUpdates() {
        viewModelScope.launch {
            updateManager.checkForUpdates().onSuccess { info ->
                _updateInfo.value = info
                if (info.isUpdateAvailable) {
                    _isUpdateDialogOpen.value = true
                }
            }
        }
    }

    fun setUpdateDialogOpen(isOpen: Boolean) {
        _isUpdateDialogOpen.value = isOpen
    }

    fun downloadUpdate(downloadUrl: String) {
        viewModelScope.launch {
            updateManager.downloadApk(downloadUrl)
        }
    }

    fun installUpdate(apkFile: File) {
        updateManager.installApk(apkFile)
    }

    fun dismissUpdateDialog() {
        _isUpdateDialogOpen.value = false
        updateManager.resetDownloadState()
    }

    companion object {
        fun provideFactory(
            repository: WeatherRepository,
            updateManager: AppUpdateManager,
            carbonDao: CarbonDao,
            barometerManager: BarometerSensorManager
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return WeatherViewModel(repository, updateManager, carbonDao, barometerManager) as T
                }
            }
    }
}
