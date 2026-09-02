package com.climatesphere.app.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AirQualityResponseDto(
    val latitude: Double,
    val longitude: Double,
    val current: AirQualityCurrentDto? = null
)

@Serializable
data class AirQualityCurrentDto(
    val pm10: Double = 0.0,
    @SerialName("pm2_5") val pm25: Double = 0.0,
    @SerialName("carbon_monoxide") val carbonMonoxide: Double = 0.0,
    @SerialName("nitrogen_dioxide") val nitrogenDioxide: Double = 0.0,
    @SerialName("sulphur_dioxide") val sulphurDioxide: Double = 0.0,
    val ozone: Double = 0.0,
    @SerialName("european_aqi") val europeanAqi: Int = 0,
    @SerialName("us_aqi") val usAqi: Int = 0,
    val dust: Double = 0.0,
    @SerialName("uv_index") val uvIndex: Double = 0.0
)
