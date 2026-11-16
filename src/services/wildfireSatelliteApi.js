// NASA Wildfire Event Service
// Live data comes from NASA EONET (Earth Observatory Natural Event Tracker), which
// requires no API key. When the feed is unreachable, a clearly-labelled sample
// dataset is returned so the map and globe stay populated offline.

const EONET_EVENTS_URL = "https://eonet.gsfc.nasa.gov/api/v3/events";
const EONET_TIMEOUT_MS = 10000;

// Bundled fallback dataset. These are representative sample events, not a live feed.
export const SAMPLE_WILDFIRE_HOTSPOTS = [
  {
    id: "fire-amazon-basin",
    name: "Amazon Southern Basin, Brazil",
    region: "South America",
    lat: -8.82,
    lon: -63.9,
    sensor: "VIIRS-SNPP",
    frp: 840.5,
    brightnessTempC: 382.4,
    confidence: 96,
    activeClusters: 142,
    status: "Expanding",
    biome: "Tropical Rainforest",
    detectedAgo: "sample data"
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
    detectedAgo: "sample data"
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
    detectedAgo: "sample data"
  },
  {
    id: "fire-california-sierra",
    name: "Sierra Nevada Foothills, USA",
    region: "North America",
    lat: 38.58,
    lon: -120.9,
    sensor: "VIIRS-SNPP",
    frp: 430.8,
    brightnessTempC: 318.2,
    confidence: 94,
    activeClusters: 52,
    status: "Contained",
    biome: "Temperate Conifer Woodland",
    detectedAgo: "sample data"
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
    detectedAgo: "sample data"
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
    detectedAgo: "sample data"
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
    detectedAgo: "sample data"
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
    detectedAgo: "sample data"
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

function formatRelativeTime(isoDate) {
  const timestamp = Date.parse(isoDate);
  if (!Number.isFinite(timestamp)) return "date unavailable";
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/**
 * NASA EONET returns Point or Polygon geometries; reduce either to a centroid.
 */
function geometryToCoordinates(geometry) {
  if (!geometry?.coordinates) return null;
  const { type, coordinates } = geometry;

  if (type === "Point" && Array.isArray(coordinates) && coordinates.length >= 2) {
    return { lon: Number(coordinates[0]), lat: Number(coordinates[1]) };
  }

  const ring = Array.isArray(coordinates[0]) ? coordinates[0] : coordinates;
  const points = ring.filter((pair) => Array.isArray(pair) && pair.length >= 2);
  if (points.length === 0) return null;

  // GeoJSON polygons repeat the first point at the end; ignore it for the centroid.
  const first = points[0];
  const last = points[points.length - 1];
  const uniquePoints =
    points.length > 1 && first[0] === last[0] && first[1] === last[1]
      ? points.slice(0, -1)
      : points;
  if (uniquePoints.length === 0) return null;

  const totals = uniquePoints.reduce(
    (acc, [lon, lat]) => ({ lon: acc.lon + Number(lon), lat: acc.lat + Number(lat) }),
    { lon: 0, lat: 0 }
  );
  return { lon: totals.lon / uniquePoints.length, lat: totals.lat / uniquePoints.length };
}

function mapEonetEvent(event) {
  const geometries = Array.isArray(event.geometry) ? event.geometry : [];
  const latest = [...geometries].reverse().find((geometry) => geometryToCoordinates(geometry));
  const coords = latest ? geometryToCoordinates(latest) : null;
  if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lon)) return null;

  const category = event.categories?.[0]?.title || "Wildfire";
  const source = event.sources?.[0]?.id || "NASA EONET";

  return {
    id: event.id,
    name: event.title,
    region: category,
    lat: coords.lat,
    lon: coords.lon,
    sensor: source,
    frp: null,
    brightnessTempC: null,
    confidence: null,
    activeClusters: 1,
    status: "Active",
    biome: "Wildfire event",
    detectedAt: latest?.date || null,
    detectedAgo: latest?.date ? formatRelativeTime(latest.date) : "date unavailable",
    detailsUrl: event.link || null
  };
}

/**
 * Fetches open wildfire events from NASA EONET.
 * Never throws: failures resolve to the labelled sample dataset.
 */
export async function fetchWildfireHotspots({ signal, limit = 12 } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EONET_TIMEOUT_MS);

  const abortFromCaller = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", abortFromCaller, { once: true });
  }

  try {
    const url = new URL(EONET_EVENTS_URL);
    url.searchParams.set("status", "open");
    url.searchParams.set("category", "wildfires");
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      throw new Error(`NASA EONET HTTP ${response.status}`);
    }

    const payload = await response.json();
    const hotspots = (payload?.events || [])
      .map(mapEonetEvent)
      .filter(Boolean)
      .slice(0, limit);

    if (hotspots.length === 0) {
      throw new Error("NASA EONET returned no open wildfire events");
    }

    return {
      hotspots,
      source: "live",
      fetchedAt: new Date().toISOString(),
      error: null
    };
  } catch (error) {
    return {
      hotspots: SAMPLE_WILDFIRE_HOTSPOTS,
      source: "sample",
      fetchedAt: new Date().toISOString(),
      error: error?.name === "AbortError" ? "request aborted" : String(error?.message || error)
    };
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener("abort", abortFromCaller);
  }
}

/**
 * Evaluates local wildfire danger index based on weather factors and proximity to active fire clusters
 */
export function evaluateLocalWildfireRisk(
  lat,
  lon,
  weatherData,
  hotspots = SAMPLE_WILDFIRE_HOTSPOTS
) {
  const current = weatherData?.current || {};
  const temp = current.temp ?? 24;
  const humidity = current.humidity ?? 50;
  const windSpeed = current.windSpeed ?? 15;
  const hasLocation = Number.isFinite(Number(lat)) && Number.isFinite(Number(lon));
  const list = Array.isArray(hotspots) ? hotspots : [];

  let nearestCluster = null;
  let minDistance = Infinity;

  if (hasLocation) {
    list.forEach((fire) => {
      if (!Number.isFinite(fire?.lat) || !Number.isFinite(fire?.lon)) return;
      const distance = calculateDistanceKm(Number(lat), Number(lon), fire.lat, fire.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCluster = fire;
      }
    });
  }

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
  let badge = "green";
  let color = "#10b981";

  if (score >= 75) {
    level = "Extreme";
    badge = "red";
    color = "#ef4444";
  } else if (score >= 50) {
    level = "High";
    badge = "amber";
    color = "#f59e0b";
  } else if (score >= 35) {
    level = "Moderate";
    badge = "cyan";
    color = "#38bdf8";
  }

  const peakFrp = list.reduce((max, fire) => (Number.isFinite(fire?.frp) ? Math.max(max, fire.frp) : max), 0);

  return {
    score,
    level,
    badge,
    color,
    nearestCluster,
    minDistanceKm: Number.isFinite(minDistance) ? minDistance : null,
    totalGlobalClusters: list.reduce((total, fire) => total + (Number(fire?.activeClusters) || 0), 0),
    severeOutbreaksCount: list.filter((fire) => Number(fire?.frp) >= 500).length,
    peakFrpMw: peakFrp,
    hotspotCount: list.length
  };
}
