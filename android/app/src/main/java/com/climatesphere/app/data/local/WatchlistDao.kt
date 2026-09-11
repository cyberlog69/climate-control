package com.climatesphere.app.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.climatesphere.app.data.local.entity.WatchlistEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface WatchlistDao {

    @Query("SELECT * FROM watchlist_locations ORDER BY orderIndex ASC, addedAtTimestamp ASC")
    fun getWatchlist(): Flow<List<WatchlistEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLocation(entity: WatchlistEntity)

    @Query("DELETE FROM watchlist_locations WHERE id = :id")
    suspend fun deleteLocation(id: String)

    @Query("SELECT COUNT(*) FROM watchlist_locations WHERE id = :id")
    fun isInWatchlist(id: String): Flow<Int>

    @Query("SELECT COUNT(*) FROM watchlist_locations")
    suspend fun getWatchlistCount(): Int
}
