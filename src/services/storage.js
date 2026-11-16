// Safe localStorage helpers for ClimateSphere.
//
// Coordinates persisted here describe a city, not a person, and are rounded to
// city scale (2 decimals ≈ 1.1 km) so the app can restore the last view without
// keeping a precise GPS trail on the device.

export const STORAGE_KEYS = {
  lastLocation: "climatesphere_last_location",
  theme: "climatesphere_theme",
  watchlist: "climatesphere_pinned_watchlist"
};

const LOCATION_PRECISION = 2;

function isFiniteCoordinate(lat, lon) {
  if (lat === null || lat === undefined || lat === "" || lon === null || lon === undefined || lon === "") {
    return false;
  }
  return (
    Number.isFinite(Number(lat)) &&
    Number.isFinite(Number(lon)) &&
    Number(lat) >= -90 &&
    Number(lat) <= 90 &&
    Number(lon) >= -180 &&
    Number(lon) <= 180
  );
}

function roundCoordinate(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(Number(value) * factor) / factor;
}

export function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalises a location into the shape persisted on the device.
 * Returns null when the coordinates are missing or out of range.
 */
export function toStoredLocation(location) {
  if (!location || !isFiniteCoordinate(location.lat, location.lon)) return null;
  return {
    name: String(location.name ?? ""),
    cityName: String(location.cityName ?? ""),
    country: String(location.country ?? ""),
    lat: roundCoordinate(location.lat, LOCATION_PRECISION),
    lon: roundCoordinate(location.lon, LOCATION_PRECISION)
  };
}

export function getStoredLastLocation() {
  const parsed = readJson(STORAGE_KEYS.lastLocation, null);
  if (!parsed || !isFiniteCoordinate(parsed.lat, parsed.lon)) return null;
  return {
    name: parsed.name || "Selected Location",
    cityName: parsed.cityName || parsed.name || "Location",
    country: parsed.country || "",
    lat: parsed.lat,
    lon: parsed.lon
  };
}

export function saveLastLocation(location) {
  const stored = toStoredLocation(location);
  if (!stored) return false;
  return writeJson(STORAGE_KEYS.lastLocation, stored);
}

export { isFiniteCoordinate, roundCoordinate };
