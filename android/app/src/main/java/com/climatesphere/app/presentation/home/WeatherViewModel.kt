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

class WeatherViewModel(
    private val repository: WeatherRepository,
    private val updateManager: AppUpdateManager
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
        loadWeather(forceRefresh = false)
        checkForUpdates()
    }

    fun loadWeather(forceRefresh: Boolean = false) {
        weatherJob?.cancel()
        weatherJob = viewModelScope.launch {
            val currentLocation = _uiState.value.selectedLocation
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
        _uiState.update {
            it.copy(
                selectedLocation = location,
                isSearchDialogOpen = false,
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
            updateManager: AppUpdateManager
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return WeatherViewModel(repository, updateManager) as T
                }
            }
    }
}
