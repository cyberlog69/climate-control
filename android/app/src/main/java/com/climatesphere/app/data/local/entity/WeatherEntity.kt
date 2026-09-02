package com.climatesphere.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "weather_cache")
data class WeatherEntity(
    @PrimaryKey val id: String = "primary_weather",
    val locationName: String,
    val cityName: String,
    val country: String,
    val latitude: Double,
    val longitude: Double,
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
    val precipitation: Double,
    // JSON serialized lists for fast offline reconstruction
    val hourlyJson: String,
    val dailyJson: String,
    // Air quality
    val aqi: Int,
    val aqiLevel: String,
    val aqiColorHex: Long,
    val pm25: Double,
    val pm10: Double,
    val carbonMonoxide: Double,
    val nitrogenDioxide: Double,
    val ozone: Double,
    val uvIndex: Double,
    val cachedAtTimestamp: Long
)
