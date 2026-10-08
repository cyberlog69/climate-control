package com.climatesphere.app.domain.model

import androidx.compose.runtime.Immutable
import kotlinx.serialization.Serializable
import kotlin.math.abs
import kotlin.math.min
import kotlin.math.roundToInt

@Serializable
@Immutable
data class ClimateScenario(
    val degree: Double,
    val label: String,
    val name: String,
    val badgeColorHex: Long,
    val description: String
)

@Serializable
@Immutable
data class ClimateImpactProjection(
    val warmingDegree: Double,
    val activeScenario: ClimateScenario,
    val seaLevelRiseMeters: Double,
    val extraHeatwaveDays: Int,
    val droughtRiskPercent: Int,
    val cropLossPercent: Int,
    val isCoastal: Boolean,
    val isArctic: Boolean,
    val isEquatorial: Boolean
)

object ClimateImpactCalculator {

    val SCENARIOS = listOf(
        ClimateScenario(
            degree = 1.5,
            label = "+1.5°C",
            name = "Paris Accord Target",
            badgeColorHex = 0xFF10B981, // Green
            description = "Stabilization pathway with high renewable penetration and net-zero emissions."
        ),
        ClimateScenario(
            degree = 2.0,
            label = "+2.0°C",
            name = "Critical Threshold",
            badgeColorHex = 0xFFF59E0B, // Amber
            description = "Severe tipping points begin emerging in coral reefs, alpine glaciers, and polar ice sheets."
        ),
        ClimateScenario(
            degree = 3.0,
            label = "+3.0°C",
            name = "Severe Trajectory",
            badgeColorHex = 0xFFF97316, // Orange
            description = "Unchecked fossil emissions leading to chronic agricultural disruption and extreme sea surges."
        ),
        ClimateScenario(
            degree = 4.0,
            label = "+4.0°C",
            name = "Catastrophic Risk",
            badgeColorHex = 0xFF8B5CF6, // Purple
            description = "Widespread collapse of major biomes, global food supply shocks, and mega-droughts."
        )
    )

    fun getScenarioForDegree(deg: Double): ClimateScenario {
        return when {
            deg <= 1.7 -> SCENARIOS[0]
            deg <= 2.5 -> SCENARIOS[1]
            deg <= 3.5 -> SCENARIOS[2]
            else -> SCENARIOS[3]
        }
    }

    /**
     * Models local environmental stress factors under future warming scenarios based on IPCC AR6 Working Group II models.
     */
    fun calculateProjection(
        warmingDegree: Double,
        latitude: Double,
        longitude: Double
    ): ClimateImpactProjection {
        val clampedDegree = warmingDegree.coerceIn(1.0, 4.5)
        val absLat = abs(latitude)
        val absLon = abs(longitude)

        val isCoastal = absLat < 65.0 && (absLon > 100.0 || absLon < 20.0 || absLat < 15.0)
        val isArctic = absLat >= 60.0
        val isEquatorial = absLat <= 23.5

        val seaLevelBase = clampedDegree * 0.38 + (if (isCoastal) 0.28 else 0.12)
        val seaLevelRiseMeters = ((seaLevelBase * 100.0).roundToInt()) / 100.0

        val heatwaveFactor = if (isEquatorial) 24.0 else if (isArctic) 8.0 else 16.0
        val extraHeatwaveDays = (clampedDegree * heatwaveFactor).roundToInt()

        val droughtFactor = if (isEquatorial) 14.0 else 8.0
        val droughtRiskPercent = min(95, (clampedDegree * 18.0 + droughtFactor).roundToInt())

        val cropLossPercent = min(80, (clampedDegree * 7.8 + 4.0).roundToInt())

        return ClimateImpactProjection(
            warmingDegree = clampedDegree,
            activeScenario = getScenarioForDegree(clampedDegree),
            seaLevelRiseMeters = seaLevelRiseMeters,
            extraHeatwaveDays = extraHeatwaveDays,
            droughtRiskPercent = droughtRiskPercent,
            cropLossPercent = cropLossPercent,
            isCoastal = isCoastal,
            isArctic = isArctic,
            isEquatorial = isEquatorial
        )
    }
}
