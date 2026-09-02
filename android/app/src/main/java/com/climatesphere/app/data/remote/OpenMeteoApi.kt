package com.climatesphere.app.data.remote

import com.climatesphere.app.data.remote.dto.AirQualityResponseDto
import com.climatesphere.app.data.remote.dto.GeocodingResponseDto
import com.climatesphere.app.data.remote.dto.WeatherResponseDto
import retrofit2.http.GET
import retrofit2.http.Query
import retrofit2.http.Url

interface OpenMeteoApi {

    @GET("v1/forecast")
    suspend fun getWeatherData(
        @Query("latitude") latitude: Double,
        @Query("longitude") longitude: Double,
        @Query("current") current: String = "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m",
        @Query("hourly") hourly: String = "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code",
        @Query("daily") daily: String = "weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum",
        @Query("timezone") timezone: String = "auto"
    ): WeatherResponseDto

    @GET
    suspend fun getAirQualityData(
        @Url url: String = "https://air-quality-api.open-meteo.com/v1/air-quality",
        @Query("latitude") latitude: Double,
        @Query("longitude") longitude: Double,
        @Query("current") current: String = "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi,dust,uv_index",
        @Query("timezone") timezone: String = "auto"
    ): AirQualityResponseDto

    @GET
    suspend fun searchLocations(
        @Url url: String = "https://geocoding-api.open-meteo.com/v1/search",
        @Query("name") name: String,
        @Query("count") count: Int = 8,
        @Query("language") language: String = "en",
        @Query("format") format: String = "json"
    ): GeocodingResponseDto
}
