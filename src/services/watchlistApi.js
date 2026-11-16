// Multi-City Watchlist & Pinboard Storage & Sync Engine
// Persists pinned locations in localStorage and provides batch weather telemetry

import { fetchWeatherData, fetchAirQualityData } from "./weatherApi.js";
import { STORAGE_KEYS, isFiniteCoordinate, readJson, roundCoordinate, writeJson } from "./storage.js";

const WATCHLIST_PRECISION = 4; // ~11 m, enough to identify a city

function normaliseCity(city) {
  if (!city || !isFiniteCoordinate(city.lat, city.lon)) return null;
  const cityName = String(city.cityName || city.name || "").trim();
  if (!cityName) return null;
  return {
    id: String(city.id || `loc-${cityName.toLowerCase()}-${roundCoordinate(city.lat, 2)}-${roundCoordinate(city.lon, 2)}`),
    name: String(city.name || cityName),
    cityName,
    country: String(city.country || ""),
    lat: roundCoordinate(city.lat, WATCHLIST_PRECISION),
    lon: roundCoordinate(city.lon, WATCHLIST_PRECISION)
  };
}

function sameCity(a, b) {
  if (!a || !b) return false;
  if (a.id && b.id && a.id === b.id) return true;
  return Boolean(
    a.cityName &&
      b.cityName &&
      a.cityName.toLowerCase() === b.cityName.toLowerCase() &&
      (a.country || "").toLowerCase() === (b.country || "").toLowerCase()
  );
}

// Default global sentinels pinned on initial visit
export const DEFAULT_PINNED_CITIES = [
  {
    id: "loc-tokyo",
    name: "Tokyo, Japan",
    cityName: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503
  },
  {
    id: "loc-london",
    name: "London, United Kingdom",
    cityName: "London",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278
  },
  {
    id: "loc-newyork",
    name: "New York, USA",
    cityName: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.006
  },
  {
    id: "loc-paris",
    name: "Paris, France",
    cityName: "Paris",
    country: "France",
    lat: 48.8566,
    lon: 2.3522
  },
  {
    id: "loc-sydney",
    name: "Sydney, Australia",
    cityName: "Sydney",
    country: "Australia",
    lat: -33.8688,
    lon: 151.2093
  },
  {
    id: "loc-svalbard",
    name: "Svalbard, Norway",
    cityName: "Svalbard",
    country: "Norway",
    lat: 78.2232,
    lon: 15.6267
  }
];

/**
 * Loads the watchlist from localStorage, repairing entries written by v1.5.2
 * (which stripped coordinates and made pinned cities unusable).
 */
export function getStoredWatchlist() {
  const parsed = readJson(STORAGE_KEYS.watchlist, null);
  if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PINNED_CITIES;

  const repaired = parsed
    .map((entry) => {
      const normalised = normaliseCity(entry);
      if (normalised) return normalised;

      // Legacy entry with null coordinates: recover the city from the defaults.
      const fallback = DEFAULT_PINNED_CITIES.find((city) => sameCity(city, entry));
      return fallback ? normaliseCity(fallback) : null;
    })
    .filter(Boolean);

  return repaired.length > 0 ? repaired : DEFAULT_PINNED_CITIES;
}

/**
 * Saves the watchlist to localStorage. Entries without usable coordinates are
 * skipped so a broken pin can never blank out the list.
 */
export function saveWatchlist(cities) {
  const safeCities = (Array.isArray(cities) ? cities : [])
    .map(normaliseCity)
    .filter(Boolean);

  writeJson(STORAGE_KEYS.watchlist, safeCities);
  return safeCities;
}

/**
 * Checks if a city is currently pinned
 */
export function isCityPinned(city, watchlist) {
  if (!city || !Array.isArray(watchlist)) return false;
  return watchlist.some((item) => {
    if (sameCity(item, city)) return true;
    if (!isFiniteCoordinate(item.lat, item.lon) || !isFiniteCoordinate(city.lat, city.lon)) {
      return false;
    }
    return Math.abs(item.lat - city.lat) < 0.05 && Math.abs(item.lon - city.lon) < 0.05;
  });
}

/**
 * Fetches current weather and AQI for all pinned cities in parallel.
 * Cities without coordinates are reported as unavailable instead of requesting
 * `latitude=null`, which Open-Meteo rejects.
 */
export async function fetchWatchlistSummaries(cities) {
  const list = Array.isArray(cities) ? cities : [];

  return Promise.all(
    list.map(async (city) => {
      const hasCoordinates = isFiniteCoordinate(city?.lat, city?.lon);
      if (!hasCoordinates) {
        return {
          ...city,
          temp: "--",
          weatherCode: 0,
          humidity: "--",
          windSpeed: "--",
          aqi: "--",
          aqiLevel: "Unavailable",
          aqiColor: "#64748b",
          isLoaded: false
        };
      }

      try {
        const [weather, aqi] = await Promise.all([
          fetchWeatherData(city.lat, city.lon),
          fetchAirQualityData(city.lat, city.lon)
        ]);
        return {
          ...city,
          temp: weather?.current?.temp ?? "--",
          weatherCode: weather?.current?.weatherCode ?? 0,
          humidity: weather?.current?.humidity ?? "--",
          windSpeed: weather?.current?.windSpeed ?? "--",
          aqi: aqi?.current?.aqi ?? 50,
          aqiLevel: aqi?.current?.level ?? "Good",
          aqiColor: aqi?.current?.color ?? "#10b981",
          isLoaded: true
        };
      } catch (error) {
        console.warn(`Failed to fetch weather for pinned city ${city.cityName}:`, error);
        return {
          ...city,
          temp: "--",
          weatherCode: 0,
          humidity: "--",
          windSpeed: "--",
          aqi: "--",
          aqiLevel: "Offline",
          aqiColor: "#64748b",
          isLoaded: false
        };
      }
    })
  );
}
