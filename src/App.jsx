import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import ClimateVitals from "./components/ClimateVitals";
import InteractiveMap from "./components/InteractiveMap";
import WeatherDetailCard from "./components/WeatherDetailCard";
import AirQualityCard from "./components/AirQualityCard";
import ForecastSection from "./components/ForecastSection";
import HistoricalAnomalyChart from "./components/HistoricalAnomalyChart";
import ExtremeEventsRadar from "./components/ExtremeEventsRadar";
import WildfireSatelliteCard from "./components/WildfireSatelliteCard";
import RenewableEnergyEstimator from "./components/RenewableEnergyEstimator";
import CarbonFootprintCalculator from "./components/CarbonFootprintCalculator";
import ClimateImpactSimulator from "./components/ClimateImpactSimulator";
import HistoricalTimeMachine from "./components/HistoricalTimeMachine";
import ClimateComparisonModal from "./components/ClimateComparisonModal";
import ReportGeneratorModal from "./components/ReportGeneratorModal";
import WatchlistModal from "./components/WatchlistModal";
import VoiceBriefingModal from "./components/VoiceBriefingModal";
import DataExportModal from "./components/DataExportModal";
import AboutModal from "./components/AboutModal";
import WeatherParticles from "./components/WeatherParticles";
import SpatialDock from "./components/SpatialDock";
import TimelineScrubber from "./components/TimelineScrubber";
import { useTouchSwipe } from "./hooks/useTouchSwipe";
import { fetchWeatherData, fetchAirQualityData, reverseGeocode } from "./services/weatherApi";
import { getStoredWatchlist, saveWatchlist, isCityPinned } from "./services/watchlistApi";
import { Thermometer, TrendingUp, Compass, Sliders, History, Zap, Leaf, AlertCircle, MoveHorizontal, Eye, EyeOff, Layers, X } from "lucide-react";

