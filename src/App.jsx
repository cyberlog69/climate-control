import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import ClimateVitals from "./components/ClimateVitals";
import InteractiveMap from "./components/InteractiveMap";
import WeatherDetailCard from "./components/WeatherDetailCard";
import AirQualityCard from "./components/AirQualityCard";
import ForecastSection from "./components/ForecastSection";
import HistoricalAnomalyChart from "./components/HistoricalAnomalyChart";
import ExtremeEventsRadar from "./components/ExtremeEventsRadar";
import WeatherParticles from "./components/WeatherParticles";
import { useTouchSwipe } from "./hooks/useTouchSwipe";
import { fetchWeatherData, fetchAirQualityData, reverseGeocode } from "./services/weatherApi";
import { Thermometer, TrendingUp, Compass, AlertCircle, MoveHorizontal } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("live"); // 'live' | 'forecast' | 'vitals'
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Theme State ('dark' | 'light') with LocalStorage Persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("climatesphere_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("climatesphere_theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const tabs = ["live", "forecast", "vitals"];

  // Touch Swipe Gesture Navigation
  useTouchSwipe({
    onSwipeLeft: () => {
      const currentIdx = tabs.indexOf(activeTab);
      if (currentIdx < tabs.length - 1) {
        setActiveTab(tabs[currentIdx + 1]);
      }
    },
    onSwipeRight: () => {
      const currentIdx = tabs.indexOf(activeTab);
      if (currentIdx > 0) {
        setActiveTab(tabs[currentIdx - 1]);
      }
    }
  });

  // Load Data for Selected Location
  const loadDataForLocation = useCallback(async (location, showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
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

  useEffect(() => {
    loadDataForLocation(currentLocation);
  }, [currentLocation, loadDataForLocation]);

  const handleSelectLocation = async (loc) => {
    if (!loc.cityName || loc.cityName === "Custom Coordinates") {
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
    <div className="control-room-container">
      {/* Background Weather Particle Canvas */}
      <WeatherParticles
        weatherCode={weatherData?.current?.weatherCode || 0}
        isDay={weatherData?.current?.isDay ?? true}
      />

      {/* Header & Navbar */}
      <Navbar
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onAutoLocate={handleAutoLocate}
        isRefreshing={isRefreshing}
        onRefresh={() => loadDataForLocation(currentLocation, true)}
        weatherData={weatherData}
        airQualityData={airQualityData}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Error Notification */}
      {error && (
        <div
          className="glass-card"
          style={{
            padding: "0.65rem 1rem",
            background: "rgba(239, 68, 68, 0.15)",
            borderColor: "rgba(239, 68, 68, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "#fca5a5",
            fontSize: "0.82rem"
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Planetary Control Room Workspace */}
      <div className="control-room-workspace">
        {/* Left Pane: Interactive Global Climate Map */}
        <InteractiveMap
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          weatherData={weatherData}
          theme={theme}
        />

        {/* Right Pane: Command Terminal with Mobile Bottom Drawer Support */}
        <div className={`command-panel ${isMobileDrawerOpen ? "drawer-open" : ""}`}>
          {/* Mobile Bottom Sheet Handle */}
          <div
            className="mobile-drawer-handle"
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          />

          {/* Touch Gesture Hint Banner */}
          <div className="touch-swipe-hint">
            <MoveHorizontal size={14} />
            <span>Swipe left/right to change panels</span>
          </div>

          {/* View Tab Switcher */}
          <div className="control-tabs">
            <button
              className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("live");
                setIsMobileDrawerOpen(true);
              }}
            >
              <Thermometer size={15} />
              <span>Live Terminal</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "forecast" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("forecast");
                setIsMobileDrawerOpen(true);
              }}
            >
              <Compass size={15} />
              <span>Forecast & Warming</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "vitals" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("vitals");
                setIsMobileDrawerOpen(true);
              }}
            >
              <TrendingUp size={15} />
              <span>Earth Vitals</span>
            </button>
          </div>

          {/* Tab 1: Live Terminal */}
          {activeTab === "live" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <WeatherDetailCard
                locationName={currentLocation.name}
                weatherData={weatherData}
                unit={unit}
              />
              <AirQualityCard airQualityData={airQualityData} />
            </div>
          )}

          {/* Tab 2: Forecast & Climate Trends */}
          {activeTab === "forecast" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <ForecastSection weatherData={weatherData} unit={unit} />
              <HistoricalAnomalyChart
                locationName={currentLocation.name}
                weatherData={weatherData}
                unit={unit}
              />
            </div>
          )}

          {/* Tab 3: Earth's Vital Signs & Climate Radar */}
          {activeTab === "vitals" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <ClimateVitals />
              <ExtremeEventsRadar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
