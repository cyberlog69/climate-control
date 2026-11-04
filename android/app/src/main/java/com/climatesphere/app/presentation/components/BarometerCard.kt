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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.climatesphere.app.core.sensor.BarometerData
import com.climatesphere.app.core.sensor.PressureTrend
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.GreenAqi
import com.climatesphere.app.core.theme.RedAlert
import com.climatesphere.app.core.theme.SkeuoLedDiode
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.YellowAqi
import com.climatesphere.app.core.theme.skeuoBezel
import com.climatesphere.app.core.theme.skeuoCard
import com.climatesphere.app.core.theme.skeuoLcdPanel
import com.climatesphere.app.core.theme.skeuoRecessedWell

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
                    // Machined metallic bezel icon box
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFF070B14))
                            .skeuoBezel(RoundedCornerShape(12.dp), borderWidth = 1.5.dp),
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
                            text = if (barometerData.isHardwareSensor) "Hardware Piezoelectric Barometer" else "Orbital Station Telemetry",
                            style = MaterialTheme.typography.labelSmall,
                            color = if (barometerData.isHardwareSensor) GreenAqi else CyanPrimary,
                            fontSize = 11.sp
                        )
                    }
                }

                // Tactile Trend Badge with LED diode
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF070B14))
                        .border(1.dp, trendColor.copy(alpha = 0.45f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    SkeuoLedDiode(color = trendColor, size = 7.dp, isPulsing = barometerData.trend == PressureTrend.RAPID_DROP)
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "${barometerData.trend.label} ${barometerData.trend.symbol}",
                        color = trendColor,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Main Skeuomorphic LCD Pressure Bay
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoLcdPanel(shape = RoundedCornerShape(18.dp), accentColor = trendColor)
                    .padding(16.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.Bottom,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        Text(
                            text = "STATION PRESSURE",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextDim,
                            letterSpacing = 1.sp,
                            fontSize = 10.sp
                        )
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = String.format(java.util.Locale.US, "%.1f", pressure),
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontSize = 42.sp,
                                    fontFamily = FontFamily.SansSerif
                                ),
                                fontWeight = FontWeight.ExtraBold,
                                color = TextWhite
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "hPa",
                                style = MaterialTheme.typography.titleMedium,
                                color = CyanPrimary,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )
                        }
                    }

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
            }

            // Storm Alert Banner if rapid drop detected
            if (barometerData.isStormAlert) {
                Spacer(modifier = Modifier.height(14.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(0xFF140808))
                        .border(1.dp, RedAlert.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
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

            // Sub-metrics Row (Debossed Recessed Well)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoRecessedWell(RoundedCornerShape(14.dp))
                    .padding(12.dp),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "Sensor Type", style = MaterialTheme.typography.labelSmall, color = TextDim, fontSize = 10.sp)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = if (barometerData.isHardwareSensor) "On-Board Piezo" else "Virtual Station",
                        style = MaterialTheme.typography.labelMedium,
                        color = TextWhite,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "Atmospheric Delta", style = MaterialTheme.typography.labelSmall, color = TextDim, fontSize = 10.sp)
                    val deltaSign = if (barometerData.deltaHpa >= 0) "+" else ""
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "$deltaSign${String.format(java.util.Locale.US, "%.1f", barometerData.deltaHpa)} hPa",
                        style = MaterialTheme.typography.labelMedium,
                        color = trendColor,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "Baric State", style = MaterialTheme.typography.labelSmall, color = TextDim, fontSize = 10.sp)
                    val stateLabel = when {
                        pressure > 1020 -> "High Pressure"
                        pressure < 1005 -> "Low Pressure"
                        else -> "Normal Zone"
                    }
                    Spacer(modifier = Modifier.height(2.dp))
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
