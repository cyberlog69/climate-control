package com.climatesphere.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "carbon_profiles")
data class CarbonProfileEntity(
    @PrimaryKey val id: Int = 1,
    val commuteKmWeek: Double = 160.0,
    val vehicleType: String = "petrol",
    val shortFlightsYear: Int = 2,
    val longFlightsYear: Int = 1,
    val electricityKwhMonth: Double = 320.0,
    val greenEnergyPercent: Double = 15.0,
    val dietType: String = "average",
    val consumptionLevel: String = "medium",
    val activeMitigations: String = "act-meatless",
    val totalTons: Double = 6.42,
    val calculatedAt: Long = System.currentTimeMillis()
)
