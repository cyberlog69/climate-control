package com.climatesphere.app.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.climatesphere.app.data.local.entity.WeatherEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface WeatherDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWeather(weather: WeatherEntity)

    @Query("SELECT * FROM weather_cache WHERE id = :id LIMIT 1")
    fun getWeatherById(id: String = "primary_weather"): Flow<WeatherEntity?>

    @Query("SELECT * FROM weather_cache ORDER BY cachedAtTimestamp DESC LIMIT 1")
    fun getLatestWeather(): Flow<WeatherEntity?>

    @Query("DELETE FROM weather_cache")
    suspend fun clearWeatherCache()
}
