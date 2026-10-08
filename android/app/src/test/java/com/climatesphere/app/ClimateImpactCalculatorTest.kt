package com.climatesphere.app

import com.climatesphere.app.domain.model.ClimateImpactCalculator
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ClimateImpactCalculatorTest {

    @Test
    fun testScenarioSelection_mapsCorrectly() {
        val sc15 = ClimateImpactCalculator.getScenarioForDegree(1.5)
        assertEquals("Paris Accord Target", sc15.name)

        val sc20 = ClimateImpactCalculator.getScenarioForDegree(2.0)
        assertEquals("Critical Threshold", sc20.name)

        val sc30 = ClimateImpactCalculator.getScenarioForDegree(3.0)
        assertEquals("Severe Trajectory", sc30.name)

        val sc40 = ClimateImpactCalculator.getScenarioForDegree(4.0)
        assertEquals("Catastrophic Risk", sc40.name)
    }

    @Test
    fun testCoastalLocation_increasedSeaLevelRiseSurge() {
        // Coastal coordinate (e.g. Mumbai 19.07, 72.87) vs Inland (Kansas 39.0, -98.0)
        val coastal = ClimateImpactCalculator.calculateProjection(
            warmingDegree = 2.0,
            latitude = 10.0,
            longitude = 76.0
        )
        val inland = ClimateImpactCalculator.calculateProjection(
            warmingDegree = 2.0,
            latitude = 40.0,
            longitude = -100.0
        )

        assertTrue("Coastal should be marked coastal", coastal.isCoastal)
        assertTrue("Inland should have lower sea level surge baseline", inland.seaLevelRiseMeters <= coastal.seaLevelRiseMeters)
    }

    @Test
    fun testWarmingStressFactors_increaseMonotonicallyWithTemperature() {
        val p1 = ClimateImpactCalculator.calculateProjection(1.5, 25.0, 75.0)
        val p2 = ClimateImpactCalculator.calculateProjection(3.0, 25.0, 75.0)

        assertTrue(p2.seaLevelRiseMeters > p1.seaLevelRiseMeters)
        assertTrue(p2.extraHeatwaveDays > p1.extraHeatwaveDays)
        assertTrue(p2.droughtRiskPercent >= p1.droughtRiskPercent)
        assertTrue(p2.cropLossPercent > p1.cropLossPercent)
    }
}
