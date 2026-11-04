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
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Park
import androidx.compose.material.icons.filled.SolarPower
import androidx.compose.material.icons.filled.WindPower
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
import com.climatesphere.app.core.theme.AmberWarning
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.EmeraldGreen
import com.climatesphere.app.core.theme.SkeuoLedDiode
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.skeuoBezel
import com.climatesphere.app.core.theme.skeuoCard
import com.climatesphere.app.core.theme.skeuoLcdPanel
import com.climatesphere.app.core.theme.skeuoPushButton
import com.climatesphere.app.core.theme.skeuoRecessedWell
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.RenewableEnergyCalculator

@Composable
fun RenewableEnergyCard(
    location: LocationModel,
    cloudCoverPercent: Int,
    windSpeedKmH: Double,
    onOpenCalculator: () -> Unit,
    modifier: Modifier = Modifier
) {
    val yieldData = remember(location.latitude, location.longitude, cloudCoverPercent, windSpeedKmH) {
        RenewableEnergyCalculator.calculateYield(
            latitude = location.latitude,
            longitude = location.longitude,
            cloudCoverPercent = cloudCoverPercent,
            windSpeedKmH = windSpeedKmH,
            solarSystemSizeKw = 5.0,
            windTurbineKw = 3.0
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
                            imageVector = Icons.Default.Bolt,
                            contentDescription = "Renewable Energy",
                            tint = AmberWarning,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Clean Energy Potential",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Text(
                            text = "Solar PV & Wind Yield Modeling",
                            style = MaterialTheme.typography.labelSmall,
                            color = EmeraldGreen,
                            fontSize = 11.sp
                        )
                    }
                }

                // Tactile Rating Badge
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0xFF070B14))
                        .border(1.dp, EmeraldGreen.copy(alpha = 0.45f), RoundedCornerShape(10.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    SkeuoLedDiode(color = EmeraldGreen, size = 6.dp)
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "${yieldData.solar.rating.uppercase()} SOLAR",
                        color = EmeraldGreen,
                        fontWeight = FontWeight.Bold,
                        fontSize = 10.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Dual Solar & Wind Yield Display (LCD Bays)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Solar LCD Box
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .skeuoLcdPanel(shape = RoundedCornerShape(16.dp), accentColor = AmberWarning)
                        .padding(14.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.SolarPower,
                                contentDescription = null,
                                tint = AmberWarning,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Solar (5 kWp)",
                                color = TextWhite,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "${yieldData.solar.annualSolarMwh} MWh/yr",
                            color = AmberWarning,
                            fontSize = 19.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "${yieldData.solar.peakSunHours} Peak Sun Hrs/day",
                            color = TextDim,
                            fontSize = 10.sp
                        )
                    }
                }

                // Wind LCD Box
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .skeuoLcdPanel(shape = RoundedCornerShape(16.dp), accentColor = CyanPrimary)
                        .padding(14.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.WindPower,
                                contentDescription = null,
                                tint = CyanPrimary,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Wind (3 kW)",
                                color = TextWhite,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "${yieldData.wind.annualWindMwh} MWh/yr",
                            color = CyanPrimary,
                            fontSize = 19.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "${yieldData.wind.powerDensityWm2} W/m² Density",
                            color = TextDim,
                            fontSize = 10.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Impact Bar (Debossed Recessed Well)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoRecessedWell(RoundedCornerShape(14.dp))
                    .padding(horizontal = 14.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Park,
                        contentDescription = null,
                        tint = EmeraldGreen,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "-${yieldData.impact.co2AvoidedKgYear} kg CO₂/yr",
                        color = EmeraldGreen,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Text(
                    text = "Save ~\$${yieldData.impact.estimatedSavingsUsdYear}/yr",
                    color = TextWhite,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Action: Extruded Tactile Push Key
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .skeuoPushButton(
                        isSelected = false,
                        shape = RoundedCornerShape(12.dp),
                        activeAccent = AmberWarning,
                        onClick = onOpenCalculator
                    )
                    .padding(horizontal = 14.dp, vertical = 11.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        SkeuoLedDiode(color = AmberWarning, size = 6.dp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Customize Capacity & Diurnal Curves",
                            color = TextWhite,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = "Open",
                        tint = AmberWarning,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}
