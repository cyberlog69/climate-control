package com.climatesphere.app.domain.model

import androidx.compose.ui.graphics.Color

/**
 * Personal Carbon Footprint Calculation Engine (IPCC / GHG Protocol Standard)
 * Matches the ClimateSphere web telemetry calculation suite.
 */
object CarbonEmissionFactors {
    val vehicles = mapOf(
        "petrol" to 0.192,
        "diesel" to 0.171,
        "hybrid" to 0.108,
        "ev" to 0.048,
        "transit" to 0.035,
        "bicycle" to 0.0
    )

    val flights = mapOf(
        "shortHaul" to 160.0, // kg CO2 / flight (<3 hours)
        "longHaul" to 820.0   // kg CO2 / flight (>3 hours)
    )

    val diet = mapOf(
        "highMeat" to 3.3,    // t CO2e / yr (heavy beef/lamb)
        "average" to 2.5,     // t CO2e / yr (balanced omnivore)
        "pescatarian" to 1.9, // t CO2e / yr
        "vegetarian" to 1.6,  // t CO2e / yr
        "vegan" to 1.3        // t CO2e / yr
    )

    const val ELECTRICITY_GRID_FACTOR = 0.42 // kg CO2 / kWh (global grid average)

    val goodsWaste = mapOf(
        "high" to 2.2,   // t CO2e / yr
        "medium" to 1.4,
        "low" to 0.8
    )
}

object CarbonBenchmarks {
    const val PARIS_TARGET_2030 = 2.0 // Paris Climate Agreement safe limit (t CO2e / person / yr)
    const val GLOBAL_AVERAGE = 4.5
    const val EU_AVERAGE = 6.8
    const val US_AVERAGE = 14.5
}

data class MitigationAction(
    val id: String,
    val title: String,
    val category: String,
    val savingsTons: Double,
    val description: String
)

val AVAILABLE_MITIGATIONS = listOf(
    MitigationAction(
        id = "act-ev",
        title = "Switch to EV / Transit",
        category = "transport",
        savingsTons = 1.4,
        description = "Replace petrol commute with electric vehicle or regular public transit."
    ),
    MitigationAction(
        id = "act-green-grid",
        title = "100% Renewable Home Electricity",
        category = "energy",
        savingsTons = 0.9,
        description = "Subscribe to certified green energy supplier or install rooftop solar."
    ),
    MitigationAction(
        id = "act-meatless",
        title = "Plant-Rich Diet (3 Days/Wk)",
        category = "diet",
        savingsTons = 0.7,
        description = "Shift towards seasonal plant-based meals and reduce red meat consumption."
    ),
    MitigationAction(
        id = "act-flights",
        title = "Replace 1 Long Flight with Train",
        category = "transport",
        savingsTons = 0.8,
        description = "Avoid high-altitude aviation emissions by choosing rail or virtual calls."
    ),
    MitigationAction(
        id = "act-circular",
        title = "Circular Consumption & Repair",
        category = "goods",
        savingsTons = 0.4,
        description = "Buy second-hand clothing, repair electronics, and minimize single-use plastics."
    )
)

data class CarbonCategoryBreakdown(
    val name: String,
    val value: Double,
    val color: Color
)

enum class CarbonRatingLevel(val label: String, val badgeColor: Color) {
    ECO_CHAMPION("Eco Champion (Paris Aligned)", Color(0xFF10B981)),
    MODERATE("Moderate Impact", Color(0xFF06B6D4)),
    HIGH("High Impact", Color(0xFFF59E0B)),
    CRITICAL("Critical High Footprint", Color(0xFFEF4444))
}

data class CarbonCalculationResult(
    val totalTons: Double,
    val rating: CarbonRatingLevel,
    val treesNeededToOffset: Int,
    val totalSavingsTons: Double,
    val breakdown: List<CarbonCategoryBreakdown>,
    val parisDelta: Double
)

object CarbonCalculator {

