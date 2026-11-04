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
import androidx.compose.material.icons.filled.Air
import androidx.compose.material.icons.filled.Compress
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material.icons.filled.WbSunny
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.SkeuoLedDiode
import com.climatesphere.app.core.theme.SkeuoWellBorder
import com.climatesphere.app.core.theme.SkeuoWellFill
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.skeuoCard
import com.climatesphere.app.core.theme.skeuoLcdPanel
import com.climatesphere.app.core.theme.skeuoRecessedWell
import com.climatesphere.app.domain.model.CurrentWeatherModel
import kotlin.math.roundToInt

@Composable
fun WeatherHeroCard(
    current: CurrentWeatherModel,
    locationName: String,
    isFromCache: Boolean = false,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .skeuoCard(RoundedCornerShape(24.dp))
            .padding(20.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Top Status Bar: Cache status or live telemetry diode
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Live Diode Badge
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF070B14))
                        .border(1.dp, SkeuoWellBorder, RoundedCornerShape(12.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    SkeuoLedDiode(
                        color = if (isFromCache) Color(0xFFF59E0B) else Color(0xFF10B981),
                        isPulsing = !isFromCache,
                        size = 8.dp
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isFromCache) "OFFLINE CACHE" else "LIVE TELEMETRY",
                        color = if (isFromCache) Color(0xFFF59E0B) else Color(0xFF10B981),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.8.sp
                    )
                }

                // Weather Station Badge
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF070B14))
                        .border(1.dp, SkeuoWellBorder, RoundedCornerShape(12.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.WbSunny,
                        contentDescription = null,
                        tint = CyanPrimary,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "SENSOR ACTIVE",
                        color = TextMuted,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = locationName,
                style = MaterialTheme.typography.titleLarge,
                color = TextWhite,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = current.weatherDescription,
                style = MaterialTheme.typography.bodyLarge,
                color = CyanPrimary,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Main Skeuomorphic High-Contrast LCD Temperature Bay
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoLcdPanel(shape = RoundedCornerShape(20.dp), accentColor = CyanPrimary)
                    .padding(vertical = 18.dp, horizontal = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "${current.temperature.roundToInt()}°",
                        style = MaterialTheme.typography.displayLarge.copy(
                            fontSize = 82.sp,
                            fontFamily = FontFamily.SansSerif
                        ),
                        color = TextWhite,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = (-2).sp
                    )

                    Spacer(modifier = Modifier.height(2.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        SkeuoLedDiode(color = CyanPrimary, size = 6.dp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Feels like ${current.apparentTemperature.roundToInt()}°",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextMuted,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 3-Column Weather Metrics Bar (Debossed Instrument Well)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoRecessedWell(RoundedCornerShape(18.dp))
                    .padding(vertical = 12.dp, horizontal = 8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                WeatherMetricItem(
                    icon = Icons.Default.WaterDrop,
                    label = "Humidity",
                    value = "${current.humidity}%",
                    tint = Color(0xFF38BDF8)
                )
                WeatherMetricItem(
                    icon = Icons.Default.Air,
                    label = "Wind",
                    value = "${current.windSpeed.roundToInt()} km/h",
                    tint = CyanPrimary
                )
                WeatherMetricItem(
                    icon = Icons.Default.Compress,
                    label = "Pressure",
                    value = "${current.surfacePressure.roundToInt()} hPa",
                    tint = Color(0xFFA78BFA)
                )
            }
        }
    }
}

@Composable
private fun WeatherMetricItem(
    icon: ImageVector,
    label: String,
    value: String,
    tint: Color
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFF04070E))
            .border(1.dp, Color(0xFF0D1524), RoundedCornerShape(12.dp))
            .padding(horizontal = 14.dp, vertical = 8.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = tint,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Bold,
            color = TextWhite
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = TextDim,
            fontSize = 10.sp
        )
    }
}
