package com.climatesphere.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.climatesphere.app.data.local.entity.WatchlistEntity
import com.climatesphere.app.data.local.entity.WeatherEntity

@Database(
    entities = [WeatherEntity::class, WatchlistEntity::class],
    version = 2,
    exportSchema = false
)
abstract class ClimateDatabase : RoomDatabase() {

    abstract fun weatherDao(): WeatherDao
    abstract fun watchlistDao(): WatchlistDao

    companion object {
        @Volatile
        private var INSTANCE: ClimateDatabase? = null

        fun getDatabase(context: Context): ClimateDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ClimateDatabase::class.java,
                    "climatesphere_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
