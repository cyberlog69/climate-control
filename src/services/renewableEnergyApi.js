// Clean Energy & Renewable Yield Engine (Solar PV & Wind Potential)
// Computes real-time Solar Irradiance, Peak Sun Hours (PSH), Wind Power Density, Carbon Offsets & Financial Savings

/**
 * Calculates comprehensive Solar & Wind clean energy yields for a given coordinate & weather conditions
 */
export function calculateRenewableYield({
  lat,
  lon,
  weatherData,
  systemSizeKw = 5.0, // Residential PV array size in kWp
  panelEfficiency = 0.20, // 20% standard monocrystalline efficiency
  windTurbineKw = 3.0 // Micro wind turbine capacity in kW
}) {
  const current = weatherData?.current || {};
  const hourly = weatherData?.hourly || [];
  const cloudCover = current.cloudCover ?? 40; // 0 - 100%
  const windSpeed10m = current.windSpeed ?? 15; // km/h

  // 1. Solar Physics Calculations
  const absLat = Math.abs(lat);
  // Estimate baseline solar peak hours (higher near equator, reduced at poles)
  // Base PSH between 3.2 (polar/cloudy) to 6.8 (desert/equator)
  const latitudeFactor = Math.cos((absLat * Math.PI) / 180);
  const cloudFactor = Math.max(0.2, 1 - (cloudCover / 100) * 0.75);
  const peakSunHours = parseFloat((5.5 * latitudeFactor * cloudFactor).toFixed(1)); // kWh/m²/day

  // Peak Global Horizontal Irradiance (GHI) in W/m²
  const peakIrradianceWm2 = Math.round(1000 * latitudeFactor * cloudFactor);

  // Daily Solar Energy Generation (kWh/day) = System kWp * PSH * Performance Ratio (PR ~ 0.80)
  const performanceRatio = 0.80; // Inverter, temperature & wiring losses
  const dailySolarKwh = parseFloat((systemSizeKw * peakSunHours * performanceRatio).toFixed(1));
  const annualSolarMwh = parseFloat(((dailySolarKwh * 365) / 1000).toFixed(2));

  // Solar Capacity Factor (%)
  const solarCapacityFactor = parseFloat(((dailySolarKwh / (systemSizeKw * 24)) * 100).toFixed(1));

  let solarRating = "Good";
  let solarBadge = "cyan";
  if (peakSunHours >= 5.0) {
    solarRating = "Excellent";
    solarBadge = "green";
  } else if (peakSunHours < 3.5) {
    solarRating = "Moderate";
    solarBadge = "amber";
  }

  // 2. Wind Physics Calculations
  // Wind Speed in m/s (from km/h)
  const windSpeedMs = windSpeed10m / 3.6;

  // Extrapolate wind speed to 50m Hub Height using wind shear power law (alpha ~ 0.14 over open terrain)
  const alpha = 0.14;
  const windSpeed50m = parseFloat((windSpeedMs * Math.pow(50 / 10, alpha)).toFixed(1));

  // Wind Power Density (W/m²) = 0.5 * rho * v^3 (rho = 1.225 kg/m³)
  const airDensity = 1.225;
  const windPowerDensity = Math.round(0.5 * airDensity * Math.pow(windSpeedMs, 3));

  // Wind Power Class (1 to 7)
  let windClass = 1;
  let windRating = "Low Potential";
  let windBadge = "cyan";
  if (windPowerDensity >= 400) {
    windClass = 6;
    windRating = "Outstanding";
    windBadge = "green";
  } else if (windPowerDensity >= 250) {
    windClass = 4;
    windRating = "Good";
    windBadge = "green";
  } else if (windPowerDensity >= 150) {
    windClass = 2;
    windRating = "Moderate";
    windBadge = "amber";
  }

  // Daily Wind Turbine Output (kWh/day) for a micro turbine
  // Assumes capacity factor proportional to wind speed (cut-in ~ 3 m/s, rated ~ 11 m/s)
  const windCapFactor = Math.min(0.45, Math.max(0.05, (windSpeed50m - 2.5) / 20));
  const dailyWindKwh = parseFloat((windTurbineKw * 24 * windCapFactor).toFixed(1));
  const annualWindMwh = parseFloat(((dailyWindKwh * 365) / 1000).toFixed(2));

  // 3. Combined Environmental & Financial Offsets
  const totalAnnualKwh = (annualSolarMwh + annualWindMwh) * 1000;
  
  // Standard grid emission displacement factor: ~0.42 kg CO2 / kWh
  const co2AvoidedKgYear = Math.round(totalAnnualKwh * 0.42);
  
  // Tree planting offset equivalent: 1 mature tree absorbs ~21.8 kg CO2/year
  const treesEquivalentYear = Math.round(co2AvoidedKgYear / 21.8);

  // Average residential utility electricity cost: ~$0.16 / kWh
  const estimatedSavingsUsdYear = Math.round(totalAnnualKwh * 0.16);

  // 4. Generate 24-Hour Clean Energy Generation Profile Chart
  const hourlyProfile = [];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  hours.forEach((h) => {
    // Solar bell curve (peaks at solar noon ~12:00 to 13:00)
    let solarKw = 0;
    if (h >= 6 && h <= 18) {
      const solarAngle = Math.sin(((h - 6) / 12) * Math.PI);
      solarKw = parseFloat((systemSizeKw * solarAngle * cloudFactor * performanceRatio).toFixed(2));
    }

    // Wind generation with slight diurnal variation
    const windHourSpeed = hourly[h]?.wind ? hourly[h].wind / 3.6 : windSpeedMs;
    const hourWindFactor = Math.min(0.45, Math.max(0.05, (windHourSpeed - 2.0) / 18));
    const windKw = parseFloat((windTurbineKw * hourWindFactor).toFixed(2));

    const timeLabel = `${h.toString().padStart(2, "0")}:00`;

    hourlyProfile.push({
      time: timeLabel,
      solarKw,
      windKw,
      totalKw: parseFloat((solarKw + windKw).toFixed(2))
    });
  });

  return {
    solar: {
      systemSizeKw,
      panelEfficiency,
      peakSunHours,
      peakIrradianceWm2,
      dailySolarKwh,
      annualSolarMwh,
      capacityFactor: solarCapacityFactor,
      rating: solarRating,
      badge: solarBadge
    },
    wind: {
      turbineSizeKw: windTurbineKw,
      windSpeed10m: windSpeed10m.toFixed(1),
      windSpeed50m,
      powerDensity: windPowerDensity,
      windClass,
      dailyWindKwh,
      annualWindMwh,
      rating: windRating,
      badge: windBadge
    },
    impact: {
      totalAnnualMwh: parseFloat((annualSolarMwh + annualWindMwh).toFixed(2)),
      co2AvoidedKgYear,
      treesEquivalentYear,
      estimatedSavingsUsdYear
    },
    hourlyProfile
  };
}
