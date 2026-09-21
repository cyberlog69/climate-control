package com.climatesphere.app.core.sensor

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

enum class PressureTrend(val label: String, val symbol: String) {
    RISING("Rising", "↗"),
    STEADY("Steady", "→"),
    FALLING("Falling", "↘"),
    RAPID_DROP("Rapid Drop", "⚠️")
}

data class BarometerData(
    val pressureHpa: Float? = null,
    val isHardwareSensor: Boolean = false,
    val trend: PressureTrend = PressureTrend.STEADY,
    val deltaHpa: Float = 0f,
    val isStormAlert: Boolean = false
)

class BarometerSensorManager(context: Context) : SensorEventListener {

    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
    private val pressureSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_PRESSURE)

    private val _barometerData = MutableStateFlow(
        BarometerData(isHardwareSensor = pressureSensor != null)
    )
    val barometerData: StateFlow<BarometerData> = _barometerData.asStateFlow()

    private var initialReading: Float? = null
    private var lastReadingTime: Long = 0L

    val isHardwareAvailable: Boolean
        get() = pressureSensor != null

    fun startListening() {
        if (pressureSensor != null) {
            sensorManager?.registerListener(
                this,
                pressureSensor,
                SensorManager.SENSOR_DELAY_NORMAL
            )
        }
    }

    fun stopListening() {
        sensorManager?.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_PRESSURE) {
            val currentHpa = event.values[0]
            val now = System.currentTimeMillis()

            if (initialReading == null || (now - lastReadingTime) > 3_600_000L * 3) {
                initialReading = currentHpa
                lastReadingTime = now
            }

            val base = initialReading ?: currentHpa
            val delta = currentHpa - base

            val trend = when {
                delta <= -2.5f -> PressureTrend.RAPID_DROP
                delta <= -0.8f -> PressureTrend.FALLING
                delta >= 0.8f -> PressureTrend.RISING
                else -> PressureTrend.STEADY
            }

            val isStorm = delta <= -2.5f

            _barometerData.value = BarometerData(
                pressureHpa = Math.round(currentHpa * 10f) / 10f,
                isHardwareSensor = true,
                trend = trend,
                deltaHpa = Math.round(delta * 10f) / 10f,
                isStormAlert = isStorm
            )
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // No-op
    }

    /**
     * Fallback for devices without on-board hardware barometer.
     * Ingests Open-Meteo station surface pressure.
     */
    fun updateStationFallback(stationPressureHpa: Double?) {
        if (pressureSensor == null && stationPressureHpa != null) {
            _barometerData.value = BarometerData(
                pressureHpa = Math.round(stationPressureHpa.toFloat() * 10f) / 10f,
                isHardwareSensor = false,
                trend = PressureTrend.STEADY,
                deltaHpa = 0f,
                isStormAlert = false
            )
        }
    }
}
