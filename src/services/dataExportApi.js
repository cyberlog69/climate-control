// Raw Climate Data Exporter Engine
// Compiles, formats, and serializes planetary telemetry into CSV (RFC 4180) and JSON formats

import { getHistoricalClimateTrajectory } from "./historicalClimateApi";
import { calculateRenewableYield } from "./renewableEnergyApi";
import { GLOBAL_WILDFIRE_HOTSPOTS, calculateDistanceKm } from "./wildfireSatelliteApi";

/**
 * Builds a structured dataset object containing selected climate data streams
 */
export async function buildClimateExportData({
  location,
  weatherData,
  airQualityData,
  datasets = {
    hourly: true,
    daily: true,
    airQuality: true,
    historical: true,
    energy: true,
    wildfires: true
  },
  unit = "C"
}) {
  const meta = {
    platform: "ClimateSphere Planetary Intelligence",
    exportedAt: new Date().toISOString(),
    location: {
      name: location.name,
      cityName: location.cityName || location.name.split(",")[0],
      country: location.country || "",
      coordinates: {
        latitude: location.lat,
        longitude: location.lon
      }
    },
    units: {
      temperature: `°${unit}`,
      windSpeed: "km/h",
      precipitation: "mm",
      pressure: "hPa",
      irradiance: "W/m²",
      airQuality: "µg/m³"
    }
  };

  const payload = { metadata: meta };

  // 1. Hourly Forecast
  if (datasets.hourly && weatherData?.hourly) {
    const hourly = weatherData.hourly;
    payload.hourlyForecast = hourly.time.map((timeStr, idx) => {
      const temp = hourly.temperature_2m?.[idx] ?? null;
      return {
        timestamp: timeStr,
        temperature: temp != null && unit === "F" ? parseFloat(((temp * 9) / 5 + 32).toFixed(1)) : temp,
        relativeHumidityPct: hourly.relative_humidity_2m?.[idx] ?? null,
        precipitationMm: hourly.precipitation?.[idx] ?? 0,
        precipitationProbabilityPct: hourly.precipitation_probability?.[idx] ?? 0,
        windSpeedKmh: hourly.wind_speed_10m?.[idx] ?? null,
        surfacePressureHpa: hourly.surface_pressure?.[idx] ?? null,
        weatherCode: hourly.weather_code?.[idx] ?? 0
      };
    });
  }

  // 2. 7-Day Daily Forecast
  if (datasets.daily && weatherData?.daily) {
    payload.dailyForecast = weatherData.daily.map((day) => ({
      date: day.date,
      maxTemp: unit === "F" ? parseFloat(((day.maxTemp * 9) / 5 + 32).toFixed(1)) : day.maxTemp,
      minTemp: unit === "F" ? parseFloat(((day.minTemp * 9) / 5 + 32).toFixed(1)) : day.minTemp,
      precipitationMm: day.precipitationSum,
      precipitationProbabilityPct: day.precipitationProbability,
      windSpeedMaxKmh: day.windSpeedMax,
      uvIndexMax: day.uvIndexMax,
      sunrise: day.sunrise,
      sunset: day.sunset,
      weatherCode: day.weatherCode
    }));
  }

  // 3. Air Quality & Particulates
  if (datasets.airQuality && airQualityData) {
    payload.airQuality = {
      aqiIndex: airQualityData.current?.aqi ?? 50,
      hazardLevel: airQualityData.current?.level ?? "Good",
      pollutants: airQualityData.pollutants || {}
    };
  }

  // 4. Historical Trajectory (1950 - 2026)
  if (datasets.historical) {
    const hist = getHistoricalClimateTrajectory(location.lat, location.lon, weatherData?.current?.temp || 20);
    payload.historicalClimate1950_2026 = hist.trajectory;
  }

  // 5. Renewable Energy Potential
  if (datasets.energy) {
    const energy = calculateRenewableYield({
      lat: location.lat,
      lon: location.lon,
      weatherData,
      systemSizeKw: 5,
      windTurbineKw: 3
    });
    payload.renewableEnergyPotential = energy;
  }

  // 6. NASA Wildfires in Regional Perimeter
  if (datasets.wildfires) {
    const nearby = GLOBAL_WILDFIRE_HOTSPOTS.map((fire) => {
      const dist = calculateDistanceKm(location.lat, location.lon, fire.lat, fire.lon);
      return {
        ...fire,
        distanceKm: dist
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    payload.nearbyWildfireHotspots = nearby;
  }

  return payload;
}

/**
 * Converts dataset object into RFC 4180 CSV string
 */
export function convertToCSV(payload) {
  let csv = [];
  const meta = payload.metadata;

  // Metadata block
  csv.push(`# ClimateSphere Data Export`);
  csv.push(`# Location: ${meta.location.name} (${meta.location.coordinates.latitude}, ${meta.location.coordinates.longitude})`);
  csv.push(`# Exported At: ${meta.exportedAt}`);
  csv.push(`# Units: Temp=${meta.units.temperature}, Wind=${meta.units.windSpeed}, Precip=${meta.units.precipitation}`);
  csv.push("");

  // 1. Hourly Forecast Table
  if (payload.hourlyForecast && payload.hourlyForecast.length > 0) {
    csv.push("## SECTION: HOURLY_FORECAST");
    csv.push("timestamp,temperature,relative_humidity_pct,precipitation_mm,precipitation_prob_pct,wind_speed_kmh,pressure_hpa,weather_code");
    payload.hourlyForecast.forEach((row) => {
      csv.push(
        `"${row.timestamp}",${row.temperature ?? ""},${row.relativeHumidityPct ?? ""},${row.precipitationMm ?? ""},${row.precipitationProbabilityPct ?? ""},${row.windSpeedKmh ?? ""},${row.surfacePressureHpa ?? ""},${row.weatherCode ?? ""}`
      );
    });
    csv.push("");
  }

  // 2. Daily Forecast Table
  if (payload.dailyForecast && payload.dailyForecast.length > 0) {
    csv.push("## SECTION: DAILY_FORECAST");
    csv.push("date,max_temp,min_temp,precipitation_mm,precipitation_prob_pct,max_wind_kmh,uv_index_max,sunrise,sunset,weather_code");
    payload.dailyForecast.forEach((row) => {
      csv.push(
        `"${row.date}",${row.maxTemp ?? ""},${row.minTemp ?? ""},${row.precipitationMm ?? ""},${row.precipitationProbabilityPct ?? ""},${row.windSpeedMaxKmh ?? ""},${row.uvIndexMax ?? ""},"${row.sunrise ?? ""}","${row.sunset ?? ""}",${row.weatherCode ?? ""}`
      );
    });
    csv.push("");
  }

  // 3. Historical Trajectory Table
  if (payload.historicalClimate1950_2026 && payload.historicalClimate1950_2026.length > 0) {
    csv.push("## SECTION: HISTORICAL_CLIMATE_TRAJECTORY_1950_2026");
    csv.push("year,decade,temp_anomaly_c,atmospheric_co2_ppm,heatwave_days_per_year,temp_c");
    payload.historicalClimate1950_2026.forEach((row) => {
      csv.push(`${row.year},"${row.decade}",${row.tempAnomaly},${row.co2Ppm},${row.heatwaveDays},${row.tempC}`);
    });
    csv.push("");
  }

  // 4. Wildfire Hotspots Table
  if (payload.nearbyWildfireHotspots && payload.nearbyWildfireHotspots.length > 0) {
    csv.push("## SECTION: NASA_WILDFIRE_HOTSPOTS");
    csv.push("id,name,latitude,longitude,brightness_c,frp_mw,sensor,confidence_pct,distance_km");
    payload.nearbyWildfireHotspots.forEach((row) => {
      csv.push(
        `"${row.id}","${row.name}",${row.lat},${row.lon},${row.brightnessTempC},${row.frp},"${row.sensor}",${row.confidence},${row.distanceKm}`
      );
    });
    csv.push("");
  }

  return csv.join("\n");
}

/**
 * Initiates direct client-side file download
 */
export function triggerFileDownload(content, filename, mimeType = "text/plain") {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
