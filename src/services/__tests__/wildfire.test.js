import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import {
  fetchWildfireHotspots,
  SAMPLE_WILDFIRE_HOTSPOTS
} from "../wildfireSatelliteApi.js";
import { buildClimateExportData } from "../dataExportApi.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function jsonResponse(payload, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => payload
  };
}

const EONET_FIXTURE = {
  events: [
    {
      id: "EONET_1001",
      title: "Point Fire, California",
      link: "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_1001",
      categories: [{ id: "wildfires", title: "Wildfires" }],
      sources: [{ id: "InciWeb", url: "https://inciweb.example" }],
      geometry: [
        { date: "2026-08-01T00:00:00Z", type: "Point", coordinates: [-120.5, 38.2] }
      ]
    },
    {
      id: "EONET_1002",
      title: "Polygon Fire, Portugal",
      categories: [{ id: "wildfires", title: "Wildfires" }],
      sources: [{ id: "EFFIS" }],
      geometry: [
        {
          date: "2026-08-02T00:00:00Z",
          type: "Polygon",
          coordinates: [
            [
              [-8.0, 40.0],
              [-7.0, 40.0],
              [-7.0, 41.0],
              [-8.0, 41.0],
              [-8.0, 40.0]
            ]
          ]
        }
      ]
    }
  ]
};

test("live EONET events are mapped to hotspot objects", async () => {
  globalThis.fetch = async () => jsonResponse(EONET_FIXTURE);

  const result = await fetchWildfireHotspots();

  assert.equal(result.source, "live");
  assert.equal(result.hotspots.length, 2);
  assert.equal(result.hotspots[0].id, "EONET_1001");
  assert.equal(result.hotspots[0].lat, 38.2);
  assert.equal(result.hotspots[0].lon, -120.5);
  assert.equal(result.hotspots[0].frp, null);
  assert.equal(result.hotspots[1].lat, 40.5);
  assert.equal(result.hotspots[1].lon, -7.5);
  assert.match(result.hotspots[0].detectedAgo, /(ago|date unavailable)/);
});

test("EONET failures fall back to the labelled sample dataset", async () => {
  globalThis.fetch = async () => jsonResponse({ events: [] });

  const result = await fetchWildfireHotspots();

  assert.equal(result.source, "sample");
  assert.equal(result.hotspots, SAMPLE_WILDFIRE_HOTSPOTS);
  assert.ok(result.error);
});

test("export uses the supplied wildfire hotspots and sorts by distance", async () => {
  const location = {
    name: "Lisbon, Portugal",
    cityName: "Lisbon",
    country: "Portugal",
    lat: 38.7223,
    lon: -9.1393
  };

  const payload = await buildClimateExportData({
    location,
    weatherData: { current: {}, hourly: {}, daily: {} },
    airQualityData: null,
    datasets: { wildfires: true },
    wildfireHotspots: [
      { id: "far", name: "Far", lat: 60, lon: 60, status: "Active" },
      { id: "near", name: "Near", lat: 39, lon: -9, status: "Active" }
    ]
  });

  assert.equal(payload.nearbyWildfireHotspots.length, 2);
  assert.equal(payload.nearbyWildfireHotspots[0].id, "near");
  assert.ok(payload.nearbyWildfireHotspots[0].distanceKm < payload.nearbyWildfireHotspots[1].distanceKm);
});
