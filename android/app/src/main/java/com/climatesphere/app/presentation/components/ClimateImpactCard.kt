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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.WaterDamage
import androidx.compose.material.icons.filled.WbSunny
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.climatesphere.app.core.theme.BlueSky
import com.climatesphere.app.core.theme.PurpleAura
import com.climatesphere.app.core.theme.RedAlert
import com.climatesphere.app.core.theme.SkeuoLedDiode
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.skeuoBezel
import com.climatesphere.app.core.theme.skeuoCard
import com.climatesphere.app.core.theme.skeuoLcdPanel
import com.climatesphere.app.core.theme.skeuoPushButton
import com.climatesphere.app.domain.model.ClimateImpactCalculator
import com.climatesphere.app.domain.model.LocationModel

@Composable
fun ClimateImpactCard(
    location: LocationModel,
    onOpenSimulator: () -> Unit,
    modifier: Modifier = Modifier
) {
    val projection = remember(location.latitude, location.longitude) {
        ClimateImpactCalculator.calculateProjection(
            warmingDegree = 2.0,
            latitude = location.latitude,
            longitude = location.longitude
        )
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
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFF070B14))
                            .skeuoBezel(RoundedCornerShape(12.dp), borderWidth = 1.5.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Tune,
                            contentDescription = "Climate Impact Simulator",
                            tint = PurpleAura,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Climate Impact Model",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Text(
                            text = "IPCC AR6 Warming Projections",
                            style = MaterialTheme.typography.labelSmall,
                            color = PurpleAura,
                            fontSize = 11.sp
                        )
                    }
                }

                // Tactile Threshold Badge with LED
                val badgeColor = Color(projection.activeScenario.badgeColorHex)
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0xFF070B14))
                        .border(1.dp, badgeColor.copy(alpha = 0.45f), RoundedCornerShape(10.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    SkeuoLedDiode(color = badgeColor, size = 6.dp)
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "+2.0°C THRESHOLD",
                        color = badgeColor,
                        fontWeight = FontWeight.Bold,
                        fontSize = 10.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Two Key Metrics Preview (Skeuomorphic LCD Bays)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Sea Level Rise LCD
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .skeuoLcdPanel(shape = RoundedCornerShape(16.dp), accentColor = BlueSky)
                        .padding(14.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.WaterDamage, null, tint = BlueSky, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Sea Level Rise", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "+${projection.seaLevelRiseMeters} m",
                            color = BlueSky,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = if (projection.isCoastal) "High Coastal Vulnerability" else "Estuary & Surge Index",
                            color = TextDim,
                            fontSize = 10.sp
                        )
                    }
                }

                // Heatwave Days LCD
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .skeuoLcdPanel(shape = RoundedCornerShape(16.dp), accentColor = RedAlert)
                        .padding(14.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.WbSunny, null, tint = RedAlert, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Extreme Heat Days", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "+${projection.extraHeatwaveDays} d/yr",
                            color = RedAlert,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Days exceeding >35°C",
                            color = TextDim,
                            fontSize = 10.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Action: Extruded Tactile Push Key
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoPushButton(
                        isSelected = false,
                        shape = RoundedCornerShape(12.dp),
                        activeAccent = PurpleAura,
                        onClick = onOpenSimulator
                    )
                    .padding(horizontal = 14.dp, vertical = 11.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        SkeuoLedDiode(color = PurpleAura, size = 6.dp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Simulate Scenarios (+1.5°C to +4.0°C)",
                            color = TextWhite,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = "Open",
                        tint = PurpleAura,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}
