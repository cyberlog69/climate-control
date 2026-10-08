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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Thermostat
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
import com.climatesphere.app.core.theme.DarkCard
import com.climatesphere.app.core.theme.DarkCardBorder
import com.climatesphere.app.core.theme.PureBlack
import com.climatesphere.app.core.theme.PurpleAura
import com.climatesphere.app.core.theme.RedAlert
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextWhite
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
            .clip(RoundedCornerShape(24.dp))
            .background(DarkCard)
            .border(1.dp, DarkCardBorder, RoundedCornerShape(24.dp))
            .padding(20.dp)
    ) {
        Column {
            // Header
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
                            .background(PurpleAura.copy(alpha = 0.15f)),
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
                            text = "Climate Impact Simulator",
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

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(projection.activeScenario.badgeColorHex).copy(alpha = 0.15f))
                        .border(1.dp, Color(projection.activeScenario.badgeColorHex).copy(alpha = 0.35f), RoundedCornerShape(10.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "+2.0°C THRESHOLD",
                        color = Color(projection.activeScenario.badgeColorHex),
                        fontWeight = FontWeight.Bold,
                        fontSize = 10.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Two Key Metrics Preview
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Sea Level Rise
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(PureBlack.copy(alpha = 0.5f))
                        .border(1.dp, DarkCardBorder, RoundedCornerShape(16.dp))
                        .padding(12.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.WaterDamage, null, tint = BlueSky, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Sea Level Rise", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "+${projection.seaLevelRiseMeters} m",
                            color = BlueSky,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (projection.isCoastal) "High Coastal Vulnerability" else "Estuary & Basin Surge",
                            color = TextDim,
                            fontSize = 10.sp
                        )
                    }
                }

                // Heatwave Days
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(PureBlack.copy(alpha = 0.5f))
                        .border(1.dp, DarkCardBorder, RoundedCornerShape(16.dp))
                        .padding(12.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.WbSunny, null, tint = RedAlert, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Extreme Heat Days", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "+${projection.extraHeatwaveDays} Days/yr",
                            color = RedAlert,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Days exceeding >35°C",
                            color = TextDim,
                            fontSize = 10.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Action: Open Simulator
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(PurpleAura.copy(alpha = 0.12f))
                    .border(1.dp, PurpleAura.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                    .clickable { onOpenSimulator() }
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Simulate Scenarios (+1.5°C to +4.0°C)",
                        color = PurpleAura,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
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
