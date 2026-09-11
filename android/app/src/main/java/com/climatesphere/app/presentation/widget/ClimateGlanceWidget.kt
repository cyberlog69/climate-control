package com.climatesphere.app.presentation.widget

import android.content.Context
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.LocalSize
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import com.climatesphere.app.MainActivity
import com.climatesphere.app.data.local.ClimateDatabase
import com.climatesphere.app.data.mapper.toDomainModel
import com.climatesphere.app.domain.model.WeatherModel
import kotlinx.coroutines.flow.firstOrNull
import androidx.compose.ui.graphics.Color

class ClimateGlanceWidget : GlanceAppWidget() {

    companion object {
        private val SMALL_SIZE = DpSize(120.dp, 60.dp)
        private val MEDIUM_SIZE = DpSize(240.dp, 100.dp)
    }

    override val sizeMode: SizeMode = SizeMode.Responsive(
        setOf(SMALL_SIZE, MEDIUM_SIZE)
    )

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val db = ClimateDatabase.getDatabase(context)
        val cachedEntity = db.weatherDao().getLatestWeather().firstOrNull()
        val weather = cachedEntity?.toDomainModel()

        provideContent {
            GlanceTheme {
                val size = LocalSize.current
                if (size.width >= MEDIUM_SIZE.width) {
                    MediumWeatherWidget(context = context, weather = weather)
                } else {
                    SmallWeatherWidget(context = context, weather = weather)
                }
            }
        }
    }
}

@androidx.compose.runtime.Composable
private fun SmallWeatherWidget(context: Context, weather: WeatherModel?) {
    val tempText = weather?.current?.temperature?.let { "%.0f°".format(it) } ?: "--°"
    val cityName = weather?.location?.cityName ?: "ClimateSphere"
    val aqiLevel = weather?.airQuality?.level ?: "Telemetry"

    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .cornerRadius(16.dp)
            .background(Color(0xFF0F172A))
            .clickable(actionStartActivity<MainActivity>())
            .padding(12.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Column {
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = tempText,
                    style = TextStyle(
                        color = ColorProvider(Color(0xFF06B6D4)),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                Spacer(modifier = GlanceModifier.width(6.dp))
                Text(
                    text = aqiLevel,
                    style = TextStyle(
                        color = ColorProvider(Color(0xFF10B981)),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium
                    )
                )
            }
            Spacer(modifier = GlanceModifier.height(2.dp))
            Text(
                text = cityName,
                style = TextStyle(
                    color = ColorProvider(Color(0xFFF8FAFC)),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                ),
                maxLines = 1
            )
        }
    }
}

@androidx.compose.runtime.Composable
private fun MediumWeatherWidget(context: Context, weather: WeatherModel?) {
    val tempText = weather?.current?.temperature?.let { "%.0f°C".format(it) } ?: "--°C"
    val feelsLike = weather?.current?.apparentTemperature?.let { "Feels %.0f°".format(it) } ?: "Real-time"
    val cityName = weather?.location?.cityName ?: "ClimateSphere"
    val country = weather?.location?.country ?: "Telemetry"
    val condition = weather?.current?.weatherDescription ?: "Live Atmosphere"
    val aqi = weather?.airQuality?.aqi?.toString() ?: "--"
    val aqiLevel = weather?.airQuality?.level ?: "AQI"
    val wind = weather?.current?.windSpeed?.let { "%.0f km/h".format(it) } ?: "--"

    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .cornerRadius(20.dp)
            .background(Color(0xFF0A0E17))
            .clickable(actionStartActivity<MainActivity>())
            .padding(16.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Column(modifier = GlanceModifier.fillMaxSize()) {
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = GlanceModifier.defaultWeight()) {
                    Text(
                        text = cityName,
                        style = TextStyle(
                            color = ColorProvider(Color(0xFFF8FAFC)),
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        ),
                        maxLines = 1
                    )
                    Text(
                        text = "$condition • $feelsLike",
                        style = TextStyle(
                            color = ColorProvider(Color(0xFF94A3B8)),
                            fontSize = 11.sp
                        ),
                        maxLines = 1
                    )
                }

                Text(
                    text = tempText,
                    style = TextStyle(
                        color = ColorProvider(Color(0xFF06B6D4)),
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
            }

            Spacer(modifier = GlanceModifier.defaultWeight())

            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = GlanceModifier
                        .cornerRadius(6.dp)
                        .background(Color(0x2610B981))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "AQI $aqi • $aqiLevel",
                        style = TextStyle(
                            color = ColorProvider(Color(0xFF10B981)),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        )
                    )
                }

                Spacer(modifier = GlanceModifier.width(8.dp))

                Box(
                    modifier = GlanceModifier
                        .cornerRadius(6.dp)
                        .background(Color(0x2606B6D4))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "Wind $wind",
                        style = TextStyle(
                            color = ColorProvider(Color(0xFF06B6D4)),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        )
                    )
                }
            }
        }
    }
}
