package com.climatesphere.app.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.climatesphere.app.data.local.entity.CarbonProfileEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CarbonDao {

    @Query("SELECT * FROM carbon_profiles WHERE id = 1")
    fun getCarbonProfile(): Flow<CarbonProfileEntity?>

    @Query("SELECT * FROM carbon_profiles WHERE id = 1")
    suspend fun getCarbonProfileSync(): CarbonProfileEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveCarbonProfile(profile: CarbonProfileEntity)
}
