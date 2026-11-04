package com.climatesphere.app.presentation.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.climatesphere.app.core.theme.AmberWarning
import com.climatesphere.app.core.theme.BlueSky
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.EmeraldGreen
import com.climatesphere.app.core.theme.PureBlack
import com.climatesphere.app.core.theme.RedAlert
import com.climatesphere.app.core.theme.SkeuoLedDiode
import com.climatesphere.app.core.theme.SkeuoMeterTrack
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.skeuoBezel
import com.climatesphere.app.core.theme.skeuoCard
import com.climatesphere.app.core.theme.skeuoLcdPanel
import com.climatesphere.app.core.theme.skeuoPushButton
import com.climatesphere.app.core.theme.skeuoRecessedWell
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WildfireHotspot
import com.climatesphere.app.domain.model.WildfireSentinelData
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.min
import kotlin.math.sin

@Composable
fun WildfireRadarCard(
    currentLocation: LocationModel,
    temperatureC: Double,
    humidityPercent: Int,
    windSpeedKmH: Double,
    onSelectHotspotLocation: ((LocationModel) -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val assessment = remember(currentLocation.latitude, currentLocation.longitude, temperatureC, humidityPercent, windSpeedKmH) {
        WildfireSentinelData.evaluateLocalWildfireRisk(
            lat = currentLocation.latitude,
            lon = currentLocation.longitude,
            temperatureC = temperatureC,
            humidityPercent = humidityPercent,
            windSpeedKmH = windSpeedKmH
        )
    }

    val riskColor = Color(assessment.colorHex)
    var selectedHotspot by remember { mutableStateOf<WildfireHotspot?>(assessment.nearestCluster) }

    // Radar scanner animation
    val infiniteTransition = rememberInfiniteTransition(label = "RadarSweep")
    val sweepAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "SweepAngle"
    )

    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.3f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "PulseScale"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .skeuoCard(RoundedCornerShape(24.dp))
            .padding(20.dp)
    ) {
        Column {
            // Header Row
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
                            .background(Color(0xFF070B14))
                            .skeuoBezel(RoundedCornerShape(12.dp), borderWidth = 1.5.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocalFireDepartment,
                            contentDescription = "Wildfire Radar",
                            tint = RedAlert,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "NASA Wildfire Sentinel",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            SkeuoLedDiode(color = RedAlert, size = 6.dp, isPulsing = true)
                            Spacer(modifier = Modifier.width(5.dp))
                            Text(
                                text = "VIIRS / MODIS Orbital Feeds",
                                style = MaterialTheme.typography.labelSmall,
                                color = RedAlert,
                                fontSize = 11.sp
                            )
                        }
                    }
                }

                // Tactile Risk Badge
                val riskColor = Color(assessment.colorHex)
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0xFF070B14))
                        .border(1.dp, riskColor.copy(alpha = 0.5f), RoundedCornerShape(10.dp))
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    SkeuoLedDiode(color = riskColor, size = 6.dp, isPulsing = true)
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "${assessment.badgeName.uppercase()} RISK",
                        color = riskColor,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 11.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 3-Metric Global Activity Bar (Debossed Instrument Wells)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Metric 1: Clusters
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .skeuoRecessedWell(RoundedCornerShape(14.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Text(
                            text = "Active Clusters",
                            color = TextDim,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "${assessment.totalGlobalClusters}",
                            color = TextWhite,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Orbital Scans",
                            color = TextDim,
                            fontSize = 9.sp
                        )
                    }
                }

                // Metric 2: Severe Outbreaks
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .skeuoRecessedWell(RoundedCornerShape(14.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Text(
                            text = "Severe (>500MW)",
                            color = TextDim,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "${assessment.severeOutbreaksCount} Zones",
                            color = RedAlert,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "FRP Outbreaks",
                            color = TextDim,
                            fontSize = 9.sp
                        )
                    }
                }

                // Metric 3: Peak FRP
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .skeuoRecessedWell(RoundedCornerShape(14.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Text(
                            text = "Peak Radiative",
                            color = TextDim,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "${assessment.peakFrpMw.toInt()} MW",
                            color = AmberWarning,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Amazon Basin",
                            color = TextDim,
                            fontSize = 9.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Local Proximity Hazard Banner (LCD Readout)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoLcdPanel(shape = RoundedCornerShape(16.dp), accentColor = riskColor)
                    .padding(14.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Sensors,
                                contentDescription = null,
                                tint = riskColor,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Local Hazard Index: ${currentLocation.cityName}",
                                color = TextWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Text(
                            text = "${assessment.score}/100",
                            color = riskColor,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Danger score debossed meter track
                    SkeuoMeterTrack(
                        progress = assessment.score / 100f,
                        trackHeight = 6.dp,
                        fillGradient = listOf(EmeraldGreen, AmberWarning, RedAlert)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Nearest active cluster is ~${assessment.minDistanceKm} km away (${assessment.nearestCluster?.name ?: "Unknown"}).",
                        color = TextMuted,
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Native Compose Radar Canvas Screen (Skeuomorphic Oscilloscope Frame)
            Text(
                text = "Orbital Thermal Radar (10,000 km Sentinel Field)",
                color = TextWhite,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .skeuoLcdPanel(shape = RoundedCornerShape(18.dp), accentColor = CyanPrimary),
                contentAlignment = Alignment.Center
            ) {
                val hotspots = WildfireSentinelData.GLOBAL_HOTSPOTS
                val userLat = currentLocation.latitude
                val userLon = currentLocation.longitude

                Canvas(
                    modifier = Modifier.size(180.dp)
                ) {
                    val center = Offset(size.width / 2f, size.height / 2f)
                    val maxRadius = min(size.width, size.height) / 2f - 8.dp.toPx()

                    // Range Rings
                    val dashedStroke = Stroke(
                        width = 1.dp.toPx(),
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(6f, 6f), 0f)
                    )
                    drawCircle(color = CyanPrimary.copy(alpha = 0.12f), radius = maxRadius, center = center, style = dashedStroke)
                    drawCircle(color = CyanPrimary.copy(alpha = 0.18f), radius = maxRadius * 0.66f, center = center, style = dashedStroke)
                    drawCircle(color = CyanPrimary.copy(alpha = 0.25f), radius = maxRadius * 0.33f, center = center, style = dashedStroke)

                    // Crosshair Lines
                    drawLine(
                        color = CyanPrimary.copy(alpha = 0.15f),
                        start = Offset(center.x, center.y - maxRadius),
                        end = Offset(center.x, center.y + maxRadius),
                        strokeWidth = 1.dp.toPx()
                    )
                    drawLine(
                        color = CyanPrimary.copy(alpha = 0.15f),
                        start = Offset(center.x - maxRadius, center.y),
                        end = Offset(center.x + maxRadius, center.y),
                        strokeWidth = 1.dp.toPx()
                    )

                    // Rotating Radar Sweep Line
                    val sweepRad = Math.toRadians(sweepAngle.toDouble())
                    val sweepEnd = Offset(
                        x = center.x + (maxRadius * cos(sweepRad)).toFloat(),
                        y = center.y + (maxRadius * sin(sweepRad)).toFloat()
                    )
                    drawLine(
                        brush = Brush.radialGradient(
                            colors = listOf(CyanPrimary, CyanPrimary.copy(alpha = 0.05f)),
                            center = center,
                            radius = maxRadius
                        ),
                        start = center,
                        end = sweepEnd,
                        strokeWidth = 2.dp.toPx()
                    )

                    // Plot Wildfire Blips relative to user coordinates
                    val maxRangeKm = 12000.0
                    hotspots.forEach { fire ->
                        val distKm = WildfireSentinelData.calculateDistanceKm(userLat, userLon, fire.latitude, fire.longitude)
                        val normDist = (distKm / maxRangeKm).coerceIn(0.08, 0.98)
                        val radiusPx = maxRadius * normDist.toFloat()

                        val dLon = Math.toRadians(fire.longitude - userLon)
                        val y = sin(dLon) * cos(Math.toRadians(fire.latitude))
                        val x = cos(Math.toRadians(userLat)) * sin(Math.toRadians(fire.latitude)) -
                                sin(Math.toRadians(userLat)) * cos(Math.toRadians(fire.latitude)) * cos(dLon)
                        val bearingRad = atan2(y, x)

                        val blipOffset = Offset(
                            x = center.x + (radiusPx * sin(bearingRad)).toFloat(),
                            y = center.y - (radiusPx * cos(bearingRad)).toFloat()
                        )

                        val isHighFrp = fire.frp >= 500.0
                        val blipColor = if (isHighFrp) RedAlert else AmberWarning

                        // Pulsating glow
                        drawCircle(
                            color = blipColor.copy(alpha = 0.25f),
                            radius = 7.dp.toPx() * pulseScale,
                            center = blipOffset
                        )
                        // Inner dot
                        drawCircle(
                            color = blipColor,
                            radius = 3.5.dp.toPx(),
                            center = blipOffset
                        )
                    }

                    // User Center Blip (GPS Location)
                    drawCircle(color = CyanPrimary.copy(alpha = 0.35f), radius = 6.dp.toPx(), center = center)
                    drawCircle(color = CyanPrimary, radius = 3.dp.toPx(), center = center)
                }

                // Range legends overlay
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                        .align(Alignment.BottomStart)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "R1: 4,000km", color = TextDim, fontSize = 9.sp)
                        Text(text = "R2: 8,000km", color = TextDim, fontSize = 9.sp)
                        Text(text = "R3: 12,000km", color = TextDim, fontSize = 9.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Horizontal Cluster Selector Tactile Push Keys
            Text(
                text = "Active Orbital Thermal Clusters",
                color = TextWhite,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                WildfireSentinelData.GLOBAL_HOTSPOTS.forEach { fire ->
                    val isSelected = selectedHotspot?.id == fire.id
                    val distKm = WildfireSentinelData.calculateDistanceKm(
                        currentLocation.latitude,
                        currentLocation.longitude,
                        fire.latitude,
                        fire.longitude
                    )

                    Box(
                        modifier = Modifier
                            .skeuoPushButton(
                                isSelected = isSelected,
                                shape = RoundedCornerShape(12.dp),
                                activeAccent = RedAlert,
                                onClick = { selectedHotspot = fire }
                            )
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                SkeuoLedDiode(
                                    color = if (fire.frp >= 500) RedAlert else AmberWarning,
                                    size = 6.dp
                                )
                                Spacer(modifier = Modifier.width(5.dp))
                                Text(
                                    text = fire.name.split(",")[0],
                                    color = TextWhite,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${distKm} km · ${fire.frp.toInt()} MW",
                                color = TextDim,
                                fontSize = 10.sp
                            )
                        }
                    }
                }
            }

            // Selected Hotspot Detail Card (Debossed Well)
            selectedHotspot?.let { fire ->
                val distKm = WildfireSentinelData.calculateDistanceKm(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    fire.latitude,
                    fire.longitude
                )

                Spacer(modifier = Modifier.height(10.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .skeuoRecessedWell(RoundedCornerShape(14.dp))
                        .padding(12.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = fire.name,
                                color = TextWhite,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(RedAlert.copy(alpha = 0.15f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = fire.sensor,
                                    color = RedAlert,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "FRP: ${fire.frp} MW  ·  Temp: ${fire.brightnessTempC}°C",
                                color = AmberWarning,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = "${fire.activeClusters} Clusters (${fire.status})",
                                color = BlueSky,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Biome: ${fire.biome} · ${fire.detectedAgo}",
                                color = TextDim,
                                fontSize = 10.sp
                            )

                            if (onSelectHotspotLocation != null) {
                                Box(
                                    modifier = Modifier
                                        .skeuoPushButton(
                                            isSelected = false,
                                            shape = RoundedCornerShape(8.dp),
                                            activeAccent = CyanPrimary,
                                            onClick = {
                                                onSelectHotspotLocation(
                                                    LocationModel(
                                                        name = fire.name,
                                                        cityName = fire.name.split(",")[0],
                                                        country = fire.region,
                                                        latitude = fire.latitude,
                                                        longitude = fire.longitude
                                                    )
                                                )
                                            }
                                        )
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.Navigation,
                                            contentDescription = "Inspect",
                                            tint = CyanPrimary,
                                            modifier = Modifier.size(10.dp)
                                        )
                                        Spacer(modifier = Modifier.width(3.dp))
                                        Text(
                                            text = "Inspect Weather",
                                            color = CyanPrimary,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
