package com.climatesphere.app.domain.model

import androidx.compose.runtime.Immutable
import kotlinx.serialization.Serializable
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.roundToInt
import kotlin.math.roundToLong
import kotlin.math.sin

@Serializable
@Immutable
data class SolarYieldInfo(
    val systemSizeKw: Double,
    val peakSunHours: Double,
    val peakIrradianceWm2: Int,
    val dailySolarKwh: Double,
    val annualSolarMwh: Double,
    val capacityFactor: Double,
    val rating: String,
    val badgeColorHex: Long
)

@Serializable
@Immutable
data class WindYieldInfo(
    val turbineSizeKw: Double,
    val windSpeed10mKmH: Double,
    val windSpeed50mMs: Double,
    val powerDensityWm2: Int,
    val windClass: Int,
    val dailyWindKwh: Double,
    val annualWindMwh: Double,
    val rating: String,
    val badgeColorHex: Long
)

@Serializable
@Immutable
data class RenewableImpactInfo(
    val totalAnnualMwh: Double,
    val co2AvoidedKgYear: Long,
    val treesEquivalentYear: Int,
    val estimatedSavingsUsdYear: Long
)

@Serializable
@Immutable
data class DiurnalHourlyPoint(
    val hour: Int,
    val timeLabel: String,
    val solarKw: Double,
    val windKw: Double,
    val totalKw: Double
)

@Serializable
@Immutable
data class RenewableEnergyYieldResult(
    val solar: SolarYieldInfo,
    val wind: WindYieldInfo,
    val impact: RenewableImpactInfo,
    val hourlyProfile: List<DiurnalHourlyPoint>
)

object RenewableEnergyCalculator {

