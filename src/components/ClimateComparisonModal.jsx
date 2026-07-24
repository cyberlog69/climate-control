import React, { useState, useEffect } from "react";
import { searchLocations, fetchWeatherData, fetchAirQualityData } from "../services/weatherApi";
import { getAqiLevel } from "../services/climateData";
import { X, Search, GitCompare, Thermometer, Wind, Droplets, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

export default function ClimateComparisonModal({ locationA, weatherDataA, airQualityDataA, unit, onClose }) {
  const [queryB, setQueryB] = useState("");
  const [searchResultsB, setSearchResultsB] = useState([]);
  const [locationB, setLocationB] = useState({
    name: "London, UK",
    cityName: "London",
    lat: 51.5074,
    lon: -0.1278
  });

  const [weatherDataB, setWeatherDataB] = useState(null);
  const [airQualityDataB, setAirQualityDataB] = useState(null);
  const [isLoadingB, setIsLoadingB] = useState(false);

  // Load data for Location B
  useEffect(() => {
    let isMounted = true;
    async function loadB() {
      setIsLoadingB(true);
      try {
        const [w, a] = await Promise.all([
          fetchWeatherData(locationB.lat, locationB.lon),
          fetchAirQualityData(locationB.lat, locationB.lon)
        ]);
        if (isMounted) {
          setWeatherDataB(w);
          setAirQualityDataB(a);
        }
      } catch (err) {
        console.error("Error loading location B comparison:", err);
      } finally {
        if (isMounted) setIsLoadingB(false);
      }
    }
    loadB();
    return () => {
      isMounted = false;
    };
  }, [locationB]);

  const handleSearchB = async (q) => {
    setQueryB(q);
    if (q.trim().length >= 2) {
      const results = await searchLocations(q);
      setSearchResultsB(results);
    } else {
      setSearchResultsB([]);
    }
  };

  const handleSelectB = (loc) => {
    setLocationB(loc);
    setQueryB("");
    setSearchResultsB([]);
  };

  const displayTemp = (tempC) => {
    if (tempC == null) return "--";
    if (unit === "F") return Math.round((tempC * 9) / 5 + 32);
    return tempC;
  };

  const tempA = weatherDataA?.current?.temp;
  const tempB = weatherDataB?.current?.temp;
  const tempDiff = tempA != null && tempB != null ? Math.abs(tempA - tempB) : null;

  const aqiA = airQualityDataA?.us_aqi || 40;
  const aqiB = airQualityDataB?.us_aqi || 40;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(16px)",
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "850px",
          maxHeight: "90vh",
          padding: "1.75rem",
          position: "relative",
          overflowY: "auto",
          border: "1px solid var(--accent-cyan)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "var(--bg-inner)",
            border: "1px solid var(--border-light)",
            color: "var(--text-main)",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
          <GitCompare size={22} style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
            Dual-City Climate & Weather Comparison
          </h3>
        </div>

        {/* Search Bar for City B */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <div className="search-input-wrapper">
            <Search size={16} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              className="search-input"
              placeholder="Search second location to compare against..."
              value={queryB}
              onChange={(e) => handleSearchB(e.target.value)}
            />
          </div>

          {searchResultsB.length > 0 && (
            <div className="search-results-dropdown">
              {searchResultsB.map((item) => (
                <div key={item.id} className="search-result-item" onClick={() => handleSelectB(item)}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{item.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)" }}>
                    {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Split Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {/* Location A */}
          <div
            style={{
              background: "var(--bg-inner)",
              padding: "1.25rem",
              borderRadius: "18px",
              border: "1px solid var(--accent-cyan)"
            }}
          >
            <div className="badge badge-cyan" style={{ marginBottom: "0.5rem" }}>Primary Location</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)" }}>{locationA.name}</h4>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--accent-cyan)", margin: "0.4rem 0" }}>
              {displayTemp(tempA)}°{unit}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Feels like {displayTemp(weatherDataA?.current?.feelsLike)}°{unit}
            </div>

            {/* AQI Score */}
            <div style={{ padding: "0.75rem", background: "var(--bg-card)", borderRadius: "12px", marginBottom: "0.75rem" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Air Quality Index (AQI)</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: getAqiLevel(aqiA).color }}>
                {aqiA} ({getAqiLevel(aqiA).status})
              </div>
            </div>

            {/* Humidity & Wind */}
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div>Wind: <strong>{weatherDataA?.current?.windSpeed} km/h</strong></div>
              <div>Humidity: <strong>{weatherDataA?.current?.humidity}%</strong></div>
              <div>Pressure: <strong>{weatherDataA?.current?.pressure} hPa</strong></div>
            </div>
          </div>

          {/* Location B */}
          <div
            style={{
              background: "var(--bg-inner)",
              padding: "1.25rem",
              borderRadius: "18px",
              border: "1px solid var(--border-light)"
            }}
          >
            <div className="badge badge-amber" style={{ marginBottom: "0.5rem" }}>Compared Location</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)" }}>
              {locationB.name} {isLoadingB && <RefreshCw size={14} className="animate-spin" />}
            </h4>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--accent-amber)", margin: "0.4rem 0" }}>
              {displayTemp(tempB)}°{unit}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Feels like {displayTemp(weatherDataB?.current?.feelsLike)}°{unit}
            </div>

            {/* AQI Score */}
            <div style={{ padding: "0.75rem", background: "var(--bg-card)", borderRadius: "12px", marginBottom: "0.75rem" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Air Quality Index (AQI)</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: getAqiLevel(aqiB).color }}>
                {aqiB} ({getAqiLevel(aqiB).status})
              </div>
            </div>

            {/* Humidity & Wind */}
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div>Wind: <strong>{weatherDataB?.current?.windSpeed} km/h</strong></div>
              <div>Humidity: <strong>{weatherDataB?.current?.humidity}%</strong></div>
              <div>Pressure: <strong>{weatherDataB?.current?.pressure} hPa</strong></div>
            </div>
          </div>
        </div>

        {/* Delta Highlight Banner */}
        {tempDiff != null && (
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.85rem 1.1rem",
              background: "rgba(6, 182, 212, 0.15)",
              borderRadius: "14px",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              fontSize: "0.85rem",
              color: "var(--text-main)",
              textAlign: "center"
            }}
          >
            📊 Thermal Delta: <strong>{locationA.name.split(",")[0]}</strong> is{" "}
            <strong>
              {tempA > tempB ? `${tempDiff}°${unit} warmer` : `${tempDiff}°${unit} cooler`}
            </strong>{" "}
            than <strong>{locationB.name.split(",")[0]}</strong>.
          </div>
        )}
      </div>
    </div>
  );
}
