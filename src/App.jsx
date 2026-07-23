import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import ClimateVitals from "./components/ClimateVitals";
import InteractiveMap from "./components/InteractiveMap";
import WeatherDetailCard from "./components/WeatherDetailCard";
import AirQualityCard from "./components/AirQualityCard";
import ForecastSection from "./components/ForecastSection";
import HistoricalAnomalyChart from "./components/HistoricalAnomalyChart";
import ExtremeEventsRadar from "./components/ExtremeEventsRadar";
import { fetchWeatherData, fetchAirQualityData, reverseGeocode } from "./services/weatherApi";
import { Globe, AlertCircle, Heart } from "lucide-react";

export default function App() {
  // Default Location: Tokyo, Japan
  const [currentLocation, setCurrentLocation] = useState({
    name: "Tokyo, Japan",
    cityName: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503
  });

  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [unit, setUnit] = useState("C"); // 'C' | 'F'
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Load Data for Selected Location
  const loadDataForLocation = useCallback(async (location, showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      // Fetch parallel weather and air quality feeds
      const [weather, aqi] = await Promise.all([
        fetchWeatherData(location.lat, location.lon),
        fetchAirQualityData(location.lat, location.lon)
      ]);

      setWeatherData(weather);
      setAirQualityData(aqi);
    } catch (err) {
      console.error("Failed to load location data:", err);
      setError("Unable to sync live weather feeds. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Trigger load on location change
  useEffect(() => {
    loadDataForLocation(currentLocation);
  }, [currentLocation, loadDataForLocation]);

  // Handle Location Selection from Navbar Search, Map Click or Hotspots
  const handleSelectLocation = async (loc) => {
    if (!loc.cityName || loc.cityName === "Custom Coordinates") {
      // Reverse geocode if missing proper name
      const geo = await reverseGeocode(loc.lat, loc.lon);
      setCurrentLocation({
        name: geo.name,
        cityName: geo.cityName,
        country: geo.country,
        lat: loc.lat,
        lon: loc.lon
      });
    } else {
      setCurrentLocation(loc);
    }
  };

  // Browser Geolocation Auto-detect
  const handleAutoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const geo = await reverseGeocode(latitude, longitude);
          setCurrentLocation({
            name: geo.name,
            cityName: geo.cityName,
            country: geo.country,
            lat: latitude,
            lon: longitude
          });
        },
        (err) => {
          console.warn("Geolocation denied/failed:", err);
          alert("Could not access your location. Using default location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  return (
    <div className="app-container">
      {/* Header & Navbar */}
      <Navbar
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onAutoLocate={handleAutoLocate}
        isRefreshing={isRefreshing}
        onRefresh={() => loadDataForLocation(currentLocation, true)}
      />

      {/* Error Alert */}
      {error && (
        <div
          className="glass-card"
          style={{
            padding: "1rem 1.5rem",
            marginBottom: "1.5rem",
            background: "rgba(239, 68, 68, 0.15)",
            borderColor: "rgba(239, 68, 68, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "#fca5a5"
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Earth's Vital Signs Section */}
      <ClimateVitals />

      {/* Main Grid: Interactive Map (Left) & Weather + AQI Details (Right) */}
      <div className="grid-main">
        {/* Interactive Map */}
        <InteractiveMap
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          weatherData={weatherData}
        />

        {/* Live Weather & Air Quality Terminal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <WeatherDetailCard
            locationName={currentLocation.name}
            weatherData={weatherData}
            unit={unit}
          />
          <AirQualityCard airQualityData={airQualityData} />
        </div>
      </div>

      {/* Secondary Grid: Forecast, Historical Anomaly, Extreme Alerts */}
      <div className="grid-secondary">
        <ForecastSection weatherData={weatherData} unit={unit} />
        <HistoricalAnomalyChart
          locationName={currentLocation.name}
          weatherData={weatherData}
          unit={unit}
        />
        <ExtremeEventsRadar />
      </div>

      {/* Footer */}
      <footer
        className="glass-card"
        style={{
          padding: "1.25rem 1.5rem",
          marginTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.8rem",
          color: "var(--text-muted)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Globe size={16} style={{ color: "var(--accent-cyan)" }} />
          <span>ClimateSphere Sentinel &copy; 2026 — Global Realtime Environmental Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span>Data Feeds: <strong>Open-Meteo API</strong></span>
          <span>•</span>
          <span>Baselines: <strong>NASA GISS / NOAA / Keeling Curve</strong></span>
        </div>
      </footer>
    </div>
  );
}
