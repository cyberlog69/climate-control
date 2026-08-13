// Multi-City Watchlist & Pinboard Storage & Sync Engine
// Persists pinned locations in localStorage and provides batch weather telemetry

import { fetchWeatherData, fetchAirQualityData } from "./weatherApi";

const WATCHLIST_STORAGE_KEY = "climatesphere_pinned_watchlist";

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
    lon: -74.0060
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
 * Loads watchlist from localStorage (with fallback to defaults)
 */
export function getStoredWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return DEFAULT_PINNED_CITIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PINNED_CITIES;
  } catch (e) {
    console.warn("Failed to load watchlist from localStorage:", e);
    return DEFAULT_PINNED_CITIES;
  }
}

/**
 * Saves watchlist to localStorage
 */
export function saveWatchlist(cities) {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(cities));
  } catch (e) {
    console.warn("Failed to save watchlist to localStorage:", e);
  }
}

/**
 * Checks if a city is currently pinned
 */
export function isCityPinned(city, watchlist) {
  if (!city) return false;
  return watchlist.some(
    (item) =>
      item.id === city.id ||
      (Math.abs(item.lat - city.lat) < 0.05 && Math.abs(item.lon - city.lon) < 0.05) ||
      (item.cityName && city.cityName && item.cityName.toLowerCase() === city.cityName.toLowerCase())
  );
}

/**
 * Fetches current weather and AQI for all pinned cities in parallel
 */
export async function fetchWatchlistSummaries(cities) {
  const promises = cities.map(async (city) => {
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
    } catch (e) {
      console.warn(`Failed to fetch weather for pinned city ${city.name}:`, e);
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
  });

  return Promise.all(promises);
}
