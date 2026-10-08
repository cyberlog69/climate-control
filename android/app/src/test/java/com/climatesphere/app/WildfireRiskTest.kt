package com.climatesphere.app

import com.climatesphere.app.domain.model.WildfireRiskLevel
import com.climatesphere.app.domain.model.WildfireSentinelData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class WildfireRiskTest {

    @Test
    fun testHaversineDistance_sameCoordinates_returnsZero() {
        val dist = WildfireSentinelData.calculateDistanceKm(35.68, 139.76, 35.68, 139.76)
        assertEquals(0, dist)
    }

    @Test
    fun testHaversineDistance_londonToParis_accurateWithinTolerances() {
        // London (51.5074, -0.1278) to Paris (48.8566, 2.3522) is approx 343 km
        val dist = WildfireSentinelData.calculateDistanceKm(51.5074, -0.1278, 48.8566, 2.3522)
        assertTrue("Distance $dist km should be within 340-350 km", dist in 335..355)
    }

    @Test
    fun testEvaluateLocalWildfireRisk_highTempLowHumidityCloseProximity_returnsExtremeOrHigh() {
        // Coordinate right next to Amazon fire (-8.82, -63.90)
        val assessment = WildfireSentinelData.evaluateLocalWildfireRisk(
            lat = -8.90,
            lon = -63.95,
            temperatureC = 38.0,
            humidityPercent = 18,
            windSpeedKmH = 40.0
        )

        assertNotNull(assessment.nearestCluster)
        assertEquals("fire-amazon-basin", assessment.nearestCluster?.id)
        assertTrue("Distance should be under 50 km", assessment.minDistanceKm < 50)
        assertTrue("Score should be >= 75 for extreme condition", assessment.score >= 75)
        assertEquals(WildfireRiskLevel.EXTREME, assessment.level)
    }

    @Test
    fun testEvaluateLocalWildfireRisk_coldWetDistantLocation_returnsLowOrModerate() {
        // North Pole / Greenland coords, cold & humid
        val assessment = WildfireSentinelData.evaluateLocalWildfireRisk(
            lat = 75.0,
            lon = -40.0,
            temperatureC = 5.0,
            humidityPercent = 85,
            windSpeedKmH = 10.0
        )

        assertTrue("Score should be moderate or low", assessment.score < 50)
        assertTrue("Minimum distance should be large (>1000km)", assessment.minDistanceKm > 1000)
    }

    @Test
    fun testGlobalSentinelHotspots_notEmptyAndHasHighFrp() {
        val hotspots = WildfireSentinelData.GLOBAL_HOTSPOTS
        assertTrue(hotspots.isNotEmpty())
        assertTrue(hotspots.any { it.frp >= 500.0 })
    }
}
