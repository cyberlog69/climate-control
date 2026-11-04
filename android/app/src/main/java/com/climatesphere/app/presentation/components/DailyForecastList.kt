package com.climatesphere.app.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.climatesphere.app.core.theme.CyanPrimary
import com.climatesphere.app.core.theme.SkeuoLedDiode
import com.climatesphere.app.core.theme.TextDim
import com.climatesphere.app.core.theme.TextMuted
import com.climatesphere.app.core.theme.TextWhite
import com.climatesphere.app.core.theme.skeuoCard
import com.climatesphere.app.core.theme.skeuoRecessedWell
import com.climatesphere.app.domain.model.DailyWeatherModel
import kotlin.math.roundToInt

@Composable
fun DailyForecastList(
    dailyList: List<DailyWeatherModel>,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .skeuoCard(RoundedCornerShape(24.dp))
            .padding(20.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    SkeuoLedDiode(color = CyanPrimary, size = 8.dp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "7-Day Outlook",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                }

                Text(
                    text = "SYNOPTIC TRAJECTORY",
                    color = TextDim,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            dailyList.forEachIndexed { index, daily ->
                DailyTactileRowItem(daily = daily)
                if (index < dailyList.size - 1) {
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
        }
    }
}

@Composable
private fun DailyTactileRowItem(daily: DailyWeatherModel) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .skeuoRecessedWell(RoundedCornerShape(14.dp))
            .padding(horizontal = 14.dp, vertical = 10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Day Name
            Text(
                text = daily.dayName,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.SemiBold,
                color = TextWhite,
                modifier = Modifier.width(70.dp),
                fontSize = 14.sp
            )

            // Weather Icon + Description
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = getWeatherEmoji(daily.weatherCode),
                    fontSize = 20.sp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = daily.weatherDescription,
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextMuted,
                    maxLines = 1,
                    fontSize = 13.sp
                )
            }

            // Min - Max Range in tactile pill
            Row(
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF040812))
                    .border(0.5.dp, Color(0xFF132034), RoundedCornerShape(8.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(
                    text = "${daily.minTemp.roundToInt()}°",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextDim,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = " / ",
                    color = TextDim,
                    fontSize = 11.sp
                )
                Text(
                    text = "${daily.maxTemp.roundToInt()}°",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite
                )
            }
        }
    }
}
