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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.clickable
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.FormatListBulleted
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.automirrored.filled.CompareArrows
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material.icons.filled.Tune
import androidx.compose.foundation.border
import com.climatesphere.app.core.theme.AmberWarning
import com.climatesphere.app.core.theme.GreenAqi
import com.climatesphere.app.core.theme.PurpleAura
import com.climatesphere.app.core.theme.SkeuoLedDiode
import com.climatesphere.app.core.theme.SkeuoWellBorder
import com.climatesphere.app.core.theme.skeuoRecessedWell
import com.climatesphere.app.presentation.components.BarometerCard
import com.climatesphere.app.presentation.components.CarbonCalculatorBottomSheet
import com.climatesphere.app.presentation.components.ClimateImpactCard
import com.climatesphere.app.presentation.components.ClimateImpactSimulatorBottomSheet
import com.climatesphere.app.presentation.components.DualCityComparisonBottomSheet
import com.climatesphere.app.presentation.components.RenewableEnergyBottomSheet
import com.climatesphere.app.presentation.components.RenewableEnergyCard
import com.climatesphere.app.presentation.components.WatchlistBottomSheet
import com.climatesphere.app.presentation.components.WildfireRadarCard
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.presentation.components.UpdateDialog
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.PureBlack
import com.climatesphere.app.core.theme.RedAlert
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.skeuoPushButton
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
    val updateInfo by viewModel.updateInfo.collectAsState()
    val isUpdateDialogOpen by viewModel.isUpdateDialogOpen.collectAsState()
    val downloadState by viewModel.downloadState.collectAsState()
    val context = LocalContext.current
    val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
    var toolsMenuOpen by remember { mutableStateOf(false) }

    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
                permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
        if (granted) {
            try {
                fusedLocationClient.lastLocation.addOnSuccessListener { lastLoc ->
                    if (lastLoc != null) {
                        viewModel.updateLocationFromCoordinates(lastLoc.latitude, lastLoc.longitude)
                    }
                }
                fusedLocationClient.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, null)
                    .addOnSuccessListener { location ->
                        if (location != null) {
                            viewModel.updateLocationFromCoordinates(location.latitude, location.longitude)
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
                fusedLocationClient.lastLocation.addOnSuccessListener { lastLoc ->
                    if (lastLoc != null) {
                        viewModel.updateLocationFromCoordinates(lastLoc.latitude, lastLoc.longitude)
                    }
                }
                fusedLocationClient.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, null)
                    .addOnSuccessListener { location ->
                        if (location != null) {
                            viewModel.updateLocationFromCoordinates(location.latitude, location.longitude)
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

    // Auto-locate on first launch
    androidx.compose.runtime.LaunchedEffect(Unit) {
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
                fusedLocationClient.lastLocation.addOnSuccessListener { lastLoc ->
                    if (lastLoc != null) {
                        viewModel.updateLocationFromCoordinates(lastLoc.latitude, lastLoc.longitude)
                    }
                }
                fusedLocationClient.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, null)
                    .addOnSuccessListener { location ->
                        if (location != null) {
                            viewModel.updateLocationFromCoordinates(location.latitude, location.longitude)
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

    val pageCount = uiState.activeLocations.size.coerceAtLeast(1)
    val pagerState = rememberPagerState(initialPage = uiState.activePageIndex.coerceIn(0, pageCount - 1)) {
        pageCount
    }

    androidx.compose.runtime.LaunchedEffect(pagerState.currentPage) {
        viewModel.onPageSelected(pagerState.currentPage)
    }

    androidx.compose.runtime.LaunchedEffect(uiState.activePageIndex) {
        if (pagerState.currentPage != uiState.activePageIndex && uiState.activePageIndex in 0 until pageCount) {
            pagerState.animateScrollToPage(uiState.activePageIndex)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column(
                        modifier = Modifier
                            .clickable(onClickLabel = "Open watchlist") {
                                viewModel.setWatchlistSheetOpen(true)
                            }
                            .semantics(mergeDescendants = true) {
                                contentDescription =
                                    "ClimateSphere. Selected city ${uiState.selectedLocation.cityName}. Opens watchlist."
                            }
                    ) {
                        Text(
                            text = "ClimateSphere",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFF070B14))
                                .border(0.5.dp, SkeuoWellBorder, RoundedCornerShape(8.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            SkeuoLedDiode(color = CyanPrimary, size = 6.dp, isPulsing = true)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = uiState.selectedLocation.cityName,
                                style = MaterialTheme.typography.labelMedium,
                                color = CyanPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(
                                text = "▾",
                                color = CyanPrimary,
                                fontSize = 10.sp
                            )
                        }
                    }
                },
                actions = {
                    if (updateInfo?.isUpdateAvailable == true) {
                        IconButton(onClick = { viewModel.setUpdateDialogOpen(true) }) {
                            Box(contentAlignment = Alignment.TopEnd) {
                                Icon(
                                    imageVector = Icons.Default.SystemUpdate,
                                    contentDescription = "Update Available",
                                    tint = CyanPrimary
                                )
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .clip(CircleShape)
                                        .background(CyanPrimary)
                                )
                            }
                        }
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
                    Box {
                        IconButton(onClick = { toolsMenuOpen = true }) {
                            Icon(
                                imageVector = Icons.Default.MoreVert,
                                contentDescription = "More tools",
                                tint = TextWhite
                            )
                        }
                        DropdownMenu(
                            expanded = toolsMenuOpen,
                            onDismissRequest = { toolsMenuOpen = false }
                        ) {
                            DropdownMenuItem(
                                text = {
                                    Text(
                                        if (uiState.isCurrentInWatchlist) "Remove from watchlist" else "Save this city"
                                    )
                                },
                                leadingIcon = {
                                    Icon(
                                        imageVector = if (uiState.isCurrentInWatchlist) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                                        contentDescription = null,
                                        tint = if (uiState.isCurrentInWatchlist) CyanPrimary else TextMuted
                                    )
                                },
                                onClick = {
                                    toolsMenuOpen = false
                                    viewModel.toggleWatchlistCurrentLocation()
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Watchlist") },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.AutoMirrored.Filled.FormatListBulleted,
                                        contentDescription = null,
                                        tint = TextWhite
                                    )
                                },
                                onClick = {
                                    toolsMenuOpen = false
                                    viewModel.setWatchlistSheetOpen(true)
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Locate me") },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.Default.MyLocation,
                                        contentDescription = null,
                                        tint = CyanPrimary
                                    )
                                },
                                onClick = {
                                    toolsMenuOpen = false
                                    onAutoLocateClick()
                                }
                            )
                            HorizontalDivider(color = DarkCardBorder)
                            DropdownMenuItem(
                                text = { Text("Compare two cities") },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.AutoMirrored.Filled.CompareArrows,
                                        contentDescription = null,
                                        tint = CyanPrimary
                                    )
                                },
                                onClick = {
                                    toolsMenuOpen = false
                                    viewModel.setComparisonSheetOpen(true)
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Renewable potential") },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.Default.Bolt,
                                        contentDescription = null,
                                        tint = AmberWarning
                                    )
                                },
                                onClick = {
                                    toolsMenuOpen = false
                                    viewModel.setRenewableSheetOpen(true)
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Climate scenarios") },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.Default.Tune,
                                        contentDescription = null,
                                        tint = PurpleAura
                                    )
                                },
                                onClick = {
                                    toolsMenuOpen = false
                                    viewModel.setImpactSheetOpen(true)
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Carbon calculator") },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.Default.Spa,
                                        contentDescription = null,
                                        tint = GreenAqi
                                    )
                                },
                                onClick = {
                                    toolsMenuOpen = false
                                    viewModel.setCarbonSheetOpen(true)
                                }
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
                            text = "Updating the weather feed",
                            color = TextMuted,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }

                uiState.weather != null -> {
                    Column(modifier = Modifier.fillMaxSize()) {
                        // Page indicator pills if multiple tracked locations
                        if (uiState.activeLocations.size > 1) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Row(
                                    modifier = Modifier
                                        .skeuoRecessedWell(RoundedCornerShape(12.dp))
                                        .padding(horizontal = 8.dp, vertical = 4.dp),
                                    horizontalArrangement = Arrangement.Center,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    uiState.activeLocations.forEachIndexed { index, _ ->
                                        val isSelected = index == pagerState.currentPage
                                        Box(
                                            modifier = Modifier
                                                .padding(horizontal = 3.dp)
                                                .height(5.dp)
                                                .width(if (isSelected) 22.dp else 6.dp)
                                                .clip(CircleShape)
                                                .background(
                                                    if (isSelected) CyanPrimary else Color(0xFF1E293B)
                                                )
                                                .border(
                                                    0.5.dp,
                                                    if (isSelected) Color.White.copy(alpha = 0.5f) else Color.Transparent,
                                                    CircleShape
                                                )
                                        )
                                    }
                                }
                            }
                        }

                        HorizontalPager(
                            state = pagerState,
                            modifier = Modifier
                                .fillMaxWidth()
                                .weight(1f)
                        ) { _ ->
                            val weather = uiState.weather!!
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .verticalScroll(rememberScrollState())
                                    .padding(horizontal = 16.dp, vertical = 4.dp)
                            ) {
                                // Error notice banner if refresh failed
                                if (uiState.errorMessage != null) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(bottom = 12.dp)
                                            .clip(MaterialTheme.shapes.medium)
                                            .background(RedAlert.copy(alpha = 0.15f))
                                            .padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = uiState.errorMessage!!,
                                            color = RedAlert,
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.Medium,
                                            modifier = Modifier.weight(1f)
                                        )
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Box(
                                            modifier = Modifier
                                                .skeuoPushButton(
                                                    activeAccent = CyanPrimary,
                                                    onClick = { viewModel.loadWeather(forceRefresh = true) }
                                                )
                                                .padding(horizontal = 12.dp, vertical = 10.dp)
                                        ) {
                                            Text(
                                                text = "Retry",
                                                color = TextWhite,
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
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

                                // 4. Barometric Pressure & Storm Tracking
                                BarometerCard(barometerData = uiState.barometerData)

                                Spacer(modifier = Modifier.height(18.dp))

                                // 5. Wildfire risk and nearby events
                                WildfireRadarCard(
                                    currentLocation = weather.location,
                                    temperatureC = weather.current.temperature,
                                    humidityPercent = weather.current.humidity,
                                    windSpeedKmH = weather.current.windSpeed,
                                    hotspots = uiState.wildfireHotspots,
                                    isSampleData = uiState.isWildfireSampleData,
                                    updatedAt = uiState.wildfireUpdatedAt,
                                    onSelectHotspotLocation = { viewModel.selectLocation(it) }
                                )

                                Spacer(modifier = Modifier.height(18.dp))

                                // 6. Renewable Energy Potential
                                RenewableEnergyCard(
                                    location = weather.location,
                                    cloudCoverPercent = weather.current.cloudCover,
                                    windSpeedKmH = weather.current.windSpeed,
                                    onOpenCalculator = { viewModel.setRenewableSheetOpen(true) }
                                )

                                Spacer(modifier = Modifier.height(18.dp))

                                // 7. Climate Impact Scenario Simulator
                                ClimateImpactCard(
                                    location = weather.location,
                                    onOpenSimulator = { viewModel.setImpactSheetOpen(true) }
                                )

                                Spacer(modifier = Modifier.height(18.dp))

                                // 8. 7-Day Daily Outlook
                                if (weather.daily.isNotEmpty()) {
                                    DailyForecastList(dailyList = weather.daily)
                                    Spacer(modifier = Modifier.height(24.dp))
                                }
                            }
                        }
                    }
                }

                uiState.errorMessage != null -> {
                    HomeMessageState(
                        title = "Weather feed offline",
                        body = "Could not load a forecast for ${uiState.selectedLocation.cityName}. ${uiState.errorMessage}",
                        primaryLabel = "Try again",
                        onPrimary = { viewModel.loadWeather(forceRefresh = true) },
                        secondaryLabel = "Search another city",
                        onSecondary = { viewModel.setSearchDialogOpen(true) }
                    )
                }

                else -> {
                    HomeMessageState(
                        title = "No station selected",
                        body = "Pick a city to start the weather feed.",
                        primaryLabel = "Search for a city",
                        onPrimary = { viewModel.setSearchDialogOpen(true) },
                        secondaryLabel = "Use my location",
                        onSecondary = onAutoLocateClick
                    )
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

            // In-App OTA Update Dialog
            if (isUpdateDialogOpen && updateInfo != null) {
                UpdateDialog(
                    updateInfo = updateInfo!!,
                    onOpenUrl = { url -> viewModel.openUpdateUrl(url) },
                    onDismiss = { viewModel.dismissUpdateDialog() }
                )
            }

            // Watchlist Bottom Sheet
            if (uiState.isWatchlistSheetOpen) {
                WatchlistBottomSheet(
                    watchlist = uiState.watchlist,
                    currentLocation = uiState.selectedLocation,
                    onDismissRequest = { viewModel.setWatchlistSheetOpen(false) },
                    onLocationSelected = { viewModel.selectLocation(it) },
                    onRemoveLocation = { viewModel.removeFromWatchlist(it) },
                    onAddLocationClick = { viewModel.setSearchDialogOpen(true) }
                )
            }

            // Carbon Footprint Calculator Bottom Sheet
            if (uiState.isCarbonSheetOpen) {
                CarbonCalculatorBottomSheet(
                    initialProfile = uiState.carbonProfile,
                    onDismiss = { viewModel.setCarbonSheetOpen(false) },
                    onSaveProfile = { profile ->
                        viewModel.saveCarbonProfile(profile)
                    }
                )
            }

            // Renewable Energy Bottom Sheet
            if (uiState.isRenewableSheetOpen && uiState.weather != null) {
                RenewableEnergyBottomSheet(
                    location = uiState.weather!!.location,
                    cloudCoverPercent = uiState.weather!!.current.cloudCover,
                    windSpeedKmH = uiState.weather!!.current.windSpeed,
                    onDismiss = { viewModel.setRenewableSheetOpen(false) }
                )
            }

            // Climate Impact Simulator Bottom Sheet
            if (uiState.isImpactSheetOpen && uiState.weather != null) {
                ClimateImpactSimulatorBottomSheet(
                    location = uiState.weather!!.location,
                    onDismiss = { viewModel.setImpactSheetOpen(false) }
                )
            }

            // Dual-City Comparison Bottom Sheet
            if (uiState.isComparisonSheetOpen && uiState.weather != null) {
                DualCityComparisonBottomSheet(
                    currentLocation = uiState.weather!!.location,
                    currentWeather = uiState.weather!!,
                    comparisonLocation = uiState.comparisonLocation,
                    comparisonWeather = uiState.comparisonWeather,
                    isLoadingComparison = uiState.isComparisonLoading,
                    onSearchLocation = { viewModel.searchComparisonLocations(it) },
                    searchResults = uiState.comparisonSearchResults,
                    onSelectComparisonLocation = { viewModel.selectComparisonLocation(it) },
                    onDismiss = { viewModel.setComparisonSheetOpen(false) }
                )
            }
        }
    }
}

@Composable
private fun HomeMessageState(
    title: String,
    body: String,
    primaryLabel: String,
    onPrimary: () -> Unit,
    secondaryLabel: String,
    onSecondary: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleLarge,
            color = TextWhite,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = body,
            color = TextMuted,
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(24.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .skeuoPushButton(
                    isSelected = true,
                    activeAccent = CyanPrimary,
                    onClick = onPrimary
                )
                .padding(horizontal = 16.dp, vertical = 12.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = primaryLabel,
                color = CyanPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        }
        Spacer(modifier = Modifier.height(12.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .skeuoPushButton(onClick = onSecondary)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = secondaryLabel,
                color = TextWhite,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center
            )
        }
    }
}
