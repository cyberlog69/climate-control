package com.climatesphere.app

import com.climatesphere.app.domain.model.AirQualityModel
import com.climatesphere.app.domain.model.CurrentWeatherModel
import com.climatesphere.app.domain.model.DualCityComparisonCalculator
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WeatherModel
import org.junit.Assert.assertEquals
import org.junit.Test

class DualCityComparisonTest {

    @Test
    fun testComputeComparison_calculatesDeltasAccurately() {
        val locA = LocationModel("London", "London", "UK", 51.5, -0.1)
        val locB = LocationModel("Tokyo", "Tokyo", "Japan", 35.6, 139.7)

        val weatherA = WeatherModel(
            location = locA,
            current = CurrentWeatherModel(
                temperature = 18.0,
                apparentTemperature = 17.5,
                humidity = 65,
                weatherCode = 1,
                weatherDescription = "Clear",
                isDay = true,
                windSpeed = 12.0,
                windDirection = 180,
                surfacePressure = 1012.0,
                cloudCover = 20,
                precipitation = 0.0
            ),
            hourly = emptyList(),
            daily = emptyList(),
            airQuality = AirQualityModel(
                aqi = 35,
                level = "Good",
                colorHex = 0xFF10B981,
                pm25 = 8.5,
                pm10 = 14.0,
                carbonMonoxide = 200.0,
                nitrogenDioxide = 15.0,
                ozone = 40.0,
                uvIndex = 3.0
            ),
            lastUpdatedTimestamp = System.currentTimeMillis()
        )

        val weatherB = WeatherModel(
            location = locB,
            current = CurrentWeatherModel(
                temperature = 26.5,
                apparentTemperature = 28.0,
                humidity = 80,
                weatherCode = 3,
                weatherDescription = "Cloudy",
                isDay = true,
                windSpeed = 22.5,
                windDirection = 90,
                surfacePressure = 1008.0,
                cloudCover = 75,
                precipitation = 0.2
            ),
            hourly = emptyList(),
            daily = emptyList(),
            airQuality = AirQualityModel(
                aqi = 55,
                level = "Moderate",
                colorHex = 0xFFF59E0B,
                pm25 = 16.0,
                pm10 = 25.0,
                carbonMonoxide = 350.0,
                nitrogenDioxide = 28.0,
                ozone = 50.0,
                uvIndex = 6.0
            ),
            lastUpdatedTimestamp = System.currentTimeMillis()
        )

        val comparison = DualCityComparisonCalculator.computeComparison(weatherA, weatherB)

        assertEquals(8.5, comparison.deltas.deltaTempC, 0.05)
        assertEquals(10.5, comparison.deltas.deltaFeelsLikeC, 0.05)
        assertEquals(20, comparison.deltas.deltaAqi)
        assertEquals(10.5, comparison.deltas.deltaWindSpeedKmH, 0.05)
        assertEquals(-4.0, comparison.deltas.deltaPressureHpa, 0.05)
        assertEquals(15, comparison.deltas.deltaHumidityPercent)
    }
}
