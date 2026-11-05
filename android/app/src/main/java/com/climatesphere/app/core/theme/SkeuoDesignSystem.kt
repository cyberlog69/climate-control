package com.climatesphere.app.core.theme

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Skeuomorphic Material 3 Card Modifier
 * Features an extruded satin surface, dual-tone specular highlight bevel, and rounded container.
 */
fun Modifier.skeuoCard(
    shape: Shape = RoundedCornerShape(24.dp),
    borderWidth: Dp = 1.dp
): Modifier = this
    .clip(shape)
    .background(
        Brush.verticalGradient(
            listOf(SkeuoCardGradTop, SkeuoCardGradBottom)
        )
    )
    .border(
        width = borderWidth,
        brush = Brush.verticalGradient(
            listOf(SkeuoBevelLight, DarkCardBorder, SkeuoBevelDark)
        ),
        shape = shape
    )

/**
 * Skeuomorphic Debossed / Sunken Instrument Well Modifier
 * Provides an inward recessed surface with dark inner-shadow gradient for telemetry chips & metric containers.
 */
fun Modifier.skeuoRecessedWell(
    shape: Shape = RoundedCornerShape(16.dp),
    borderWidth: Dp = 1.dp
): Modifier = this
    .clip(shape)
    .background(SkeuoWellFill)
    .border(borderWidth, SkeuoWellBorder, shape)
    .drawWithContent {
        drawContent()
        // Top inset shadow gradient for tactile sunken feel
        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(Color.Black.copy(alpha = 0.65f), Color.Transparent),
                startY = 0f,
                endY = 24.dp.toPx()
            )
        )
    }

/**
 * Skeuomorphic LCD / OLED Digital Readout Panel Modifier
 * Deep obsidian glass background, glowing accent border rim, and top ambient specular glow.
 */
fun Modifier.skeuoLcdPanel(
    shape: Shape = RoundedCornerShape(16.dp),
    accentColor: Color = CyanPrimary,
    borderWidth: Dp = 1.dp
): Modifier = this
    .clip(shape)
    .background(SkeuoLcdFill)
    .border(
        width = borderWidth,
        brush = Brush.verticalGradient(
            listOf(
                accentColor.copy(alpha = 0.45f),
                accentColor.copy(alpha = 0.20f),
                accentColor.copy(alpha = 0.08f)
            )
        ),
        shape = shape
    )
    .drawWithContent {
        drawContent()
        // Top display ambient glow
        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(accentColor.copy(alpha = 0.12f), Color.Transparent),
                startY = 0f,
                endY = 32.dp.toPx()
            )
        )
    }

/**
 * Skeuomorphic Cylindrical Machined Bezel Modifier
 * Simulates brushed titanium or anodized aluminum rings for gauges and round dials.
 */
fun Modifier.skeuoBezel(
    shape: Shape = CircleShape,
    borderWidth: Dp = 2.dp
): Modifier = this
    .border(
        width = borderWidth,
        brush = Brush.linearGradient(
            listOf(
                SkeuoMetallicRimLight,
                SkeuoMetallicRimDark,
                SkeuoMetallicRimLight.copy(alpha = 0.8f),
                SkeuoMetallicRimDark
            )
        ),
        shape = shape
    )

/**
 * Skeuomorphic Push Button Modifier
 * Physical extruded key with specular top bevel, satin body, and depressed active state.
 */
fun Modifier.skeuoPushButton(
    isSelected: Boolean = false,
    shape: Shape = RoundedCornerShape(12.dp),
    activeAccent: Color = CyanPrimary,
    onClick: (() -> Unit)? = null
): Modifier {
    val clickableModifier = if (onClick != null) this.clickable { onClick() } else this
    return if (isSelected) {
        clickableModifier
            .clip(shape)
            .background(
                Brush.verticalGradient(
                    listOf(activeAccent.copy(alpha = 0.22f), activeAccent.copy(alpha = 0.10f))
                )
            )
            .border(1.dp, activeAccent, shape)
    } else {
        clickableModifier
            .clip(shape)
            .background(
                Brush.verticalGradient(
                    listOf(SkeuoButtonGradTop, SkeuoButtonGradBottom)
                )
            )
            .border(
                width = 1.dp,
                brush = Brush.verticalGradient(
                    listOf(SkeuoBevelLight, SkeuoButtonBorder)
                ),
                shape = shape
            )
    }
}

/**
 * Skeuomorphic Glass LED Diode Indicator
 * Multi-layer tactile diode with metallic bezel ring, luminous colored core, specular lens glint, and pulsing glow.
 */
@Composable
fun SkeuoLedDiode(
    color: Color,
    modifier: Modifier = Modifier,
    isPulsing: Boolean = false,
    size: Dp = 9.dp
) {
    val pulseTransition = rememberInfiniteTransition(label = "LedPulse")
    val alphaAnim by if (isPulsing) {
        pulseTransition.animateFloat(
            initialValue = 0.35f,
            targetValue = 1.0f,
            animationSpec = infiniteRepeatable(
                animation = tween(durationMillis = 1100, easing = LinearEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "LedAlpha"
        )
    } else {
        pulseTransition.animateFloat(
            initialValue = 1.0f,
            targetValue = 1.0f,
            animationSpec = infiniteRepeatable(animation = tween(1000)),
            label = "LedStatic"
        )
    }

    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(Color(0xFF0F172A)) // Outer bezel
            .border(1.dp, Color(0xFF334155), CircleShape),
        contentAlignment = Alignment.Center
    ) {
        // Inner glowing core
        Box(
            modifier = Modifier
                .size(size * 0.72f)
                .clip(CircleShape)
                .background(color.copy(alpha = alphaAnim))
        )
        // Specular reflection glint (top-left)
        Box(
            modifier = Modifier
                .size(size * 0.28f)
                .align(Alignment.TopStart)
                .clip(CircleShape)
                .background(Color.White.copy(alpha = 0.85f * alphaAnim))
        )
    }
}

/**
 * Skeuomorphic Recessed Meter Track Bar
 * Debossed sunken track with glowing illuminated progress fill.
 */
@Composable
fun SkeuoMeterTrack(
    progress: Float,
    modifier: Modifier = Modifier,
    trackHeight: Dp = 8.dp,
    trackColor: Color = Color(0xFF070B14),
    fillColor: Color = CyanPrimary,
    fillGradient: List<Color>? = null
) {
    val clampedProgress = progress.coerceIn(0f, 1f)
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(trackHeight)
            .clip(CircleShape)
            .background(trackColor)
            .border(1.dp, Color(0xFF131D2E), CircleShape)
    ) {
        val fillBrush = if (fillGradient != null && fillGradient.size > 1) {
            Brush.horizontalGradient(fillGradient)
        } else {
            Brush.horizontalGradient(listOf(fillColor.copy(alpha = 0.7f), fillColor))
        }

        if (clampedProgress > 0f) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(fraction = clampedProgress)
                    .fillMaxHeight()
                    .clip(CircleShape)
                    .background(fillBrush)
                    .border(0.5.dp, Color.White.copy(alpha = 0.35f), CircleShape)
            )
        }
    }
}

