import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";

class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

globalThis.window = { localStorage: new MemoryStorage() };

const { STORAGE_KEYS } = await import("../storage.js");
const {
  DEFAULT_PINNED_CITIES,
  fetchWatchlistSummaries,
  getStoredWatchlist,
  isCityPinned,
  saveWatchlist
} = await import("../watchlistApi.js");
const { getStoredLastLocation, saveLastLocation } = await import("../storage.js");

beforeEach(() => {
  window.localStorage.clear();
});

test("watchlist preserves coordinates across a reload", () => {
  saveWatchlist([
    { id: "custom-1", name: "Berlin, Germany", cityName: "Berlin", country: "Germany", lat: 52.52, lon: 13.405 }
  ]);

  const restored = getStoredWatchlist();
  assert.equal(restored.length, 1);
  assert.equal(restored[0].cityName, "Berlin");
  assert.ok(Math.abs(restored[0].lat - 52.52) < 0.001);
  assert.ok(Math.abs(restored[0].lon - 13.405) < 0.001);
});

test("watchlist repairs entries written by the broken 1.5.2 format", () => {
  window.localStorage.setItem(
    STORAGE_KEYS.watchlist,
    JSON.stringify([
      { id: "loc-tokyo", name: "Tokyo, Japan", cityName: "Tokyo", country: "Japan", lat: null, lon: null },
      { id: "loc-unknown", name: "Nowhere", cityName: "Nowhere", country: "", lat: null, lon: null }
    ])
  );

  const restored = getStoredWatchlist();
  assert.equal(restored.length, 1);
  assert.equal(restored[0].id, "loc-tokyo");
  assert.equal(restored[0].lat, DEFAULT_PINNED_CITIES[0].lat);
});

test("watchlist rejects invalid coordinates without wiping the list", () => {
  saveWatchlist([{ id: "bad", name: "Bad", cityName: "Bad", lat: 500, lon: 0 }]);
  const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.watchlist));
  assert.deepEqual(stored, []);
  assert.ok(getStoredWatchlist().length > 0, "falls back to defaults");
});

test("pinning works by id or city name even if coordinates are missing", () => {
  const list = [{ id: "loc-1", cityName: "Oslo", country: "Norway", lat: null, lon: null }];
  assert.equal(isCityPinned({ id: "loc-1", cityName: "Oslo" }, list), true);
  assert.equal(isCityPinned({ cityName: "oslo", country: "Norway" }, list), true);
  assert.equal(isCityPinned({ cityName: "Lima", country: "Peru" }, list), false);
});

test("watchlist summaries do not call the network for coordinate-less cities", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("network must not be used for invalid coordinates");
  };

  try {
    const [summary] = await fetchWatchlistSummaries([
      { id: "legacy", cityName: "Legacy", country: "", lat: null, lon: null }
    ]);
    assert.equal(summary.isLoaded, false);
    assert.equal(summary.aqiLevel, "Unavailable");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("last location is rounded to city scale and restored", () => {
  saveLastLocation({
    name: "Paris, France",
    cityName: "Paris",
    country: "France",
    lat: 48.85661234,
    lon: 2.3522219
  });

  const restored = getStoredLastLocation();
  assert.equal(restored.cityName, "Paris");
  assert.equal(restored.lat, 48.86);
  assert.equal(restored.lon, 2.35);
});

test("invalid last locations are ignored", () => {
  window.localStorage.setItem(
    STORAGE_KEYS.lastLocation,
    JSON.stringify({ name: "Nowhere", lat: null, lon: null })
  );
  assert.equal(getStoredLastLocation(), null);
});
