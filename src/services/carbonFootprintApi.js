// Personal Carbon Footprint Calculation Engine (IPCC / GHG Protocol Standard)
// Computes personal metric tons of CO2e per year across Transport, Energy, Diet, and Consumption

// Emission Factors (kg CO2e per unit)
export const EMISSION_FACTORS = {
  vehicles: {
    petrol: 0.192, // kg CO2 / km
    diesel: 0.171,
    hybrid: 0.108,
    ev: 0.048,
    transit: 0.035,
    bicycle: 0.0
  },
  flights: {
    shortHaul: 160.0, // kg CO2 / flight (<3 hours)
    longHaul: 820.0 // kg CO2 / flight (>3 hours)
  },
  diet: {
    highMeat: 3.3, // tons CO2e / year (heavy beef/lamb)
    average: 2.5, // tons CO2e / year (balanced omnivore)
    pescatarian: 1.9, // tons CO2e / year
    vegetarian: 1.6, // tons CO2e / year
    vegan: 1.3 // tons CO2e / year
  },
  electricity: 0.42, // kg CO2 / kWh (global grid average)
  goodsWaste: {
    high: 2.2, // tons CO2e / year
    medium: 1.4,
    low: 0.8
  }
};

// Global & Regional Benchmarks (Tons CO2e / person / year)
export const BENCHMARKS = {
  parisTarget2030: 2.0, // Paris Climate Agreement safe limit
  globalAverage: 4.5,
  euAverage: 6.8,
  usAverage: 14.5
};

/**
 * Calculates total annual carbon footprint and category breakdowns
 */
export function calculateCarbonFootprint({
  commuteKmWeek = 150,
  vehicleType = "petrol",
  shortFlightsYear = 2,
  longFlightsYear = 1,
  electricityKwhMonth = 300,
  greenEnergyPercent = 20, // 0 - 100%
  dietType = "average",
  consumptionLevel = "medium",
  activeMitigations = [] // Array of selected action IDs
}) {
  // 1. Mobility & Flights (Tons CO2e / year)
  const annualCommuteKm = commuteKmWeek * 52;
  const vehicleFactor = EMISSION_FACTORS.vehicles[vehicleType] || EMISSION_FACTORS.vehicles.petrol;
  const commuteTons = (annualCommuteKm * vehicleFactor) / 1000;

  const flightsTons =
    (shortFlightsYear * EMISSION_FACTORS.flights.shortHaul +
      longFlightsYear * EMISSION_FACTORS.flights.longHaul) /
    1000;

  let transportTons = commuteTons + flightsTons;

  // 2. Home Energy (Tons CO2e / year)
  const annualElectricityKwh = electricityKwhMonth * 12;
  const nonGreenFactor = Math.max(0, 1 - greenEnergyPercent / 100);
  let energyTons = (annualElectricityKwh * EMISSION_FACTORS.electricity * nonGreenFactor) / 1000;

  // 3. Diet (Tons CO2e / year)
  let dietTons = EMISSION_FACTORS.diet[dietType] || EMISSION_FACTORS.diet.average;

  // 4. Goods, Services & Waste (Tons CO2e / year)
  let goodsTons = EMISSION_FACTORS.goodsWaste[consumptionLevel] || EMISSION_FACTORS.goodsWaste.medium;

  // 5. Apply Active Mitigations
  let totalSavingsTons = 0;
  MITIGATION_ACTIONS.forEach((action) => {
    if (activeMitigations.includes(action.id)) {
      totalSavingsTons += action.savingsTons;
      if (action.category === "transport") transportTons = Math.max(0, transportTons - action.savingsTons);
      if (action.category === "energy") energyTons = Math.max(0, energyTons - action.savingsTons);
      if (action.category === "diet") dietTons = Math.max(0, dietTons - action.savingsTons);
      if (action.category === "goods") goodsTons = Math.max(0, goodsTons - action.savingsTons);
    }
  });

  const totalTons = parseFloat((transportTons + energyTons + dietTons + goodsTons).toFixed(2));

  // Determine Impact Rating
  let rating = "Low Impact";
  let badge = "green";
  let color = "var(--accent-green)";

  if (totalTons <= BENCHMARKS.parisTarget2030) {
    rating = "Eco Champion (Paris Aligned)";
    badge = "green";
    color = "var(--accent-green)";
  } else if (totalTons <= BENCHMARKS.globalAverage) {
    rating = "Moderate Impact";
    badge = "cyan";
    color = "var(--accent-cyan)";
  } else if (totalTons <= BENCHMARKS.euAverage) {
    rating = "High Impact";
    badge = "amber";
    color = "var(--accent-amber)";
  } else {
    rating = "Critical High Footprint";
    badge = "red";
    color = "var(--accent-red)";
  }

  // Tree Planting Equivalent Required (1 tree absorbs ~21.8 kg CO2/yr = 0.0218 tons/yr)
  const treesNeededToOffset = Math.round(totalTons / 0.0218);

  const breakdown = [
    { name: "Transport & Flights", value: parseFloat(transportTons.toFixed(2)), color: "var(--accent-cyan)" },
    { name: "Home Energy", value: parseFloat(energyTons.toFixed(2)), color: "var(--accent-amber)" },
    { name: "Food & Diet", value: parseFloat(dietTons.toFixed(2)), color: "#34d399" },
    { name: "Goods & Waste", value: parseFloat(goodsTons.toFixed(2)), color: "var(--accent-purple)" }
  ];

  return {
    totalTons,
    rating,
    badge,
    color,
    treesNeededToOffset,
    totalSavingsTons: parseFloat(totalSavingsTons.toFixed(2)),
    breakdown,
    parisDelta: parseFloat((totalTons - BENCHMARKS.parisTarget2030).toFixed(2))
  };
}

// Recommended Actionable Carbon Mitigation Milestones
export const MITIGATION_ACTIONS = [
  {
    id: "act-ev",
    title: "Switch to Electric Vehicle / Transit",
    category: "transport",
    savingsTons: 1.4,
    description: "Replace petrol commute with electric vehicle or regular public transit."
  },
  {
    id: "act-green-grid",
    title: "100% Renewable Home Electricity",
    category: "energy",
    savingsTons: 0.9,
    description: "Subscribe to certified green energy supplier or install rooftop solar."
  },
  {
    id: "act-meatless",
    title: "Adopt Plant-Rich Diet (3 Meatless Days/Wk)",
    category: "diet",
    savingsTons: 0.7,
    description: "Shift towards seasonal plant-based meals and reduce red meat consumption."
  },
  {
    id: "act-flights",
    title: "Replace 1 Long Flight with Train / Video Call",
    category: "transport",
    savingsTons: 0.8,
    description: "Avoid high-altitude aviation emissions by choosing rail or virtual conferencing."
  },
  {
    id: "act-circular",
    title: "Circular Consumption & Repair Habits",
    category: "goods",
    savingsTons: 0.4,
    description: "Buy second-hand clothing, repair electronics, and minimize single-use plastics."
  }
];
