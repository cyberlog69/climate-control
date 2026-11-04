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
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.SkeuoLedDiode
import com.climatesphere.app.core.theme.SkeuoMeterTrack
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.skeuoBezel
import com.climatesphere.app.core.theme.skeuoCard
import com.climatesphere.app.core.theme.skeuoLcdPanel
import com.climatesphere.app.core.theme.skeuoRecessedWell
import com.climatesphere.app.domain.model.AirQualityModel

@Composable
fun AirQualityCard(
    airQuality: AirQualityModel,
    modifier: Modifier = Modifier
) {
    val levelColor = Color(airQuality.colorHex)

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
                    SkeuoLedDiode(color = levelColor, isPulsing = true, size = 10.dp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Air Quality Index",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                }

                // Tactile Status Badge
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF070B14))
                        .border(1.dp, levelColor.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = airQuality.level.uppercase(),
                        color = levelColor,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp,
                        letterSpacing = 0.5.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Main Skeuomorphic Digital Readout Bay
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoLcdPanel(shape = RoundedCornerShape(18.dp), accentColor = levelColor)
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "POLLUTION SEVERITY",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextDim,
                            letterSpacing = 1.sp,
                            fontSize = 10.sp
                        )
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "${airQuality.aqi}",
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontSize = 44.sp,
                                    fontFamily = FontFamily.SansSerif
                                ),
                                fontWeight = FontWeight.ExtraBold,
                                color = levelColor
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "AQI (US Std)",
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextMuted,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                        }
                    }

                    // Machined Metallic Circular Gauge Dial
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF070B14))
                            .skeuoBezel(CircleShape, borderWidth = 2.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            SkeuoLedDiode(color = levelColor, size = 12.dp, isPulsing = true)
                            Spacer(modifier = Modifier.height(3.dp))
                            Text(
                                text = "RAD",
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextDim
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Pollutants Breakdown Grid (Debossed Instrument Wells)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                PollutantRecessedItem(
                    label = "PM2.5",
                    value = "${airQuality.pm25}",
                    unit = "µg/m³",
                    progress = (airQuality.pm25 / 75.0).toFloat(),
                    accentColor = if (airQuality.pm25 > 35) Color(0xFFEF4444) else Color(0xFF10B981),
                    modifier = Modifier.weight(1f)
                )
                PollutantRecessedItem(
                    label = "PM10",
                    value = "${airQuality.pm10}",
                    unit = "µg/m³",
                    progress = (airQuality.pm10 / 150.0).toFloat(),
                    accentColor = if (airQuality.pm10 > 75) Color(0xFFF59E0B) else Color(0xFF10B981),
                    modifier = Modifier.weight(1f)
                )
                PollutantRecessedItem(
                    label = "Ozone",
                    value = "${airQuality.ozone}",
                    unit = "µg/m³",
                    progress = (airQuality.ozone / 180.0).toFloat(),
                    accentColor = Color(0xFF38BDF8),
                    modifier = Modifier.weight(1f)
                )
                PollutantRecessedItem(
                    label = "UV Index",
                    value = "${airQuality.uvIndex}",
                    unit = "Idx",
                    progress = (airQuality.uvIndex / 11.0).toFloat(),
                    accentColor = Color(0xFFA855F7),
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun PollutantRecessedItem(
    label: String,
    value: String,
    unit: String,
    progress: Float,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .skeuoRecessedWell(RoundedCornerShape(14.dp))
            .padding(10.dp)
    ) {
        Column {
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = TextDim,
                fontSize = 10.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.bodyLarge,
                color = TextWhite,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp
            )
            Text(
                text = unit,
                style = MaterialTheme.typography.labelSmall,
                color = TextMuted,
                fontSize = 9.sp
            )
            Spacer(modifier = Modifier.height(6.dp))
            SkeuoMeterTrack(
                progress = progress,
                trackHeight = 4.dp,
                fillColor = accentColor
            )
        }
    }
}
