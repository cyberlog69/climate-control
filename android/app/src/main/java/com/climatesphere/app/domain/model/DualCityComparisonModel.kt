package com.climatesphere.app.domain.model

import androidx.compose.runtime.Immutable
import kotlinx.serialization.Serializable
import kotlin.math.roundToInt

@Serializable
@Immutable
data class EnvironmentalDeltas(
    val deltaTempC: Double,
    val deltaFeelsLikeC: Double,
    val deltaAqi: Int,
    val deltaWindSpeedKmH: Double,
    val deltaPressureHpa: Double,
    val deltaHumidityPercent: Int
)

@Serializable
@Immutable
data class DualCityComparisonResult(
    val locationA: LocationModel,
    val weatherA: WeatherModel,
    val locationB: LocationModel,
    val weatherB: WeatherModel,
    val deltas: EnvironmentalDeltas
)

object DualCityComparisonCalculator {

    fun computeComparison(
        weatherA: WeatherModel,
        weatherB: WeatherModel
    ): DualCityComparisonResult {
        val deltaTemp = ((weatherB.current.temperature - weatherA.current.temperature) * 10.0).roundToInt() / 10.0
        val deltaFeelsLike = ((weatherB.current.apparentTemperature - weatherA.current.apparentTemperature) * 10.0).roundToInt() / 10.0
        val deltaAqi = weatherB.airQuality.aqi - weatherA.airQuality.aqi
        val deltaWind = ((weatherB.current.windSpeed - weatherA.current.windSpeed) * 10.0).roundToInt() / 10.0
        val deltaPressure = ((weatherB.current.surfacePressure - weatherA.current.surfacePressure) * 10.0).roundToInt() / 10.0
        val deltaHumidity = weatherB.current.humidity - weatherA.current.humidity

        val deltas = EnvironmentalDeltas(
            deltaTempC = deltaTemp,
            deltaFeelsLikeC = deltaFeelsLike,
            deltaAqi = deltaAqi,
            deltaWindSpeedKmH = deltaWind,
            deltaPressureHpa = deltaPressure,
            deltaHumidityPercent = deltaHumidity
        )

        return DualCityComparisonResult(
            locationA = weatherA.location,
            weatherA = weatherA,
            locationB = weatherB.location,
            weatherB = weatherB,
            deltas = deltas
        )
    }
}