    /**
     * Calculates comprehensive solar and wind clean energy yields for given latitude, longitude, and weather factors.
     */
    fun calculateYield(
        latitude: Double,
        longitude: Double,
        cloudCoverPercent: Int = 40,
        windSpeedKmH: Double = 15.0,
        solarSystemSizeKw: Double = 5.0,
        windTurbineKw: Double = 3.0
    ): RenewableEnergyYieldResult {
        // 1. Solar Physics Calculations
        val absLat = abs(latitude)
        val latitudeFactor = cos(Math.toRadians(absLat))
        val cloudFactor = max(0.20, 1.0 - (cloudCoverPercent / 100.0) * 0.75)
        val peakSunHours = ((5.5 * latitudeFactor * cloudFactor) * 10.0).roundToInt() / 10.0
        val peakIrradianceWm2 = (1000.0 * latitudeFactor * cloudFactor).roundToInt()

        // Daily Solar Generation = System kWp * PSH * Performance Ratio (PR ~ 0.80)
        val performanceRatio = 0.80
        val dailySolarKwh = ((solarSystemSizeKw * peakSunHours * performanceRatio) * 10.0).roundToInt() / 10.0
        val annualSolarMwh = (((dailySolarKwh * 365.0) / 1000.0) * 100.0).roundToInt() / 100.0
        val solarCapacityFactor = if (solarSystemSizeKw > 0) {
            (((dailySolarKwh / (solarSystemSizeKw * 24.0)) * 100.0) * 10.0).roundToInt() / 10.0
        } else 0.0

        val (solarRating, solarBadgeColor) = when {
            peakSunHours >= 5.0 -> Pair("Excellent", 0xFF10B981) // Green
            peakSunHours >= 3.5 -> Pair("Good", 0xFF06B6D4)      // Cyan
            else -> Pair("Moderate", 0xFFF59E0B)                  // Amber
        }

        val solarInfo = SolarYieldInfo(
            systemSizeKw = solarSystemSizeKw,
            peakSunHours = peakSunHours,
            peakIrradianceWm2 = peakIrradianceWm2,
            dailySolarKwh = dailySolarKwh,
            annualSolarMwh = annualSolarMwh,
            capacityFactor = solarCapacityFactor,
            rating = solarRating,
            badgeColorHex = solarBadgeColor
        )

        // 2. Wind Physics Calculations
        val windSpeedMs = windSpeedKmH / 3.6
        // Extrapolate wind speed to 50m Hub Height using wind shear power law (alpha ~ 0.14)
        val alpha = 0.14
        val windSpeed50m = ((windSpeedMs * (50.0 / 10.0).pow(alpha)) * 10.0).roundToInt() / 10.0

        // Wind Power Density (W/m²) = 0.5 * rho * v^3 (rho = 1.225 kg/m³)
        val airDensity = 1.225
        val windPowerDensity = (0.5 * airDensity * windSpeedMs.pow(3.0)).roundToInt()

        val (windClass, windRating, windBadgeColor) = when {
            windPowerDensity >= 400 -> Triple(6, "Outstanding", 0xFF10B981)
            windPowerDensity >= 250 -> Triple(4, "Good", 0xFF10B981)
            windPowerDensity >= 150 -> Triple(2, "Moderate", 0xFF06B6D4)
            else -> Triple(1, "Low Potential", 0xFF64748B)
        }

        // Daily Wind Turbine Output (kWh/day)
        val windCapFactor = min(0.45, max(0.05, (windSpeed50m - 2.5) / 20.0))
        val dailyWindKwh = ((windTurbineKw * 24.0 * windCapFactor) * 10.0).roundToInt() / 10.0
        val annualWindMwh = (((dailyWindKwh * 365.0) / 1000.0) * 100.0).roundToInt() / 100.0

        val windInfo = WindYieldInfo(
            turbineSizeKw = windTurbineKw,
            windSpeed10mKmH = ((windSpeedKmH * 10.0).roundToInt() / 10.0),
            windSpeed50mMs = windSpeed50m,
            powerDensityWm2 = windPowerDensity,
            windClass = windClass,
            dailyWindKwh = dailyWindKwh,
            annualWindMwh = annualWindMwh,
            rating = windRating,
            badgeColorHex = windBadgeColor
        )

        // 3. Combined Environmental & Financial Offsets
        val totalAnnualKwh = (annualSolarMwh + annualWindMwh) * 1000.0
        val co2AvoidedKg = (totalAnnualKwh * 0.42).roundToLong()
        val treesEquivalent = (co2AvoidedKg / 21.8).roundToInt()
        val estimatedSavingsUsd = (totalAnnualKwh * 0.16).roundToLong()

        val impactInfo = RenewableImpactInfo(
            totalAnnualMwh = (((annualSolarMwh + annualWindMwh) * 100.0).roundToInt() / 100.0),
            co2AvoidedKgYear = co2AvoidedKg,
            treesEquivalentYear = treesEquivalent,
            estimatedSavingsUsdYear = estimatedSavingsUsd
        )

        // 4. Diurnal 24-Hour Profile Generation
        val hourlyProfile = (0 until 24).map { h ->
            var solarKw = 0.0
            if (h in 6..18) {
                val solarAngle = sin(((h - 6) / 12.0) * PI)
                solarKw = ((solarSystemSizeKw * solarAngle * cloudFactor * performanceRatio) * 100.0).roundToInt() / 100.0
            }

            // Wind generation with slight diurnal pattern (often stronger during evening/night)
            val diurnalVariation = 1.0 + 0.15 * cos(((h - 22) / 24.0) * 2.0 * PI)
            val hourWindFactor = min(0.45, max(0.05, (windSpeed50m * diurnalVariation - 2.0) / 18.0))
            val windKw = ((windTurbineKw * hourWindFactor) * 100.0).roundToInt() / 100.0

            val totalKw = (((solarKw + windKw) * 100.0).roundToInt() / 100.0)
            DiurnalHourlyPoint(
                hour = h,
                timeLabel = "%02d:00".format(h),
                solarKw = solarKw,
                windKw = windKw,
                totalKw = totalKw
            )
        }

        return RenewableEnergyYieldResult(
            solar = solarInfo,
            wind = windInfo,
            impact = impactInfo,
            hourlyProfile = hourlyProfile
        )
    }
}
