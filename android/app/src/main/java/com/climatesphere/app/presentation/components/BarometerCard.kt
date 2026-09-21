package com.climatesphere.app.presentation.components

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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.climatesphere.app.core.sensor.BarometerData
import com.climatesphere.app.core.sensor.PressureTrend
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.DarkCard
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.GreenAqi
import com.climatesphere.app.core.theme.RedAlert
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.YellowAqi

@Composable
fun BarometerCard(
    barometerData: BarometerData,
    modifier: Modifier = Modifier
) {
    val pressure = barometerData.pressureHpa ?: return

    val trendColor = when (barometerData.trend) {
        PressureTrend.RISING -> GreenAqi
        PressureTrend.STEADY -> CyanPrimary
        PressureTrend.FALLING -> YellowAqi
        PressureTrend.RAPID_DROP -> RedAlert
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(DarkCard)
            .border(1.dp, DarkCardBorder, RoundedCornerShape(24.dp))
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
                            .size(36.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(CyanPrimary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Speed,
                            contentDescription = "Barometer",
                            tint = CyanPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Barometric Pressure",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Text(
                            text = if (barometerData.isHardwareSensor) "Hardware Barometer Active" else "Station Telemetry Feed",
                            style = MaterialTheme.typography.labelSmall,
                            color = if (barometerData.isHardwareSensor) GreenAqi else CyanPrimary,
                            fontSize = 11.sp
                        )
                    }
                }

                // Trend Badge
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(trendColor.copy(alpha = 0.15f))
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = "${barometerData.trend.label} ${barometerData.trend.symbol}",
                        color = trendColor,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Large Pressure Display
            Row(
                verticalAlignment = Alignment.Bottom,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = String.format(java.util.Locale.US, "%.1f", pressure),
                    style = MaterialTheme.typography.headlineLarge,
                    fontWeight = FontWeight.ExtraBold,
                    color = TextWhite,
                    fontSize = 40.sp,
                    lineHeight = 44.sp
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "hPa",
                    style = MaterialTheme.typography.titleMedium,
                    color = CyanPrimary,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(bottom = 6.dp)
                )

                Spacer(modifier = Modifier.weight(1f))

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "Standard Sea-Level",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextDim,
                        fontSize = 10.sp
                    )
                    Text(
                        text = "1013.3 hPa",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextMuted,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // Storm Alert Banner if rapid drop detected
            if (barometerData.isStormAlert) {
                Spacer(modifier = Modifier.height(14.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(RedAlert.copy(alpha = 0.15f))
                        .border(1.dp, RedAlert.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
                        .padding(12.dp)
                ) {
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(
                            imageVector = Icons.Default.WarningAmber,
                            contentDescription = "Storm Alert",
                            tint = RedAlert,
                            modifier = Modifier
                                .size(20.dp)
                                .padding(top = 1.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Storm Front Warning",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = RedAlert
                            )
                            Text(
                                text = "Rapid drop of ${barometerData.deltaHpa} hPa detected. Steep atmospheric drops typically indicate incoming squalls or thunderstorms.",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextWhite,
                                fontSize = 11.sp,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Sub-metrics Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.White.copy(alpha = 0.04f))
                    .padding(10.dp),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "Sensor Type", style = MaterialTheme.typography.labelSmall, color = TextDim)
                    Text(
                        text = if (barometerData.isHardwareSensor) "On-Board Piezo" else "Virtual Station",
                        style = MaterialTheme.typography.labelMedium,
                        color = TextWhite,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "Atmospheric Delta", style = MaterialTheme.typography.labelSmall, color = TextDim)
                    val deltaSign = if (barometerData.deltaHpa >= 0) "+" else ""
                    Text(
                        text = "$deltaSign${String.format(java.util.Locale.US, "%.1f", barometerData.deltaHpa)} hPa",
                        style = MaterialTheme.typography.labelMedium,
                        color = trendColor,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "Baric State", style = MaterialTheme.typography.labelSmall, color = TextDim)
                    val stateLabel = when {
                        pressure > 1020 -> "High Pressure"
                        pressure < 1005 -> "Low Pressure"
                        else -> "Normal Zone"
                    }
                    Text(
                        text = stateLabel,
                        style = MaterialTheme.typography.labelMedium,
                        color = TextWhite,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}
