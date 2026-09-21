package com.climatesphere.app.core.worker

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.climatesphere.app.ClimateSphereApplication
import com.climatesphere.app.MainActivity
import com.climatesphere.app.core.util.Resource
import kotlinx.coroutines.flow.first

/**
 * Low-power background worker that keeps local weather cache fresh and
 * continuously monitors for severe weather hazards.
 */
class WeatherSyncWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    companion object {
        const val CHANNEL_ID = "weather_alerts_channel"
        const val NOTIFICATION_ID_BASE = 1001
    }

    override suspend fun doWork(): Result {
        return try {
            val app = context.applicationContext as? ClimateSphereApplication ?: return Result.failure()
            val repository = app.container.weatherRepository

            // 1. Determine active location
            val primaryLoc = repository.getLastKnownCachedLocation() ?: repository.getIpLocation()
            if (primaryLoc == null || (primaryLoc.latitude == 0.0 && primaryLoc.longitude == 0.0)) {
                return Result.success()
            }

            // 2. Fetch fresh weather telemetry and persist to Room database
            val weatherResource = repository.getWeatherForLocation(primaryLoc, forceRefresh = true)
                .first { it !is Resource.Loading }
            val weather = weatherResource.data ?: return Result.success()

            // 3. Evaluate severe weather & hazard alerts
            val current = weather.current
            val airQuality = weather.airQuality

            var alertTitle: String? = null
            var alertMessage: String? = null

            when {
                current.temperature >= 38.0 -> {
                    alertTitle = "⚠️ Severe Heatwave Alert"
                    alertMessage = "Extreme temperature of ${current.temperature}°C detected in ${weather.location.name}. Stay hydrated and avoid direct sun."
                }
                current.temperature <= 0.0 -> {
                    alertTitle = "❄️ Freezing Temperature Advisory"
                    alertMessage = "Freezing conditions of ${current.temperature}°C in ${weather.location.name}. Watch for icy surfaces."
                }
                current.windSpeed >= 50.0 -> {
                    alertTitle = "💨 Gale-Force Wind Warning"
                    alertMessage = "High sustained winds of ${current.windSpeed} km/h detected in ${weather.location.name}."
                }
                airQuality.aqi >= 150 -> {
                    alertTitle = "🚨 Hazardous Air Quality Alert"
                    alertMessage = "Air quality index is ${airQuality.aqi} (${airQuality.level}) in ${weather.location.name}. Wear a protective mask outdoors."
                }
                airQuality.pm25 >= 55.0 -> {
                    alertTitle = "😷 High PM2.5 Particulate Alert"
                    alertMessage = "Elevated PM2.5 at ${airQuality.pm25} µg/m³ in ${weather.location.name}."
                }
            }

            if (alertTitle != null && alertMessage != null) {
                postNotification(alertTitle, alertMessage)
            }

            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }

    private fun postNotification(title: String, message: String) {
        try {
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val notification = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .build()

            val notificationManager = NotificationManagerCompat.from(context)
            if (notificationManager.areNotificationsEnabled()) {
                notificationManager.notify(NOTIFICATION_ID_BASE, notification)
            }
        } catch (e: SecurityException) {
            // Notification permission not granted or restricted
        }
    }
}
