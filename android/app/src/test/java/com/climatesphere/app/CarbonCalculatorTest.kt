package com.climatesphere.app

import com.climatesphere.app.domain.model.CarbonBenchmarks
import com.climatesphere.app.domain.model.CarbonCalculator
import com.climatesphere.app.domain.model.CarbonRatingLevel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class CarbonCalculatorTest {

    @Test
    fun testCarbonCalculator_ecoChampion_underParisThreshold() {
        val result = CarbonCalculator.calculate(
            commuteKmWeek = 0.0,
            vehicleType = "bicycle",
            shortFlightsYear = 0,
            longFlightsYear = 0,
            electricityKwhMonth = 100.0,
            greenEnergyPercent = 100.0,
            dietType = "vegan",
            consumptionLevel = "low",
            activeMitigations = setOf("act-circular")
        )

        assertTrue(result.totalTons <= CarbonBenchmarks.PARIS_TARGET_2030)
        assertEquals(CarbonRatingLevel.ECO_CHAMPION, result.rating)
        assertTrue(result.treesNeededToOffset >= 0)
        assertTrue(result.parisDelta <= 0.0)
    }

    @Test
    fun testCarbonCalculator_criticalHighFootprint_aboveEuAverage() {
        val result = CarbonCalculator.calculate(
            commuteKmWeek = 400.0,
            vehicleType = "petrol",
            shortFlightsYear = 4,
            longFlightsYear = 3,
            electricityKwhMonth = 800.0,
            greenEnergyPercent = 0.0,
            dietType = "highMeat",
            consumptionLevel = "high",
            activeMitigations = emptySet()
        )

        assertTrue(result.totalTons > CarbonBenchmarks.EU_AVERAGE)
        assertEquals(CarbonRatingLevel.CRITICAL, result.rating)
        assertTrue(result.parisDelta > 0.0)
        assertTrue(result.treesNeededToOffset > 100)
    }

    @Test
    fun testCarbonCalculator_mitigationDeduction_reducesEmissions() {
        val withoutMitigations = CarbonCalculator.calculate(
            commuteKmWeek = 150.0,
            vehicleType = "petrol",
            shortFlightsYear = 2,
            longFlightsYear = 1,
            electricityKwhMonth = 300.0,
            greenEnergyPercent = 20.0,
            dietType = "average",
            consumptionLevel = "medium",
            activeMitigations = emptySet()
        )

        val withMitigations = CarbonCalculator.calculate(
            commuteKmWeek = 150.0,
            vehicleType = "petrol",
            shortFlightsYear = 2,
            longFlightsYear = 1,
            electricityKwhMonth = 300.0,
            greenEnergyPercent = 20.0,
            dietType = "average",
            consumptionLevel = "medium",
            activeMitigations = setOf("act-ev", "act-green-grid", "act-meatless")
        )

        assertTrue(withMitigations.totalTons < withoutMitigations.totalTons)
        assertTrue(withMitigations.totalSavingsTons > 0.0)
    }
}
