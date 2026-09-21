package com.climatesphere.app.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ElectricCar
import androidx.compose.material.icons.filled.Flight
import androidx.compose.material.icons.filled.Forest
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableIntStateOf
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
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.DarkCard
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.GreenAqi
import com.climatesphere.app.core.theme.PureBlack
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.data.local.entity.CarbonProfileEntity
import com.climatesphere.app.domain.model.AVAILABLE_MITIGATIONS
import com.climatesphere.app.domain.model.CarbonBenchmarks
import com.climatesphere.app.domain.model.CarbonCalculator

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CarbonCalculatorBottomSheet(
    initialProfile: CarbonProfileEntity?,
    onDismiss: () -> Unit,
    onSaveProfile: (CarbonProfileEntity) -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    // Lifestyle state initialized from Room profile or sensible defaults
    var commuteKmWeek by remember { mutableDoubleStateOf(initialProfile?.commuteKmWeek ?: 160.0) }
    var vehicleType by remember { mutableStateOf(initialProfile?.vehicleType ?: "petrol") }
    var shortFlights by remember { mutableIntStateOf(initialProfile?.shortFlightsYear ?: 2) }
    var longFlights by remember { mutableIntStateOf(initialProfile?.longFlightsYear ?: 1) }
    var electricityKwh by remember { mutableDoubleStateOf(initialProfile?.electricityKwhMonth ?: 320.0) }
    var greenPercent by remember { mutableDoubleStateOf(initialProfile?.greenEnergyPercent ?: 15.0) }
    var dietType by remember { mutableStateOf(initialProfile?.dietType ?: "average") }
    var consumptionLevel by remember { mutableStateOf(initialProfile?.consumptionLevel ?: "medium") }
    var activeMitigations by remember {
        mutableStateOf(
            initialProfile?.activeMitigations
                ?.split(",")
                ?.filter { it.isNotBlank() }
                ?.toSet()
                ?: setOf("act-meatless")
        )
    }
    var isSavedRecently by remember { mutableStateOf(false) }

    // Realtime computation via IPCC engine
    val result = CarbonCalculator.calculate(
        commuteKmWeek = commuteKmWeek,
        vehicleType = vehicleType,
        shortFlightsYear = shortFlights,
        longFlightsYear = longFlights,
        electricityKwhMonth = electricityKwh,
        greenEnergyPercent = greenPercent,
        dietType = dietType,
        consumptionLevel = consumptionLevel,
        activeMitigations = activeMitigations
    )

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = PureBlack,
        dragHandle = null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            // Header Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(GreenAqi.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Spa,
                            contentDescription = "Eco",
                            tint = GreenAqi,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Carbon Footprint Engine",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Text(
                            text = "IPCC & GHG Protocol Standard",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextMuted,
                            fontSize = 11.sp
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

            Spacer(modifier = Modifier.height(18.dp))

            // Main Scorecard Display
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(DarkCard)
                    .border(1.dp, result.rating.badgeColor.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                    .padding(18.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Estimated Annual Footprint",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextDim
                            )
                            Row(verticalAlignment = Alignment.Bottom) {
                                Text(
                                    text = String.format(java.util.Locale.US, "%.2f", result.totalTons),
                                    style = MaterialTheme.typography.headlineLarge,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = TextWhite,
                                    fontSize = 38.sp
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "tCO₂e / yr",
                                    style = MaterialTheme.typography.titleSmall,
                                    color = CyanPrimary,
                                    modifier = Modifier.padding(bottom = 6.dp)
                                )
                            }
                        }

                        // Rating Badge
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(result.rating.badgeColor.copy(alpha = 0.15f))
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = result.rating.label,
                                color = result.rating.badgeColor,
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Paris Agreement Progress Bar
                    val targetProgress = (result.totalTons / 10.0).coerceIn(0.0, 1.0).toFloat()
                    LinearProgressIndicator(
                        progress = { targetProgress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(CircleShape),
                        color = result.rating.badgeColor,
                        trackColor = Color.White.copy(alpha = 0.1f)
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Paris 2030 Limit: ${CarbonBenchmarks.PARIS_TARGET_2030} t",
                            style = MaterialTheme.typography.labelSmall,
                            color = GreenAqi,
                            fontSize = 10.sp
                        )
                        val deltaText = if (result.parisDelta <= 0) {
                            "On Track (${result.parisDelta} t)"
                        } else {
                            "+${result.parisDelta} t over target"
                        }
                        Text(
                            text = deltaText,
                            style = MaterialTheme.typography.labelSmall,
                            color = if (result.parisDelta <= 0) GreenAqi else TextDim,
                            fontSize = 10.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Tree offset equivalent pill
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color.White.copy(alpha = 0.04f))
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Forest,
                            contentDescription = "Trees",
                            tint = GreenAqi,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Offset Equivalent: ~${result.treesNeededToOffset} mature trees needed / yr",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextWhite,
                            fontSize = 11.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Category Breakdown Bars
            Text(
                text = "EMISSIONS BREAKDOWN BY SECTOR",
                style = MaterialTheme.typography.labelSmall,
                color = TextDim,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            result.breakdown.forEach { category ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(category.color)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = category.name,
                        style = MaterialTheme.typography.bodySmall,
                        color = TextWhite,
                        modifier = Modifier.weight(1f)
                    )
                    Text(
                        text = "${String.format(java.util.Locale.US, "%.2f", category.value)} t",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = category.color
                    )
                }
            }

            Spacer(modifier = Modifier.height(22.dp))

            // 1. Mobility & Commute Section
            Text(
                text = "1. MOBILITY & COMMUTE",
                style = MaterialTheme.typography.labelSmall,
                color = CyanPrimary,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            // Vehicle Selector Chips
            val vehicles = listOf(
                "petrol" to "Petrol ⛽",
                "hybrid" to "Hybrid 🔋",
                "ev" to "EV ⚡",
                "transit" to "Transit 🚆",
                "bicycle" to "Bike 🚲"
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                vehicles.forEach { (id, label) ->
                    val isSelected = vehicleType == id
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) CyanPrimary else DarkCard)
                            .clickable { vehicleType = id }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) PureBlack else TextWhite
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "Weekly Commute Distance", style = MaterialTheme.typography.bodySmall, color = TextMuted)
                Text(text = "${commuteKmWeek.toInt()} km / week", style = MaterialTheme.typography.labelSmall, color = TextWhite)
            }
            Slider(
                value = commuteKmWeek.toFloat(),
                onValueChange = { commuteKmWeek = it.toDouble() },
                valueRange = 0f..600f,
                colors = SliderDefaults.colors(
                    thumbColor = CyanPrimary,
                    activeTrackColor = CyanPrimary,
                    inactiveTrackColor = Color.White.copy(alpha = 0.1f)
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // 2. Flights & Aviation Section
            Text(
                text = "2. AVIATION & FLIGHTS (PER YEAR)",
                style = MaterialTheme.typography.labelSmall,
                color = CyanPrimary,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Short-haul counter
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(14.dp))
                        .background(DarkCard)
                        .padding(12.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "Short Flights (<3h)", style = MaterialTheme.typography.labelSmall, color = TextDim, fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(
                                onClick = { if (shortFlights > 0) shortFlights-- },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(imageVector = Icons.Default.Remove, contentDescription = "Minus", tint = CyanPrimary, modifier = Modifier.size(16.dp))
                            }
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "$shortFlights", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextWhite)
                            Spacer(modifier = Modifier.width(6.dp))
                            IconButton(
                                onClick = { shortFlights++ },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(imageVector = Icons.Default.Add, contentDescription = "Plus", tint = CyanPrimary, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }

                // Long-haul counter
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(14.dp))
                        .background(DarkCard)
                        .padding(12.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "Long Flights (>3h)", style = MaterialTheme.typography.labelSmall, color = TextDim, fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(
                                onClick = { if (longFlights > 0) longFlights-- },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(imageVector = Icons.Default.Remove, contentDescription = "Minus", tint = CyanPrimary, modifier = Modifier.size(16.dp))
                            }
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "$longFlights", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextWhite)
                            Spacer(modifier = Modifier.width(6.dp))
                            IconButton(
                                onClick = { longFlights++ },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(imageVector = Icons.Default.Add, contentDescription = "Plus", tint = CyanPrimary, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // 3. Home Electricity & Green Grid
            Text(
                text = "3. HOUSEHOLD ENERGY & CLEAN POWER",
                style = MaterialTheme.typography.labelSmall,
                color = CyanPrimary,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "Monthly Power Usage", style = MaterialTheme.typography.bodySmall, color = TextMuted)
                Text(text = "${electricityKwh.toInt()} kWh / mo", style = MaterialTheme.typography.labelSmall, color = TextWhite)
            }
            Slider(
                value = electricityKwh.toFloat(),
                onValueChange = { electricityKwh = it.toDouble() },
                valueRange = 50f..1000f,
                colors = SliderDefaults.colors(thumbColor = CyanPrimary, activeTrackColor = CyanPrimary)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "Renewable / Solar Energy Share", style = MaterialTheme.typography.bodySmall, color = TextMuted)
                Text(text = "${greenPercent.toInt()}% Clean", style = MaterialTheme.typography.labelSmall, color = GreenAqi)
            }
            Slider(
                value = greenPercent.toFloat(),
                onValueChange = { greenPercent = it.toDouble() },
                valueRange = 0f..100f,
                colors = SliderDefaults.colors(thumbColor = GreenAqi, activeTrackColor = GreenAqi)
            )

            Spacer(modifier = Modifier.height(18.dp))

            // 4. Food & Diet Profile
            Text(
                text = "4. DIET & NUTRITION",
                style = MaterialTheme.typography.labelSmall,
                color = CyanPrimary,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            val diets = listOf(
                "highMeat" to "Meat 🥩",
                "average" to "Avg 🍗",
                "pescatarian" to "Pesca 🐟",
                "vegetarian" to "Veg 🥗",
                "vegan" to "Vegan 🌱"
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                diets.forEach { (id, label) ->
                    val isSelected = dietType == id
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) GreenAqi else DarkCard)
                            .clickable { dietType = id }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) PureBlack else TextWhite
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(22.dp))

            // 5. Actionable Net-Zero Mitigation Milestones
            Text(
                text = "ACTIONABLE MITIGATION MILESTONES",
                style = MaterialTheme.typography.labelSmall,
                color = GreenAqi,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            AVAILABLE_MITIGATIONS.forEach { action ->
                val isChecked = activeMitigations.contains(action.id)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isChecked) GreenAqi.copy(alpha = 0.1f) else DarkCard)
                        .clickable {
                            activeMitigations = if (isChecked) {
                                activeMitigations - action.id
                            } else {
                                activeMitigations + action.id
                            }
                        }
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(22.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (isChecked) GreenAqi else Color.White.copy(alpha = 0.1f)),
                        contentAlignment = Alignment.Center
                    ) {
                        if (isChecked) {
                            Icon(imageVector = Icons.Default.Check, contentDescription = "Active", tint = PureBlack, modifier = Modifier.size(16.dp))
                        }
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = action.title, style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.SemiBold, color = TextWhite)
                        Text(text = action.description, style = MaterialTheme.typography.labelSmall, color = TextDim, fontSize = 10.sp)
                    }
                    Text(
                        text = "-${action.savingsTons} t",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = GreenAqi
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Save to Profile Button
            Button(
                onClick = {
                    val profileToSave = CarbonProfileEntity(
                        id = 1,
                        commuteKmWeek = commuteKmWeek,
                        vehicleType = vehicleType,
                        shortFlightsYear = shortFlights,
                        longFlightsYear = longFlights,
                        electricityKwhMonth = electricityKwh,
                        greenEnergyPercent = greenPercent,
                        dietType = dietType,
                        consumptionLevel = consumptionLevel,
                        activeMitigations = activeMitigations.joinToString(","),
                        totalTons = result.totalTons,
                        calculatedAt = System.currentTimeMillis()
                    )
                    onSaveProfile(profileToSave)
                    isSavedRecently = true
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isSavedRecently) GreenAqi else CyanPrimary
                ),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(
                    imageVector = if (isSavedRecently) Icons.Default.CheckCircle else Icons.Default.Save,
                    contentDescription = "Save",
                    tint = PureBlack
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isSavedRecently) "Saved to Climate Database!" else "Save Profile to Device",
                    color = PureBlack,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
