// Historical Climate Reconstruction Data Engine (1950 – 2026)
// Provides historical temperature shifts, heatwave frequencies, CO2 levels, and precipitation anomalies

// Historical global atmospheric CO2 levels (NOAA / Scripps Keeling Curve)
export const HISTORICAL_CO2_SERIES = {
  1950: 311.3,
  1960: 316.9,
  1970: 325.7,
  1980: 338.8,
  1990: 354.4,
  2000: 369.5,
  2010: 389.9,
  2020: 414.2,
  2026: 428.4
};

// Global Mean Temperature Anomalies relative to 1951-1980 baseline (NASA GISTEMP)
export const GLOBAL_TEMP_ANOMALIES = {
  1950: -0.18,
  1960: -0.02,
  1970: 0.03,
  1980: 0.26,
  1990: 0.45,
  2000: 0.62,
  2010: 0.72,
  2020: 1.02,
  2026: 1.29
};

const DECADE_YEARS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2026];

/**
 * Generates coordinate-specific historical climate trajectory (1950-2026)
 * based on latitude/longitude geography, historical baseline, and thermal shifts.
 */
export function getHistoricalClimateTrajectory(lat, lon, currentTemp = 25) {
  // Polar amplification factor: high latitudes warm faster than equator
  const absLat = Math.abs(lat);
  const polarFactor = 1.0 + (absLat / 90) * 1.4; // 1.0x at equator, up to 2.4x in Arctic

  // Coastal buffer factor (oceans warm slightly slower than land)
  const isCoastal = (Math.abs(lon) > 120 || Math.abs(lon) < 25) && absLat < 60;
  const bufferFactor = isCoastal ? 0.85 : 1.15;

  const trajectory = DECADE_YEARS.map((year) => {
    const globalAnomaly = GLOBAL_TEMP_ANOMALIES[year];
    const localAnomaly = parseFloat((globalAnomaly * polarFactor * bufferFactor).toFixed(2));
    
    // Estimate baseline temperature for that year
    const currentAnomaly2026 = GLOBAL_TEMP_ANOMALIES[2026] * polarFactor * bufferFactor;
    const estTemp = parseFloat((currentTemp - (currentAnomaly2026 - localAnomaly)).toFixed(1));

    // Estimate annual extreme heatwave days (>32°C)
    // Higher anomaly and lower latitude = more heatwave days
    const baseHeatDays = Math.max(2, Math.round((90 - absLat) * 0.18));
    const heatwaveDays = Math.max(0, Math.round(baseHeatDays + (localAnomaly + 0.3) * (absLat < 50 ? 12 : 5)));

    // Estimate annual precipitation deviation (%) relative to mid-century
    // Warmer air holds ~7% more moisture per °C (Clausius-Clapeyron)
    const precipDeltaPercent = parseFloat((localAnomaly * 6.5).toFixed(1));

    return {
      year,
      temp: estTemp,
      anomaly: localAnomaly,
      co2: HISTORICAL_CO2_SERIES[year],
      heatwaveDays,
      precipDeltaPercent: precipDeltaPercent >= 0 ? `+${precipDeltaPercent}%` : `${precipDeltaPercent}%`,
      precipDeltaNum: precipDeltaPercent
    };
  });

  return trajectory;
}

/**
 * Formats natural language diagnostic comparison between selected historical year and present (2026)
 */
export function getHistoricalComparisonInsight(cityName, selectedData, presentData) {
  const tempDelta = (presentData.temp - selectedData.temp).toFixed(1);
  const co2Delta = (presentData.co2 - selectedData.co2).toFixed(1);
  const heatDelta = presentData.heatwaveDays - selectedData.heatwaveDays;

  return {
    tempDelta,
    isWarmer: tempDelta > 0,
    co2Delta,
    heatDelta,
    summary: `In ${selectedData.year}, ${cityName} had an estimated mean temperature of ${selectedData.temp}°C with ~${selectedData.heatwaveDays} extreme heatwave days/year (Atmospheric CO₂: ${selectedData.co2} ppm). Today (2026), temperatures have shifted by +${tempDelta}°C with ${presentData.heatwaveDays} annual heatwave days and atmospheric CO₂ at ${presentData.co2} ppm.`
  };
}