export default function App() {
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
  const [activeTab, setActiveTab] = useState("live"); // 'live' | 'forecast' | 'vitals' | 'sim'
  const [viewMode, setViewMode] = useState("3d");
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isVoiceBriefingOpen, setIsVoiceBriefingOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return getStoredWatchlist();
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("climatesphere_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("climatesphere_theme", theme);
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const tabs = ["live", "forecast", "history", "vitals", "energy", "footprint", "sim"];

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
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const geo = await reverseGeocode(latitude, longitude);
          setCurrentLocation({
            name: geo.name,
            cityName: geo.cityName,
            country: geo.country,
            lat: latitude,
            lon: longitude
          });
        } catch (err) {
          console.warn("Geocoding failed for position:", err);
        }
      },
      (err) => {
        console.warn("Geolocation denied or failed:", err);
        alert("Could not access your location. Using default location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const handleUpdateWatchlist = (updated) => {
    setWatchlist(updated);
    saveWatchlist(updated);
  };

  const isCurrentPinned = isCityPinned(currentLocation, watchlist);

  const handleTogglePinCurrentLocation = () => {
    if (isCurrentPinned) {
      const updated = watchlist.filter(
        (c) => c.cityName?.toLowerCase() !== currentLocation?.cityName?.toLowerCase()
      );
      handleUpdateWatchlist(updated);
    } else {
      const newCity = {
        id: `loc-${Date.now()}`,
        name: currentLocation.name,
        cityName: currentLocation.cityName || currentLocation.name.split(",")[0],
        country: currentLocation.country || "",
        lat: currentLocation.lat,
        lon: currentLocation.lon
      };
      handleUpdateWatchlist([...watchlist, newCity]);
    }
  };

  return (
    <div className="orbital-viewport" data-theme={theme}>
      {/* Background Weather Particle Canvas */}
      <WeatherParticles
        weatherCode={weatherData?.current?.weatherCode || 0}
        isDay={weatherData?.current?.isDay ?? true}
      />

      {/* Living 100vw/100vh 3D Earth Globe / Map Canvas */}
      <InteractiveMap
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        weatherData={weatherData}
        theme={theme}
        isSpatialCockpit={true}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((prev) => (prev === "3d" ? "2d" : "3d"))}
      />

      {/* Floating Dynamic Island Header */}
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
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        watchlist={watchlist}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        isCurrentPinned={isCurrentPinned}
        onTogglePin={handleTogglePinCurrentLocation}
        onOpenVoiceBriefing={() => setIsVoiceBriefingOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Floating Left Spatial Dock */}
      <div className="hide-on-mobile">
        <SpatialDock
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsHudCollapsed(false);
          }}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode((prev) => (prev === "3d" ? "2d" : "3d"))}
        />
      </div>

      {/* Floating Right Telemetry Stack (Collapsible HUD) */}
      {isHudCollapsed && (
        <button
          className="hud-expand-trigger hide-on-mobile"
          onClick={() => setIsHudCollapsed(false)}
          title="Expand Live Telemetry HUD"
        >
          <Layers size={16} />
          <span>Telemetry HUD</span>
        </button>
      )}

      <aside
        className={`spatial-telemetry-stack ${isHudCollapsed ? "collapsed" : ""} ${
          isMobileDrawerOpen ? "mobile-drawer-open" : "mobile-drawer-closed"
        }`}
      >
        {/* Mobile Drawer Header with Drag Handle & Close */}
        <div className="mobile-drawer-header">
          <div
            className="mobile-drawer-handle"
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            title="Drag or tap to minimize"
          />
          <button
            className="mobile-drawer-close-btn"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label="Close telemetry panel"
          >
            <X size={15} />
          </button>
        </div>

        {/* Desktop Collapse HUD Button */}
        <button
          className="hud-collapse-btn hide-on-mobile"
          onClick={() => setIsHudCollapsed(true)}
          title="Collapse HUD to view full 3D Earth"
        >
          <EyeOff size={14} />
          <span>Hide HUD</span>
        </button>

        {/* Tab 1: Live Terminal */}
        {activeTab === "live" && (
          <>
            <WeatherDetailCard
              locationName={currentLocation.name}
              weatherData={weatherData}
              unit={unit}
              onOpenVoiceBriefing={() => setIsVoiceBriefingOpen(true)}
            />
            <AirQualityCard airQualityData={airQualityData} />
          </>
        )}

        {/* Tab 2: Forecast & Climate Trends */}
        {activeTab === "forecast" && (
          <>
            <ForecastSection weatherData={weatherData} unit={unit} />
            <HistoricalAnomalyChart
              locationName={currentLocation.name}
              weatherData={weatherData}
              unit={unit}
            />
          </>
        )}

        {/* Tab 3: Historical Climate Time Machine (1950 - 2026) */}
        {activeTab === "history" && (
          <HistoricalTimeMachine
            locationName={currentLocation.name}
            lat={currentLocation.lat}
            lon={currentLocation.lon}
            currentTemp={weatherData?.current?.temp}
            unit={unit}
          />
        )}

        {/* Tab 4: Earth's Vital Signs, Climate Radar & NASA Wildfire Sentinel */}
        {activeTab === "vitals" && (
          <>
            <ClimateVitals />
            <WildfireSatelliteCard
              currentLocation={currentLocation}
              weatherData={weatherData}
              onSelectLocation={handleSelectLocation}
            />
            <ExtremeEventsRadar />
          </>
        )}

        {/* Tab 5: Renewable Energy Yield Estimator (Solar & Wind) */}
        {activeTab === "energy" && (
          <RenewableEnergyEstimator
            locationName={currentLocation.name}
            lat={currentLocation.lat}
            lon={currentLocation.lon}
            weatherData={weatherData}
          />
        )}

        {/* Tab 6: Personal Carbon Footprint & Offset Calculator */}
        {activeTab === "footprint" && (
          <CarbonFootprintCalculator locationName={currentLocation.name} />
        )}

        {/* Tab 7: AI Climate Impact Simulator */}
        {activeTab === "sim" && (
          <ClimateImpactSimulator
            locationName={currentLocation.name}
            lat={currentLocation.lat}
            lon={currentLocation.lon}
            unit={unit}
          />
        )}
      </aside>

      {/* Floating Bottom Timeline Scrubber */}
      <div className="hide-on-mobile">
        <TimelineScrubber
          weatherData={weatherData}
          unit={unit}
        />
      </div>

      {/* Error Notification */}
      {error && (
        <div
          className="glass-card"
          style={{
            position: "fixed",
            bottom: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 130,
            padding: "0.65rem 1.2rem",
            background: "rgba(239, 68, 68, 0.25)",
            borderColor: "rgba(239, 68, 68, 0.5)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "#fca5a5",
            fontSize: "0.82rem",
            borderRadius: "var(--radius-pill)"
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 📱 Android Native Bottom Navigation Bar (Thumb-Accessible on Mobile) */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-item ${activeTab === "live" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("live");
            setIsMobileDrawerOpen(true);
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <Thermometer size={18} />
          </div>
          <span>Live</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === "forecast" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("forecast");
            setIsMobileDrawerOpen(true);
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <Compass size={18} />
          </div>
          <span>Forecast</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === "history" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("history");
            setIsMobileDrawerOpen(true);
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <History size={18} />
          </div>
          <span>History</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === "vitals" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("vitals");
            setIsMobileDrawerOpen(true);
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <TrendingUp size={18} />
          </div>
          <span>Vitals</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === "energy" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("energy");
            setIsMobileDrawerOpen(true);
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <Zap size={18} />
          </div>
          <span>Energy</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === "footprint" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("footprint");
            setIsMobileDrawerOpen(true);
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <Leaf size={18} />
          </div>
          <span>Carbon</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === "sim" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("sim");
            setIsMobileDrawerOpen(true);
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <Sliders size={18} />
          </div>
          <span>AI Sim</span>
        </button>
      </nav>

      {/* Dual City Comparison Modal */}
      {isComparisonOpen && (
        <ClimateComparisonModal
          locationA={currentLocation}
          weatherDataA={weatherData}
          airQualityDataA={airQualityData}
          unit={unit}
          onClose={() => setIsComparisonOpen(false)}
        />
      )}

      {/* Environmental Health Report Generator Modal */}
      {isReportOpen && (
        <ReportGeneratorModal
          locationName={currentLocation.name}
          weatherData={weatherData}
          airQualityData={airQualityData}
          unit={unit}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {/* Multi-City Watchlist & Pinboard Modal */}
      {isWatchlistOpen && (
        <WatchlistModal
          currentLocation={currentLocation}
          watchlist={watchlist}
          onUpdateWatchlist={handleUpdateWatchlist}
          onSelectLocation={handleSelectLocation}
          unit={unit}
          onClose={() => setIsWatchlistOpen(false)}
        />
      )}

      {/* AI Voice Climate Briefing Modal */}
      {isVoiceBriefingOpen && (
        <VoiceBriefingModal
          locationName={currentLocation.name}
          weatherData={weatherData}
          airQualityData={airQualityData}
          unit={unit}
          onClose={() => setIsVoiceBriefingOpen(false)}
        />
      )}

      {/* Raw Climate Data Exporter Modal (CSV / JSON) */}
      {isExportModalOpen && (
        <DataExportModal
          currentLocation={currentLocation}
          weatherData={weatherData}
          airQualityData={airQualityData}
          unit={unit}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* About ClimateSphere Modal */}
      {isAboutOpen && (
        <AboutModal onClose={() => setIsAboutOpen(false)} />
      )}
    </div>
  );
}
