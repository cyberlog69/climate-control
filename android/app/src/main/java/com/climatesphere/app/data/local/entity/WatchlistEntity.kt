package com.climatesphere.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "watchlist_locations")
data class WatchlistEntity(
    @PrimaryKey val id: String,
    val name: String,
    val cityName: String,
    val country: String,
    val latitude: Double,
    val longitude: Double,
    val orderIndex: Int = 0,
    val addedAtTimestamp: Long = System.currentTimeMillis()
)
