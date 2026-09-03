package com.climatesphere.app.domain.model

import androidx.compose.runtime.Immutable
import kotlinx.serialization.Serializable

@Serializable
@Immutable
data class LocationModel(
    val name: String,
    val cityName: String,
    val country: String,
    val latitude: Double,
    val longitude: Double
)

@Serializable
@Immutable
data class CurrentWeatherModel(
    val temperature: Double,
    val apparentTemperature: Double,
    val humidity: Int,
    val weatherCode: Int,
    val weatherDescription: String,
    val isDay: Boolean,
    val windSpeed: Double,
    val windDirection: Int,
    val surfacePressure: Double,
    val cloudCover: Int,
    val precipitation: Double
)

@Serializable
@Immutable
data class HourlyWeatherModel(
    val time: String, // e.g. "14:00"
    val temperature: Double,
    val weatherCode: Int,
    val precipitationProbability: Int,
    val humidity: Int
)

@Serializable
@Immutable
data class DailyWeatherModel(
    val date: String, // e.g. "2026-09-03"
    val dayName: String, // e.g. "Mon", "Tue"
    val maxTemp: Double,
    val minTemp: Double,
    val weatherCode: Int,
    val weatherDescription: String,
    val uvIndexMax: Double,
    val precipitationSum: Double
)

@Serializable
@Immutable
data class AirQualityModel(
    val aqi: Int,
    val level: String, // "Good", "Moderate", "Unhealthy"
    val colorHex: Long, // 0xFF10B981
    val pm25: Double,
    val pm10: Double,
    val carbonMonoxide: Double,
    val nitrogenDioxide: Double,
    val ozone: Double,
    val uvIndex: Double
)

@Serializable
@Immutable
data class WeatherModel(
    val location: LocationModel,
    val current: CurrentWeatherModel,
    val hourly: List<HourlyWeatherModel>,
    val daily: List<DailyWeatherModel>,
    val airQuality: AirQualityModel,
    val lastUpdatedTimestamp: Long,
    val isFromCache: Boolean = false
)
