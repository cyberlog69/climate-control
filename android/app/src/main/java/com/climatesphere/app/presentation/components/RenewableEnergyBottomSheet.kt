package com.climatesphere.app.presentation.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.EnergySavingsLeaf
import androidx.compose.material.icons.filled.Park
import androidx.compose.material.icons.filled.SolarPower
import androidx.compose.material.icons.filled.WindPower
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.climatesphere.app.core.theme.AmberWarning
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.DarkCard
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.DarkSurface
import com.climatesphere.app.core.theme.EmeraldGreen
import com.climatesphere.app.core.theme.PureBlack
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.RenewableEnergyCalculator
import kotlin.math.max

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RenewableEnergyBottomSheet(
    location: LocationModel,
    cloudCoverPercent: Int,
    windSpeedKmH: Double,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var solarSizeKw by remember { mutableFloatStateOf(5.0f) }
    var windSizeKw by remember { mutableFloatStateOf(3.0f) }

    val yieldData = remember(
        location.latitude,
        location.longitude,
        cloudCoverPercent,
        windSpeedKmH,
        solarSizeKw,
        windSizeKw
    ) {
        RenewableEnergyCalculator.calculateYield(
            latitude = location.latitude,
            longitude = location.longitude,
            cloudCoverPercent = cloudCoverPercent,
            windSpeedKmH = windSpeedKmH,
            solarSystemSizeKw = solarSizeKw.toDouble(),
            windTurbineKw = windSizeKw.toDouble()
        )
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
            // Sheet Header
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
                            .background(AmberWarning.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Bolt,
                            contentDescription = null,
                            tint = AmberWarning,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Clean Energy Estimator",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Text(
                            text = "${location.cityName} · Telemetry Model",
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

            Spacer(modifier = Modifier.height(18.dp))

            // Capacity Sliders Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(DarkCard)
                    .border(1.dp, DarkCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Column {
                    // Solar Slider
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.SolarPower,
                                contentDescription = null,
                                tint = AmberWarning,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Rooftop Solar PV Capacity",
                                color = TextWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Text(
                            text = "${"%.1f".format(solarSizeKw)} kWp",
                            color = AmberWarning,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Slider(
                        value = solarSizeKw,
                        onValueChange = { solarSizeKw = (it * 2).toInt() / 2f },
                        valueRange = 1.0f..15.0f,
                        steps = 27,
                        colors = SliderDefaults.colors(
                            thumbColor = AmberWarning,
                            activeTrackColor = AmberWarning,
                            inactiveTrackColor = PureBlack
                        )
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "1 kWp (Small)", color = TextDim, fontSize = 10.sp)
                        Text(text = "5 kWp (Home)", color = TextDim, fontSize = 10.sp)
                        Text(text = "15 kWp (Large)", color = TextDim, fontSize = 10.sp)
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Wind Slider
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.WindPower,
                                contentDescription = null,
                                tint = CyanPrimary,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Micro Wind Turbine Capacity",
                                color = TextWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Text(
                            text = "${"%.1f".format(windSizeKw)} kW",
                            color = CyanPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Slider(
                        value = windSizeKw,
                        onValueChange = { windSizeKw = (it * 2).toInt() / 2f },
                        valueRange = 1.0f..10.0f,
                        steps = 17,
                        colors = SliderDefaults.colors(
                            thumbColor = CyanPrimary,
                            activeTrackColor = CyanPrimary,
                            inactiveTrackColor = PureBlack
                        )
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "1 kW (Micro)", color = TextDim, fontSize = 10.sp)
                        Text(text = "3 kW (Standard)", color = TextDim, fontSize = 10.sp)
                        Text(text = "10 kW (Farm)", color = TextDim, fontSize = 10.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Dual Diagnostics Grid
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Solar Detailed Card
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(18.dp))
                        .background(DarkCard)
                        .border(1.dp, DarkCardBorder, RoundedCornerShape(18.dp))
                        .padding(14.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Solar Yield",
                                color = TextWhite,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(Color(yieldData.solar.badgeColorHex).copy(alpha = 0.15f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = yieldData.solar.rating,
                                    color = Color(yieldData.solar.badgeColorHex),
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "${yieldData.solar.annualSolarMwh} MWh/yr",
                            color = AmberWarning,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = "~${yieldData.solar.dailySolarKwh} kWh/day",
                            color = TextMuted,
                            fontSize = 11.sp
                        )

                        Spacer(modifier = Modifier.height(8.dp))
                        Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(DarkCardBorder))
                        Spacer(modifier = Modifier.height(8.dp))

                        Text(text = "Peak Sun Hours: ${yieldData.solar.peakSunHours} h/d", color = TextDim, fontSize = 10.sp)
                        Text(text = "GHI: ${yieldData.solar.peakIrradianceWm2} W/m²", color = TextDim, fontSize = 10.sp)
                        Text(text = "Cap. Factor: ${yieldData.solar.capacityFactor}%", color = TextDim, fontSize = 10.sp)
                    }
                }

                // Wind Detailed Card
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(18.dp))
                        .background(DarkCard)
                        .border(1.dp, DarkCardBorder, RoundedCornerShape(18.dp))
                        .padding(14.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Wind Yield",
                                color = TextWhite,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(Color(yieldData.wind.badgeColorHex).copy(alpha = 0.15f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = yieldData.wind.rating,
                                    color = Color(yieldData.wind.badgeColorHex),
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "${yieldData.wind.annualWindMwh} MWh/yr",
                            color = CyanPrimary,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = "~${yieldData.wind.dailyWindKwh} kWh/day",
                            color = TextMuted,
                            fontSize = 11.sp
                        )

                        Spacer(modifier = Modifier.height(8.dp))
                        Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(DarkCardBorder))
                        Spacer(modifier = Modifier.height(8.dp))

                        Text(text = "50m Wind: ${yieldData.wind.windSpeed50mMs} m/s", color = TextDim, fontSize = 10.sp)
                        Text(text = "Power Density: ${yieldData.wind.powerDensityWm2} W/m²", color = TextDim, fontSize = 10.sp)
                        Text(text = "Wind Class: ${yieldData.wind.windClass}/7", color = TextDim, fontSize = 10.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Environmental & Financial Benefits Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(PureBlack.copy(alpha = 0.5f))
                    .border(1.dp, EmeraldGreen.copy(alpha = 0.35f), RoundedCornerShape(18.dp))
                    .padding(14.dp)
            ) {
                Column {
                    Text(
                        text = "Total Clean Energy & Financial Return",
                        color = EmeraldGreen,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.EnergySavingsLeaf, null, tint = EmeraldGreen, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Avoided CO₂e", color = TextDim, fontSize = 10.sp)
                            }
                            Text(
                                text = "${yieldData.impact.co2AvoidedKgYear} kg/yr",
                                color = TextWhite,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Park, null, tint = EmeraldGreen, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Tree Planting Equiv.", color = TextDim, fontSize = 10.sp)
                            }
                            Text(
                                text = "${yieldData.impact.treesEquivalentYear} Trees/yr",
                                color = TextWhite,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.AttachMoney, null, tint = AmberWarning, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Utility Savings", color = TextDim, fontSize = 10.sp)
                            }
                            Text(
                                text = "\$${yieldData.impact.estimatedSavingsUsdYear}/yr",
                                color = AmberWarning,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Diurnal Generation Curves (Canvas Chart)
            Text(
                text = "Diurnal Generation Profile (24-Hour Solar vs Wind)",
                color = TextWhite,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(PureBlack)
                    .border(1.dp, DarkCardBorder, RoundedCornerShape(18.dp))
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                val profile = yieldData.hourlyProfile
                val maxKw = max(1.0, profile.maxOf { it.totalKw } * 1.15)

                Canvas(modifier = Modifier.fillMaxWidth().height(130.dp)) {
                    val w = size.width
                    val h = size.height

                    // Grid lines
                    val gridStroke = Stroke(width = 1.dp.toPx(), pathEffect = PathEffect.dashPathEffect(floatArrayOf(4f, 4f), 0f))
                    drawLine(color = Color.White.copy(alpha = 0.08f), start = Offset(0f, 0f), end = Offset(w, 0f), strokeWidth = 1f)
                    drawLine(color = Color.White.copy(alpha = 0.08f), start = Offset(0f, h / 2f), end = Offset(w, h / 2f), strokeWidth = 1f)
                    drawLine(color = Color.White.copy(alpha = 0.15f), start = Offset(0f, h), end = Offset(w, h), strokeWidth = 1f)

                    val solarPath = Path()
                    val solarAreaPath = Path()
                    val windPath = Path()

                    solarAreaPath.moveTo(0f, h)

                    profile.forEachIndexed { i, point ->
                        val x = (i / 23f) * w
                        val solarY = h - ((point.solarKw / maxKw) * h).toFloat()
                        val windY = h - ((point.windKw / maxKw) * h).toFloat()

                        if (i == 0) {
                            solarPath.moveTo(x, solarY)
                            solarAreaPath.lineTo(x, solarY)
                            windPath.moveTo(x, windY)
                        } else {
                            solarPath.lineTo(x, solarY)
                            solarAreaPath.lineTo(x, solarY)
                            windPath.lineTo(x, windY)
                        }
                    }

                    solarAreaPath.lineTo(w, h)
                    solarAreaPath.close()

                    // Draw solar filled area
                    drawPath(
                        path = solarAreaPath,
                        brush = Brush.verticalGradient(
                            colors = listOf(AmberWarning.copy(alpha = 0.35f), Color.Transparent),
                            startY = 0f,
                            endY = h
                        )
                    )

                    // Draw solar line
                    drawPath(
                        path = solarPath,
                        color = AmberWarning,
                        style = Stroke(width = 2.5.dp.toPx(), cap = StrokeCap.Round)
                    )

                    // Draw wind line
                    drawPath(
                        path = windPath,
                        color = CyanPrimary,
                        style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round)
                    )
                }

                // X-Axis Hour Labels & Chart Legend
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "00:00", color = TextDim, fontSize = 9.sp)
                        Text(text = "06:00", color = TextDim, fontSize = 9.sp)
                        Text(text = "12:00 (Noon)", color = TextDim, fontSize = 9.sp)
                        Text(text = "18:00", color = TextDim, fontSize = 9.sp)
                        Text(text = "23:00", color = TextDim, fontSize = 9.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Chart Legend
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(AmberWarning))
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = "Solar PV Bell Curve", color = TextWhite, fontSize = 11.sp)
                Spacer(modifier = Modifier.width(16.dp))
                Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(CyanPrimary))
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = "Wind Generation Profile", color = TextWhite, fontSize = 11.sp)
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
