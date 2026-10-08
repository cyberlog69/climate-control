package com.climatesphere.app.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.CompareArrows
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Thermostat
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material.icons.filled.WindPower
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.climatesphere.app.core.theme.AmberWarning
import com.climatesphere.app.core.theme.BlueSky
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.DarkCard
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.DarkSurface
import com.climatesphere.app.core.theme.EmeraldGreen
import com.climatesphere.app.core.theme.PureBlack
import com.climatesphere.app.core.theme.RedAlert
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.domain.model.DualCityComparisonCalculator
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WeatherModel
import kotlin.math.abs

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DualCityComparisonBottomSheet(
    currentLocation: LocationModel,
    currentWeather: WeatherModel,
    comparisonLocation: LocationModel?,
    comparisonWeather: WeatherModel?,
    isLoadingComparison: Boolean,
    onSearchLocation: (String) -> Unit,
    searchResults: List<LocationModel>,
    onSelectComparisonLocation: (LocationModel) -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var searchQuery by remember { mutableStateOf("") }

    val presetCities = remember {
        listOf(
            LocationModel("London, UK", "London", "UK", 51.5074, -0.1278),
            LocationModel("Tokyo, Japan", "Tokyo", "Japan", 35.6762, 139.6503),
            LocationModel("New York, USA", "New York", "USA", 40.7128, -74.0060),
            LocationModel("Dubai, UAE", "Dubai", "UAE", 25.2048, 55.2708),
            LocationModel("Sydney, Australia", "Sydney", "Australia", -33.8688, 151.2093),
            LocationModel("Singapore", "Singapore", "Singapore", 1.3521, 103.8198),
            LocationModel("Paris, France", "Paris", "France", 48.8566, 2.3522),
            LocationModel("Cairo, Egypt", "Cairo", "Egypt", 30.0444, 31.2357)
        )
    }

    // Default to London if comparison is null
    LaunchedEffect(Unit) {
        if (comparisonLocation == null) {
            onSelectComparisonLocation(presetCities.first())
        }
    }

    val comparisonResult = remember(currentWeather, comparisonWeather) {
        if (comparisonWeather != null) {
            DualCityComparisonCalculator.computeComparison(currentWeather, comparisonWeather)
        } else null
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = DarkSurface,
        dragHandle = null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 20.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(CyanPrimary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.CompareArrows,
                            contentDescription = null,
                            tint = CyanPrimary,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Dual-City Comparison",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Text(
                            text = "Live Environmental Delta Sentinel",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextMuted
                        )
                    }
                }

                IconButton(onClick = onDismiss) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = TextMuted
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Search Bar for City B
            OutlinedTextField(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    onSearchLocation(it)
                },
                modifier = Modifier.fillMaxWidth(),
                placeholder = {
                    Text(text = "Search city to compare against...", color = TextDim, fontSize = 13.sp)
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = CyanPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = {
                            searchQuery = ""
                            onSearchLocation("")
                        }) {
                            Icon(imageVector = Icons.Default.Close, contentDescription = "Clear", tint = TextDim)
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = DarkCard,
                    unfocusedContainerColor = DarkCard,
                    focusedBorderColor = CyanPrimary,
                    unfocusedBorderColor = DarkCardBorder,
                    focusedTextColor = TextWhite,
                    unfocusedTextColor = TextWhite
                )
            )

            // Search Autocomplete Dropdown
            if (searchResults.isNotEmpty() && searchQuery.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(PureBlack)
                        .border(1.dp, CyanPrimary.copy(alpha = 0.35f), RoundedCornerShape(14.dp))
                        .padding(6.dp)
                ) {
                    searchResults.take(4).forEach { loc ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(10.dp))
                                .clickable {
                                    onSelectComparisonLocation(loc)
                                    searchQuery = ""
                                    onSearchLocation("")
                                }
                                .padding(horizontal = 12.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.LocationOn, null, tint = CyanPrimary, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(text = loc.name, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                                if (loc.country.isNotEmpty()) {
                                    Text(text = loc.country, color = TextDim, fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Quick Preset City Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                presetCities.forEach { city ->
                    val isSelected = comparisonLocation?.cityName.equals(city.cityName, ignoreCase = true)
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) CyanPrimary.copy(alpha = 0.2f) else PureBlack.copy(alpha = 0.45f))
                            .border(
                                width = 1.dp,
                                color = if (isSelected) CyanPrimary else DarkCardBorder,
                                shape = RoundedCornerShape(10.dp)
                            )
                            .clickable {
                                onSelectComparisonLocation(city)
                                searchQuery = ""
                            }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = city.cityName,
                            color = if (isSelected) CyanPrimary else TextMuted,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            if (isLoadingComparison) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = CyanPrimary)
                }
            } else if (comparisonResult != null) {
                val deltas = comparisonResult.deltas

                // Side-by-Side City Badges
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // City A
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(DarkCard)
                            .border(1.dp, DarkCardBorder, RoundedCornerShape(16.dp))
                            .padding(14.dp)
                    ) {
                        Column {
                            Text(text = "CURRENT LOCATION", color = TextDim, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Text(text = currentLocation.cityName, color = TextWhite, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${currentWeather.current.temperature.toInt()}°C",
                                color = CyanPrimary,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Text(text = currentWeather.current.weatherDescription, color = TextMuted, fontSize = 11.sp)
                        }
                    }

                    // City B
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(DarkCard)
                            .border(1.dp, DarkCardBorder, RoundedCornerShape(16.dp))
                            .padding(14.dp)
                    ) {
                        Column {
                            Text(text = "COMPARING WITH", color = TextDim, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Text(
                                text = comparisonLocation?.cityName ?: "City B",
                                color = TextWhite,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${comparisonWeather?.current?.temperature?.toInt() ?: "--"}°C",
                                color = AmberWarning,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Text(text = comparisonWeather?.current?.weatherDescription ?: "--", color = TextMuted, fontSize = 11.sp)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Environmental Delta Indicators Grid
                Text(
                    text = "Live Environmental Deltas (City B vs City A)",
                    color = TextWhite,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Delta Temp
                    val isWarmer = deltas.deltaTempC >= 0
                    val tempColor = if (isWarmer) AmberWarning else BlueSky

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(DarkCard)
                            .border(1.dp, tempColor.copy(alpha = 0.35f), RoundedCornerShape(16.dp))
                            .padding(12.dp)
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Thermostat, null, tint = tempColor, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Temperature", color = TextDim, fontSize = 11.sp)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = if (isWarmer) Icons.Default.ArrowUpward else Icons.Default.ArrowDownward,
                                    contentDescription = null,
                                    tint = tempColor,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(2.dp))
                                Text(
                                    text = "${if (isWarmer) "+" else ""}${deltas.deltaTempC}°C",
                                    color = tempColor,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Text(
                                text = if (isWarmer) "Warmer in ${comparisonLocation?.cityName}" else "Cooler in ${comparisonLocation?.cityName}",
                                color = TextDim,
                                fontSize = 10.sp
                            )
                        }
                    }

                    // Delta AQI
                    val isCleaner = deltas.deltaAqi <= 0
                    val aqiColor = if (isCleaner) EmeraldGreen else RedAlert

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(DarkCard)
                            .border(1.dp, aqiColor.copy(alpha = 0.35f), RoundedCornerShape(16.dp))
                            .padding(12.dp)
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.WaterDrop, null, tint = aqiColor, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Air Quality (AQI)", color = TextDim, fontSize = 11.sp)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = if (isCleaner) Icons.Default.ArrowDownward else Icons.Default.ArrowUpward,
                                    contentDescription = null,
                                    tint = aqiColor,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(2.dp))
                                Text(
                                    text = "${if (deltas.deltaAqi > 0) "+" else ""}${deltas.deltaAqi} pts",
                                    color = aqiColor,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Text(
                                text = if (isCleaner) "Cleaner Air (${comparisonWeather?.airQuality?.aqi ?: "--"})" else "More Polluted (${comparisonWeather?.airQuality?.aqi ?: "--"})",
                                color = TextDim,
                                fontSize = 10.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Delta Wind
                    val isWindier = deltas.deltaWindSpeedKmH >= 0
                    val windColor = CyanPrimary

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(DarkCard)
                            .border(1.dp, DarkCardBorder, RoundedCornerShape(16.dp))
                            .padding(12.dp)
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.WindPower, null, tint = windColor, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Wind Variance", color = TextDim, fontSize = 11.sp)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "${if (isWindier) "+" else ""}${deltas.deltaWindSpeedKmH} km/h",
                                color = windColor,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = if (isWindier) "Higher wind velocity" else "Calmer wind speeds",
                                color = TextDim,
                                fontSize = 10.sp
                            )
                        }
                    }

                    // Delta Pressure
                    val isHigherPressure = deltas.deltaPressureHpa >= 0
                    val pressureColor = AmberWarning

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(DarkCard)
                            .border(1.dp, DarkCardBorder, RoundedCornerShape(16.dp))
                            .padding(12.dp)
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Speed, null, tint = pressureColor, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Pressure Gradient", color = TextDim, fontSize = 11.sp)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "${if (isHigherPressure) "+" else ""}${deltas.deltaPressureHpa} hPa",
                                color = pressureColor,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = if (isHigherPressure) "Higher barometric pressure" else "Lower barometric pressure",
                                color = TextDim,
                                fontSize = 10.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Comparative Matrix Table
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .background(PureBlack.copy(alpha = 0.5f))
                        .border(1.dp, DarkCardBorder, RoundedCornerShape(18.dp))
                        .padding(14.dp)
                ) {
                    Column {
                        Text(
                            text = "Detailed Metric Matrix",
                            color = TextWhite,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        ComparisonRow("Feels Like", "${currentWeather.current.apparentTemperature.toInt()}°C", "${comparisonWeather?.current?.apparentTemperature?.toInt() ?: "--"}°C")
                        ComparisonRow("Humidity", "${currentWeather.current.humidity}%", "${comparisonWeather?.current?.humidity ?: "--"}%")
                        ComparisonRow("UV Index", "${currentWeather.airQuality.uvIndex.toInt()}", "${comparisonWeather?.airQuality?.uvIndex?.toInt() ?: "--"}")
                        ComparisonRow("PM2.5", "${currentWeather.airQuality.pm25} µg/m³", "${comparisonWeather?.airQuality?.pm25 ?: "--"} µg/m³")
                        ComparisonRow("PM10", "${currentWeather.airQuality.pm10} µg/m³", "${comparisonWeather?.airQuality?.pm10 ?: "--"} µg/m³")
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun ComparisonRow(label: String, valA: String, valB: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, color = TextDim, fontSize = 11.sp, modifier = Modifier.weight(1.2f))
        Text(text = valA, color = TextWhite, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
        Text(text = valB, color = CyanPrimary, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
    }
}
