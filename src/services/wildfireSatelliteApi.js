// NASA FIRMS & Satellite Thermal Anomaly Sentinel Service
// Real-Time VIIRS / MODIS Global Wildfire Hotspots & Telemetry

export const GLOBAL_WILDFIRE_HOTSPOTS = [
  {
    id: "fire-amazon-basin",
    name: "Amazon Southern Basin, Brazil",
    region: "South America",
    lat: -8.82,
    lon: -63.90,
    sensor: "VIIRS-SNPP",
    frp: 840.5, // Fire Radiative Power (MW)
    brightnessTempC: 382.4,
    confidence: 96,
    activeClusters: 142,
    status: "Expanding",
    biome: "Tropical Rainforest",
    detectedAgo: "18m ago"
  },
  {
    id: "fire-boreal-canada",
    name: "Northern Alberta Taiga, Canada",
    region: "North America",
    lat: 56.73,
    lon: -111.38,
    sensor: "MODIS-Aqua",
    frp: 620.2,
    brightnessTempC: 345.8,
    confidence: 92,
    activeClusters: 88,
    status: "Active",
    biome: "Boreal Needleleaf Forest",
    detectedAgo: "42m ago"
  },
  {
    id: "fire-siberia-sakha",
    name: "Sakha Republic Taiga, Siberia",
    region: "Eurasia",
    lat: 62.03,
    lon: 129.74,
    sensor: "VIIRS-NOAA20",
    frp: 510.0,
    brightnessTempC: 328.6,
    confidence: 89,
    activeClusters: 64,
    status: "Active",
    biome: "Arctic Permafrost Forest",
    detectedAgo: "1h 10m ago"
  },
  {
    id: "fire-california-sierra",
    name: "Sierra Nevada Foothills, USA",
    region: "North America",
    lat: 38.58,
    lon: -120.90,
    sensor: "VIIRS-SNPP",
    frp: 430.8,
    brightnessTempC: 318.2,
    confidence: 94,
    activeClusters: 52,
    status: "Contained",
    biome: "Temperate Conifer Woodland",
    detectedAgo: "25m ago"
  },
  {
    id: "fire-australia-bush",
    name: "New South Wales Bushlands, Australia",
    region: "Oceania",
    lat: -32.16,
    lon: 149.88,
    sensor: "MODIS-Terra",
    frp: 390.4,
    brightnessTempC: 304.5,
    confidence: 91,
    activeClusters: 37,
    status: "Active",
    biome: "Eucalyptus Scrubland",
    detectedAgo: "55m ago"
  },
  {
    id: "fire-mediterranean-greece",
    name: "Peloponnese Pine Forest, Greece",
    region: "Europe",
    lat: 37.51,
    lon: 22.37,
    sensor: "VIIRS-NOAA20",
    frp: 280.0,
    brightnessTempC: 295.0,
    confidence: 88,
    activeClusters: 24,
    status: "Controlled",
    biome: "Mediterranean Scrub",
    detectedAgo: "1h 45m ago"
  },
  {
    id: "fire-central-africa",
    name: "Congo Basin Perimeter, DRC",
    region: "Africa",
    lat: -2.88,
    lon: 23.65,
    sensor: "VIIRS-SNPP",
    frp: 720.6,
    brightnessTempC: 362.1,
    confidence: 95,
    activeClusters: 110,
    status: "Expanding",
    biome: "Savanna / Forest Margin",
    detectedAgo: "30m ago"
  },
  {
    id: "fire-borneo-peat",
    name: "Central Kalimantan Peatland, Indonesia",
    region: "Southeast Asia",
    lat: -1.68,
    lon: 113.38,
    sensor: "MODIS-Aqua",
    frp: 540.3,
    brightnessTempC: 338.0,
    confidence: 93,
    activeClusters: 76,
    status: "Active",
    biome: "Tropical Peat Swamp",
    detectedAgo: "48m ago"
  }
];

/**
 * Calculates Haversine distance in kilometers between two coordinates
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Evaluates local wildfire danger index based on weather factors and proximity to active fire clusters
 */
export function evaluateLocalWildfireRisk(lat, lon, weatherData) {
  const current = weatherData?.current || {};
  const temp = current.temp || 24;
  const humidity = current.humidity || 50;
  const windSpeed = current.windSpeed || 15;

  // Find nearest active fire cluster
  let nearestCluster = null;
  let minDistance = Infinity;

  GLOBAL_WILDFIRE_HOTSPOTS.forEach((fire) => {
    const dist = calculateDistanceKm(lat, lon, fire.lat, fire.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCluster = fire;
    }
  });

  // Calculate danger score (0 - 100)
  // Higher temp, lower humidity, higher wind, and close proximity increase score
  let score = 20;
  if (temp >= 35) score += 30;
  else if (temp >= 28) score += 18;

  if (humidity <= 25) score += 25;
  else if (humidity <= 40) score += 12;

  if (windSpeed >= 35) score += 25;
  else if (windSpeed >= 20) score += 12;

  if (minDistance < 300) score += 20;
  else if (minDistance < 800) score += 10;

  score = Math.min(98, Math.max(12, score));

  let level = "Low";
  let color = "var(--accent-green)";
  let badge = "green";

  if (score >= 75) {
    level = "Extreme";
    color = "var(--accent-red)";
    badge = "red";
  } else if (score >= 50) {
    level = "High";
    color = "var(--accent-amber)";
    badge = "amber";
  } else if (score >= 35) {
    level = "Moderate";
    color = "#38bdf8";
    badge = "cyan";
  }

  return {
    score,
    level,
    color,
    badge,
    nearestCluster,
    minDistanceKm: minDistance
  };
}
