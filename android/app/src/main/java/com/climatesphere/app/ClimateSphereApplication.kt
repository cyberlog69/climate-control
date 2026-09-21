package com.climatesphere.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import com.climatesphere.app.core.di.AppContainer
import com.climatesphere.app.core.worker.WeatherSyncScheduler
import com.climatesphere.app.core.worker.WeatherSyncWorker

class ClimateSphereApplication : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
        createNotificationChannel()
        WeatherSyncScheduler.schedule(this)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Severe Weather & Hazards"
            val descriptionText = "Real-time alerts for severe heatwaves, freezing advisories, high winds, and hazardous AQI."
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(WeatherSyncWorker.CHANNEL_ID, name, importance).apply {
                description = descriptionText
                enableVibration(true)
            }
            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}
