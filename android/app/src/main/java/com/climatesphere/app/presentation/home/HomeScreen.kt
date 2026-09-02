package com.climatesphere.app.presentation.home

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.PureBlack
import com.climatesphere.app.core.theme.RedAlert
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.presentation.components.AirQualityCard
import com.climatesphere.app.presentation.components.DailyForecastList
import com.climatesphere.app.presentation.components.HourlyForecastRow
import com.climatesphere.app.presentation.components.LocationSearchDialog
import com.climatesphere.app.presentation.components.WeatherHeroCard
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: WeatherViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)

    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
                permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
        if (granted) {
            try {
                fusedLocationClient.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, null)
                    .addOnSuccessListener { location ->
                        if (location != null) {
                            viewModel.selectLocation(
                                LocationModel(
                                    name = "My Location (${location.latitude.format(2)}°, ${location.longitude.format(2)}°)",
                                    cityName = "Current Location",
                                    country = "",
                                    latitude = location.latitude,
                                    longitude = location.longitude
                                )
                            )
                        }
                    }
            } catch (e: SecurityException) {
                // Ignore
            }
        }
    }

    val onAutoLocateClick: () -> Unit = {
        val hasFine = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
        val hasCoarse = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (hasFine || hasCoarse) {
            try {
                fusedLocationClient.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, null)
                    .addOnSuccessListener { location ->
                        if (location != null) {
                            viewModel.selectLocation(
                                LocationModel(
                                    name = "Current Location",
                                    cityName = "Local Coordinates",
                                    country = "",
                                    latitude = location.latitude,
                                    longitude = location.longitude
                                )
                            )
                        }
                    }
            } catch (e: SecurityException) {
                // Ignore
            }
        } else {
            locationPermissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "ClimateSphere",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Text(
                            text = uiState.selectedLocation.cityName,
                            style = MaterialTheme.typography.labelMedium,
                            color = CyanPrimary,
                            fontSize = 12.sp
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onAutoLocateClick) {
                        Icon(
                            imageVector = Icons.Default.MyLocation,
                            contentDescription = "Auto Locate",
                            tint = CyanPrimary
                        )
                    }
                    IconButton(onClick = { viewModel.setSearchDialogOpen(true) }) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search Location",
                            tint = TextWhite
                        )
                    }
                    IconButton(onClick = { viewModel.loadWeather(forceRefresh = true) }) {
                        if (uiState.isRefreshing) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = CyanPrimary,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Refresh",
                                tint = TextMuted
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = PureBlack
                )
            )
        },
        containerColor = PureBlack,
        modifier = modifier
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when {
                uiState.isLoading && uiState.weather == null -> {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        CircularProgressIndicator(color = CyanPrimary)
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Synchronizing planetary telemetry...",
                            color = TextMuted,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }

                uiState.weather != null -> {
                    val weather = uiState.weather!!
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    ) {
                        // Error notice banner if refresh failed
                        if (uiState.errorMessage != null) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(bottom = 12.dp)
                                    .clip(MaterialTheme.shapes.medium)
                                    .background(RedAlert.copy(alpha = 0.2f))
                                    .padding(12.dp)
                            ) {
                                Text(
                                    text = uiState.errorMessage!!,
                                    color = RedAlert,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }

                        // 1. Weather Hero Card
                        WeatherHeroCard(
                            current = weather.current,
                            locationName = weather.location.name,
                            isFromCache = weather.isFromCache
                        )

                        Spacer(modifier = Modifier.height(18.dp))

                        // 2. 24-Hour Forecast Row
                        if (weather.hourly.isNotEmpty()) {
                            HourlyForecastRow(hourlyList = weather.hourly)
                            Spacer(modifier = Modifier.height(18.dp))
                        }

                        // 3. Air Quality Card
                        AirQualityCard(airQuality = weather.airQuality)

                        Spacer(modifier = Modifier.height(18.dp))

                        // 4. 7-Day Daily Outlook
                        if (weather.daily.isNotEmpty()) {
                            DailyForecastList(dailyList = weather.daily)
                            Spacer(modifier = Modifier.height(24.dp))
                        }
                    }
                }

                uiState.errorMessage != null -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "Connection Notice",
                            style = MaterialTheme.typography.titleLarge,
                            color = TextWhite,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = uiState.errorMessage!!,
                            color = TextMuted,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }

            // Location Search Autocomplete Dialog
            if (uiState.isSearchDialogOpen) {
                LocationSearchDialog(
                    onDismissRequest = { viewModel.setSearchDialogOpen(false) },
                    onQueryChanged = { viewModel.searchLocations(it) },
                    isSearching = uiState.isSearching,
                    searchResults = uiState.searchResults,
                    onLocationSelected = { viewModel.selectLocation(it) }
                )
            }
        }
    }
}

private fun Double.format(digits: Int) = "%.${digits}f".format(this)
