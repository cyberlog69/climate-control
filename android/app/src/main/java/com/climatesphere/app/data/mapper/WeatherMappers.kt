package com.climatesphere.app.data.mapper

import com.climatesphere.app.data.local.entity.WeatherEntity
import com.climatesphere.app.data.remote.dto.AirQualityCurrentDto
import com.climatesphere.app.data.remote.dto.DailyDto
import com.climatesphere.app.data.remote.dto.GeocodingResultDto
import com.climatesphere.app.data.remote.dto.HourlyDto
import com.climatesphere.app.data.remote.dto.WeatherResponseDto
import com.climatesphere.app.domain.model.AirQualityModel
import com.climatesphere.app.domain.model.CurrentWeatherModel
import com.climatesphere.app.domain.model.DailyWeatherModel
import com.climatesphere.app.domain.model.HourlyWeatherModel
import com.climatesphere.app.domain.model.LocationModel
import com.climatesphere.app.domain.model.WeatherModel
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.TextStyle
import java.util.Locale

private val jsonSerializer = Json { ignoreUnknownKeys = true }

fun getWeatherDescription(code: Int): String {
    return when (code) {
        0 -> "Clear Sky"
        1 -> "Mainly Clear"
        2 -> "Partly Cloudy"
        3 -> "Overcast"
        45, 48 -> "Foggy Conditions"
        51, 53, 55 -> "Drizzle"
        61, 63, 65 -> "Rain Showers"
        71, 73, 75 -> "Snowfall"
        77 -> "Snow Grains"
        80, 81, 82 -> "Heavy Rain Showers"
        85, 86 -> "Snow Showers"
        95 -> "Thunderstorm"
        96, 99 -> "Thunderstorm with Hail"
        else -> "Variable Conditions"
    }
}

fun mapAirQuality(dto: AirQualityCurrentDto?): AirQualityModel {
    if (dto == null) {
        return AirQualityModel(
            aqi = 25,
            level = "Good",
            colorHex = 0xFF10B981,
            pm25 = 8.5,
            pm10 = 15.0,
            carbonMonoxide = 210.0,
            nitrogenDioxide = 12.0,
            ozone = 45.0,
            uvIndex = 2.0
        )
    }

    val aqi = if (dto.usAqi > 0) dto.usAqi else if (dto.europeanAqi > 0) dto.europeanAqi else 35
    val (level, color) = when {
        aqi <= 50 -> "Good" to 0xFF10B981 // Green
        aqi <= 100 -> "Moderate" to 0xFFF59E0B // Amber
        aqi <= 150 -> "Unhealthy for Sensitive Groups" to 0xFFF97316 // Orange
        aqi <= 200 -> "Unhealthy" to 0xFFEF4444 // Red
        aqi <= 300 -> "Very Unhealthy" to 0xFF8B5CF6 // Purple
        else -> "Hazardous" to 0xFF7F1D1D // Dark Red
    }

    return AirQualityModel(
        aqi = aqi,
        level = level,
        colorHex = color,
        pm25 = dto.pm25,
        pm10 = dto.pm10,
        carbonMonoxide = dto.carbonMonoxide,
        nitrogenDioxide = dto.nitrogenDioxide,
        ozone = dto.ozone,
        uvIndex = dto.uvIndex
    )
}

fun mapHourlyForecast(dto: HourlyDto?): List<HourlyWeatherModel> {
    if (dto == null || dto.time.isEmpty()) return emptyList()

    val size = minOf(dto.time.size, dto.temperature2m.size, 24)
    val result = ArrayList<HourlyWeatherModel>(size)

    for (i in 0 until size) {
        val rawTime = dto.time.getOrNull(i) ?: ""
        // Extracts "HH:mm" from "2026-09-03T14:00"
        val formattedTime = if (rawTime.contains("T")) {
            rawTime.substringAfter("T")
        } else {
            rawTime
        }

        result.add(
            HourlyWeatherModel(
                time = formattedTime,
                temperature = dto.temperature2m.getOrNull(i) ?: 0.0,
                weatherCode = dto.weatherCode.getOrNull(i) ?: 0,
                precipitationProbability = dto.precipitationProbability.getOrNull(i) ?: 0,
                humidity = dto.relativeHumidity2m.getOrNull(i) ?: 0
            )
        )
    }
    return result
}

fun mapDailyForecast(dto: DailyDto?): List<DailyWeatherModel> {
    if (dto == null || dto.time.isEmpty()) return emptyList()

    val size = minOf(dto.time.size, dto.temperature2mMax.size, 7)
    val result = ArrayList<DailyWeatherModel>(size)

    for (i in 0 until size) {
        val rawDate = dto.time.getOrNull(i) ?: ""
        val dayName = try {
            val date = LocalDate.parse(rawDate)
            date.dayOfWeek.getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
        } catch (e: Exception) {
            "Day ${i + 1}"
        }

        val code = dto.weatherCode.getOrNull(i) ?: 0
        result.add(
            DailyWeatherModel(
                date = rawDate,
                dayName = dayName,
                maxTemp = dto.temperature2mMax.getOrNull(i) ?: 0.0,
                minTemp = dto.temperature2mMin.getOrNull(i) ?: 0.0,
                weatherCode = code,
                weatherDescription = getWeatherDescription(code),
                uvIndexMax = dto.uvIndexMax.getOrNull(i) ?: 0.0,
                precipitationSum = dto.precipitationSum.getOrNull(i) ?: 0.0
            )
        )
    }
    return result
}

