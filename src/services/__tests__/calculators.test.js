import test from "node:test";
import assert from "node:assert/strict";

import { calculateCarbonFootprint, BENCHMARKS } from "../carbonFootprintApi.js";
import { calculateRenewableYield } from "../renewableEnergyApi.js";
import {
  calculateDistanceKm,
  evaluateLocalWildfireRisk,
  SAMPLE_WILDFIRE_HOTSPOTS
} from "../wildfireSatelliteApi.js";

test("carbon footprint returns a consistent breakdown", () => {
  const result = calculateCarbonFootprint({});

  assert.ok(result.totalTons > 0);
  assert.ok(result.totalTons < 50);
  assert.equal(result.breakdown.length, 4);
  const sum = result.breakdown.reduce((total, item) => total + item.value, 0);
  assert.ok(Math.abs(sum - result.totalTons) < 0.05, `breakdown ${sum} vs total ${result.totalTons}`);
  assert.equal(result.parisDelta, Number((result.totalTons - BENCHMARKS.parisTarget2030).toFixed(2)));
});

test("carbon mitigations reduce the total", () => {
  const baseline = calculateCarbonFootprint({});
  const mitigated = calculateCarbonFootprint({
    activeMitigations: ["act-ev", "act-green-tariff", "act-plant-rich"]
  });
  assert.ok(mitigated.totalTons < baseline.totalTons);
  assert.ok(mitigated.totalSavingsTons > 0);
  assert.ok(mitigated.treesNeededToOffset < baseline.treesNeededToOffset);
});

test("solar yield falls with latitude and cloud cover", () => {
  const clear = { current: { cloudCover: 0, windSpeed: 15 }, hourly: [] };
  const cloudy = { current: { cloudCover: 90, windSpeed: 15 }, hourly: [] };

  const equator = calculateRenewableYield({ lat: 0, weatherData: clear });
  const arctic = calculateRenewableYield({ lat: 78, weatherData: clear });
  const overcast = calculateRenewableYield({ lat: 0, weatherData: cloudy });

  assert.ok(equator.solar.peakSunHours > arctic.solar.peakSunHours);
  assert.ok(equator.solar.peakSunHours > overcast.solar.peakSunHours);
  assert.equal(equator.hourlyProfile.length, 24);
});

test("wildfire risk reacts to heat, dryness and wind", () => {
  const calm = evaluateLocalWildfireRisk(0, 0, {
    current: { temp: 15, humidity: 80, windSpeed: 5 }
  });
  const extreme = evaluateLocalWildfireRisk(40, -120, {
    current: { temp: 40, humidity: 10, windSpeed: 50 }
  });

  assert.ok(extreme.score > calm.score);
  assert.ok(["High", "Extreme"].includes(extreme.level));
  assert.ok(extreme.severeOutbreaksCount >= 1);
});

test("wildfire risk refuses to score without measured weather", () => {
  const result = evaluateLocalWildfireRisk(null, null, null, []);
  assert.equal(result.available, false);
  assert.equal(result.reason, "missing-weather");
});

test("wildfire risk handles a missing location and empty hotspot list", () => {
  const result = evaluateLocalWildfireRisk(
    null,
    null,
    { current: { temp: 20, humidity: 40, windSpeed: 10 } },
    []
  );
  assert.equal(result.available, true);
  assert.equal(result.nearestCluster, null);
  assert.equal(result.minDistanceKm, null);
  assert.equal(result.totalGlobalClusters, 0);
});

test("haversine distance is correct for a known city pair", () => {
  const londonParis = calculateDistanceKm(51.5074, -0.1278, 48.8566, 2.3522);
  assert.ok(londonParis > 330 && londonParis < 360, `got ${londonParis} km`);
  assert.equal(calculateDistanceKm(10, 10, 10, 10), 0);
});

test("sample dataset is clearly marked as sample data", () => {
  assert.ok(SAMPLE_WILDFIRE_HOTSPOTS.length > 0);
  for (const hotspot of SAMPLE_WILDFIRE_HOTSPOTS) {
    assert.equal(hotspot.detectedAgo, "sample data");
  }
});