    fun calculate(
        commuteKmWeek: Double = 160.0,
        vehicleType: String = "petrol",
        shortFlightsYear: Int = 2,
        longFlightsYear: Int = 1,
        electricityKwhMonth: Double = 320.0,
        greenEnergyPercent: Double = 15.0,
        dietType: String = "average",
        consumptionLevel: String = "medium",
        activeMitigations: Set<String> = setOf("act-meatless")
    ): CarbonCalculationResult {
        // 1. Mobility & Flights (Tons CO2e / year)
        val annualCommuteKm = commuteKmWeek * 52.0
        val vehicleFactor = CarbonEmissionFactors.vehicles[vehicleType] ?: CarbonEmissionFactors.vehicles["petrol"]!!
        val commuteTons = (annualCommuteKm * vehicleFactor) / 1000.0

        val flightsTons = (
            shortFlightsYear * CarbonEmissionFactors.flights["shortHaul"]!! +
            longFlightsYear * CarbonEmissionFactors.flights["longHaul"]!!
        ) / 1000.0

        var transportTons = commuteTons + flightsTons

        // 2. Home Energy (Tons CO2e / year)
        val annualElectricityKwh = electricityKwhMonth * 12.0
        val nonGreenFactor = (1.0 - (greenEnergyPercent / 100.0)).coerceAtLeast(0.0)
        var energyTons = (annualElectricityKwh * CarbonEmissionFactors.ELECTRICITY_GRID_FACTOR * nonGreenFactor) / 1000.0

        // 3. Diet (Tons CO2e / year)
        var dietTons = CarbonEmissionFactors.diet[dietType] ?: CarbonEmissionFactors.diet["average"]!!

        // 4. Goods & Waste (Tons CO2e / year)
        var goodsTons = CarbonEmissionFactors.goodsWaste[consumptionLevel] ?: CarbonEmissionFactors.goodsWaste["medium"]!!

        // 5. Apply Active Mitigations
        var totalSavings = 0.0
        for (action in AVAILABLE_MITIGATIONS) {
            if (activeMitigations.contains(action.id)) {
                totalSavings += action.savingsTons
                when (action.category) {
                    "transport" -> transportTons = (transportTons - action.savingsTons).coerceAtLeast(0.0)
                    "energy" -> energyTons = (energyTons - action.savingsTons).coerceAtLeast(0.0)
                    "diet" -> dietTons = (dietTons - action.savingsTons).coerceAtLeast(0.0)
                    "goods" -> goodsTons = (goodsTons - action.savingsTons).coerceAtLeast(0.0)
                }
            }
        }

        val totalTons = ((transportTons + energyTons + dietTons + goodsTons) * 100.0).let { Math.round(it) / 100.0 }

        val rating = when {
            totalTons <= CarbonBenchmarks.PARIS_TARGET_2030 -> CarbonRatingLevel.ECO_CHAMPION
            totalTons <= CarbonBenchmarks.GLOBAL_AVERAGE -> CarbonRatingLevel.MODERATE
            totalTons <= CarbonBenchmarks.EU_AVERAGE -> CarbonRatingLevel.HIGH
            else -> CarbonRatingLevel.CRITICAL
        }

        // 1 mature tree absorbs ~21.8 kg CO2/yr = 0.0218 tons/yr
        val treesNeeded = Math.round(totalTons / 0.0218).toInt()

        val breakdown = listOf(
            CarbonCategoryBreakdown("Transport & Flights", Math.round(transportTons * 100.0) / 100.0, Color(0xFF06B6D4)),
            CarbonCategoryBreakdown("Home Energy", Math.round(energyTons * 100.0) / 100.0, Color(0xFFF59E0B)),
            CarbonCategoryBreakdown("Food & Diet", Math.round(dietTons * 100.0) / 100.0, Color(0xFF10B981)),
            CarbonCategoryBreakdown("Goods & Waste", Math.round(goodsTons * 100.0) / 100.0, Color(0xFF8B5CF6))
        )

        val parisDelta = Math.round((totalTons - CarbonBenchmarks.PARIS_TARGET_2030) * 100.0) / 100.0

        return CarbonCalculationResult(
            totalTons = totalTons,
            rating = rating,
            treesNeededToOffset = treesNeeded,
            totalSavingsTons = Math.round(totalSavings * 100.0) / 100.0,
            breakdown = breakdown,
            parisDelta = parisDelta
        )
    }
}