fun WeatherResponseDto.toWeatherModel(
    location: LocationModel,
    airQualityModel: AirQualityModel
): WeatherModel {
    val cur = current
    val code = cur?.weatherCode ?: 0
    return WeatherModel(
        location = location,
        current = CurrentWeatherModel(
            temperature = cur?.temperature2m ?: 0.0,
            apparentTemperature = cur?.apparentTemperature ?: 0.0,
            humidity = cur?.relativeHumidity2m ?: 0,
            weatherCode = code,
            weatherDescription = getWeatherDescription(code),
            isDay = (cur?.isDay ?: 1) == 1,
            windSpeed = cur?.windSpeed10m ?: 0.0,
            windDirection = cur?.windDirection10m ?: 0,
            surfacePressure = cur?.surfacePressure ?: 1013.25,
            cloudCover = cur?.cloudCover ?: 0,
            precipitation = cur?.precipitation ?: 0.0
        ),
        hourly = mapHourlyForecast(hourly),
        daily = mapDailyForecast(daily),
        airQuality = airQualityModel,
        lastUpdatedTimestamp = System.currentTimeMillis(),
        isFromCache = false
    )
}

fun WeatherModel.toEntity(): WeatherEntity {
    return WeatherEntity(
        id = "primary_weather",
        locationName = location.name,
        cityName = location.cityName,
        country = location.country,
        latitude = location.latitude,
        longitude = location.longitude,
        temperature = current.temperature,
        apparentTemperature = current.apparentTemperature,
        humidity = current.humidity,
        weatherCode = current.weatherCode,
        weatherDescription = current.weatherDescription,
        isDay = current.isDay,
        windSpeed = current.windSpeed,
        windDirection = current.windDirection,
        surfacePressure = current.surfacePressure,
        cloudCover = current.cloudCover,
        precipitation = current.precipitation,
        hourlyJson = jsonSerializer.encodeToString(hourly),
        dailyJson = jsonSerializer.encodeToString(daily),
        aqi = airQuality.aqi,
        aqiLevel = airQuality.level,
        aqiColorHex = airQuality.colorHex,
        pm25 = airQuality.pm25,
        pm10 = airQuality.pm10,
        carbonMonoxide = airQuality.carbonMonoxide,
        nitrogenDioxide = airQuality.nitrogenDioxide,
        ozone = airQuality.ozone,
        uvIndex = airQuality.uvIndex,
        cachedAtTimestamp = lastUpdatedTimestamp
    )
}

fun WeatherEntity.toDomainModel(): WeatherModel {
    val decodedHourly = try {
        jsonSerializer.decodeFromString<List<HourlyWeatherModel>>(hourlyJson)
    } catch (e: Exception) {
        emptyList()
    }

    val decodedDaily = try {
        jsonSerializer.decodeFromString<List<DailyWeatherModel>>(dailyJson)
    } catch (e: Exception) {
        emptyList()
    }

    return WeatherModel(
        location = LocationModel(
            name = locationName,
            cityName = cityName,
            country = country,
            latitude = latitude,
            longitude = longitude
        ),
        current = CurrentWeatherModel(
            temperature = temperature,
            apparentTemperature = apparentTemperature,
            humidity = humidity,
            weatherCode = weatherCode,
            weatherDescription = weatherDescription,
            isDay = isDay,
            windSpeed = windSpeed,
            windDirection = windDirection,
            surfacePressure = surfacePressure,
            cloudCover = cloudCover,
            precipitation = precipitation
        ),
        hourly = decodedHourly,
        daily = decodedDaily,
        airQuality = AirQualityModel(
            aqi = aqi,
            level = aqiLevel,
            colorHex = aqiColorHex,
            pm25 = pm25,
            pm10 = pm10,
            carbonMonoxide = carbonMonoxide,
            nitrogenDioxide = nitrogenDioxide,
            ozone = ozone,
            uvIndex = uvIndex
        ),
        lastUpdatedTimestamp = cachedAtTimestamp,
        isFromCache = true
    )
}

fun GeocodingResultDto.toLocationModel(): LocationModel {
    val countryStr = country ?: ""
    val adminStr = if (!admin1.isNullOrEmpty()) ", $admin1" else ""
    return LocationModel(
        name = "$name$adminStr, $countryStr".trim().trimStart(','),
        cityName = name,
        country = countryStr,
        latitude = latitude,
        longitude = longitude
    )
}
