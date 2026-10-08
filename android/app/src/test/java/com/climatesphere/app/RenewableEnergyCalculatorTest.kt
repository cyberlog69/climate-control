package com.climatesphere.app

import com.climatesphere.app.domain.model.RenewableEnergyCalculator
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class RenewableEnergyCalculatorTest {

    @Test
    fun testSolarYield_equatorClearSky_yieldsHighPshAndMwh() {
        val result = RenewableEnergyCalculator.calculateYield(
            latitude = 0.0,
            longitude = 0.0,
            cloudCoverPercent = 10,
            windSpeedKmH = 20.0,
            solarSystemSizeKw = 5.0,
            windTurbineKw = 3.0
        )

        assertTrue("PSH should be >= 4.5 at clear equator", result.solar.peakSunHours >= 4.5)
        assertTrue("Daily solar generation should be > 15 kWh", result.solar.dailySolarKwh > 15.0)
        assertTrue("Annual MWh should be positive", result.solar.annualSolarMwh > 5.0)
        assertEquals("Excellent", result.solar.rating)
    }

    @Test
    fun testWindYield_shearExtrapolationAndPowerDensity() {
        val result = RenewableEnergyCalculator.calculateYield(
            latitude = 50.0,
            longitude = 0.0,
            cloudCoverPercent = 50,
            windSpeedKmH = 36.0, // 10 m/s
            solarSystemSizeKw = 5.0,
            windTurbineKw = 3.0
        )

        // At 10 m/s at 10m height, 50m height is 10 * (5)^0.14 ≈ 12.5 m/s
        assertTrue("50m wind speed should be higher than 10m/s", result.wind.windSpeed50mMs > 10.0)
        // Power density = 0.5 * 1.225 * 10^3 = 612 W/m²
        assertTrue("Power density should be high (> 500 W/m²)", result.wind.powerDensityWm2 > 500)
        assertEquals("Outstanding", result.wind.rating)
    }

    @Test
    fun testCombinedImpact_calculatesCo2AndSavingsCorrectly() {
        val result = RenewableEnergyCalculator.calculateYield(
            latitude = 35.0,
            longitude = 139.0,
            cloudCoverPercent = 30,
            windSpeedKmH = 15.0,
            solarSystemSizeKw = 6.0,
            windTurbineKw = 2.0
        )

        assertTrue(result.impact.totalAnnualMwh > 0.0)
        assertTrue(result.impact.co2AvoidedKgYear > 1000)
        assertTrue(result.impact.treesEquivalentYear > 50)
        assertTrue(result.impact.estimatedSavingsUsdYear > 500)
    }

    @Test
    fun testDiurnalProfile_contains24HoursWithPeakSolarAtNoon() {
        val result = RenewableEnergyCalculator.calculateYield(
            latitude = 35.0,
            longitude = 139.0,
            cloudCoverPercent = 20,
            windSpeedKmH = 15.0,
            solarSystemSizeKw = 5.0,
            windTurbineKw = 3.0
        )

        assertEquals(24, result.hourlyProfile.size)
        // Midnight should have 0 solar output
        assertEquals(0.0, result.hourlyProfile[0].solarKw, 0.01)
        assertEquals(0.0, result.hourlyProfile[23].solarKw, 0.01)

        // Noon (12:00) should have high solar output
        val noon = result.hourlyProfile[12]
        assertTrue("Noon solar should be > 2.0 kW", noon.solarKw > 2.0)
    }
}
