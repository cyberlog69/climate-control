import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./components/Navbar";
import ClimateVitals from "./components/ClimateVitals";
import InteractiveMap from "./components/InteractiveMap";
import WeatherDetailCard from "./components/WeatherDetailCard";
import AirQualityCard from "./components/AirQualityCard";
import ForecastSection from "./components/ForecastSection";
import HistoricalAnomalyChart from "./components/HistoricalAnomalyChart";
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
import MaterialNavRail from "./components/MaterialNavRail";
import { useTouchSwipe } from "./hooks/useTouchSwipe";
import { useEscapeKey } from "./hooks/useEscapeKey";
import { fetchWeatherData, fetchAirQualityData, reverseGeocode, detectUserLocation } from "./services/weatherApi";
import { getStoredWatchlist, saveWatchlist, isCityPinned } from "./services/watchlistApi";
import { fetchWildfireHotspots, SAMPLE_WILDFIRE_HOTSPOTS } from "./services/wildfireSatelliteApi";
import { STORAGE_KEYS, getStoredLastLocation, readStorage, saveLastLocation, writeStorage } from "./services/storage";
import {
  LayoutDashboard,
  Globe,
  Globe2,
  Compass,
  History,
  Activity,
  Zap,
  Leaf,
  SlidersHorizontal,
  MoreHorizontal,
  AlertCircle,
  ChevronRight,
  X
} from "lucide-react";

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(
    () =>
      getStoredLastLocation() ?? {
        name: "Detecting Location...",
        cityName: "Detecting...",
        country: "",
        lat: null,
        lon: null
      }
  );

  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [unit, setUnit] = useState("C"); // 'C' | 'F'
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isNavSheetOpen, setIsNavSheetOpen] = useState(false);

  const [viewMode, setViewMode] = useState("3d");
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [wildfireData, setWildfireData] = useState({
    hotspots: SAMPLE_WILDFIRE_HOTSPOTS,
    source: "sample",
    fetchedAt: null
  });

  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme) || "dark");

  // Guards against out-of-order weather responses when the user switches cities quickly.
  const weatherRequestIdRef = useRef(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  // Live NASA EONET wildfire events, with the bundled sample set as offline fallback.
  useEffect(() => {
    const controller = new AbortController();
    fetchWildfireHotspots({ signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted && result.hotspots.length > 0) {
          setWildfireData(result);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.warn("Live wildfire feed unavailable, keeping sample dataset:", err);
        }
      });
    return () => controller.abort();
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const tabs = ["dashboard", "map", "forecast", "history", "vitals", "energy", "footprint", "sim"];

  // Mobile keeps four primary destinations plus a sheet for the rest, so every
  // tab in the desktop rail is reachable on a phone.
  const secondaryTabs = [
    { id: "history", label: "History", icon: History },
    { id: "energy", label: "Energy", icon: Zap },
    { id: "footprint", label: "Footprint", icon: Leaf },
    { id: "sim", label: "Simulator", icon: SlidersHorizontal }
  ];

  useEscapeKey(() => setIsNavSheetOpen(false), isNavSheetOpen);

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
    if (!location || !Number.isFinite(location.lat) || !Number.isFinite(location.lon)) {
      return;
    }
    const requestId = ++weatherRequestIdRef.current;
    if (showRefreshing) setIsRefreshing(true);
    setError(null);

    try {
      const [weather, aqi] = await Promise.all([
        fetchWeatherData(location.lat, location.lon),
        fetchAirQualityData(location.lat, location.lon)
      ]);

      if (requestId !== weatherRequestIdRef.current) return;
      setWeatherData(weather);
      setAirQualityData(aqi);
    } catch (err) {
      if (requestId !== weatherRequestIdRef.current) return;
      console.error("Failed to load location data:", err);
      setError("Unable to sync live weather feeds. Please try again.");
    } finally {
      if (requestId === weatherRequestIdRef.current) {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    if (currentLocation && currentLocation.lat != null && currentLocation.lon != null) {
      loadDataForLocation(currentLocation);
    }
  }, [currentLocation, loadDataForLocation]);

  // Automatically detect user's location on startup (GPS with fast IP fallback)
  useEffect(() => {
    let isMounted = true;
    detectUserLocation((fastLoc) => {
      if (isMounted && fastLoc && fastLoc.lat != null && fastLoc.lon != null) {
        setCurrentLocation((prev) => {
          // Only apply fast IP if we haven't already locked onto a precise location
          if (prev.lat == null || prev.name === "Detecting Location...") {
            saveLastLocation(fastLoc);
            return fastLoc;
          }
          return prev;
        });
      }
    }).then((loc) => {
      if (isMounted && loc && loc.lat != null && loc.lon != null) {
        setCurrentLocation(loc);
        saveLastLocation(loc);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectLocation = async (loc) => {
    let targetLoc = loc;
    if (!loc.cityName || loc.cityName === "Custom Coordinates") {
      const geo = await reverseGeocode(loc.lat, loc.lon);
      targetLoc = {
        name: geo.name,
        cityName: geo.cityName,
        country: geo.country,
        lat: loc.lat,
        lon: loc.lon
      };
    }
    setCurrentLocation(targetLoc);
    saveLastLocation(targetLoc);
  };

  const handleAutoLocate = async () => {
    setIsRefreshing(true);
    try {
      const detected = await detectUserLocation();
      if (detected && detected.lat != null && detected.lon != null) {
        setCurrentLocation(detected);
        saveLastLocation(detected);
      } else {
        setError("Could not automatically detect your location.");
      }
    } catch (err) {
      console.warn("Auto-locate failed:", err);
      setError("Could not access your location. Check the browser permission and try again.");
    } finally {
      setIsRefreshing(false);
    }
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
    <div className="m3-app-shell" data-theme={theme}>
      {/* Background Weather Particle Canvas */}
      <WeatherParticles
        weatherCode={weatherData?.current?.weatherCode || 0}
        isDay={weatherData?.current?.isDay ?? true}
      />

      {/* Google Material 3 Top App Bar */}
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

      {/* Material 3 Body: Left Navigation Rail & Main Viewport */}
      <div className="m3-shell-body">
        {/* Left Navigation Rail (Desktop & Tablet) */}
        <div className="hide-on-mobile">
          <MaterialNavRail
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenComparison={() => setIsComparisonOpen(true)}
            onOpenReport={() => setIsReportOpen(true)}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        </div>

        {/* Main Scrollable Viewport */}
        <main className="m3-main-viewport">
          {/* Tab 1: Dashboard Overview (Default) */}
          {activeTab === "dashboard" && (
            <div className="m3-dashboard-grid">
              {/* Hero Section: Global Climate Overview Card */}
              <div className="m3-card m3-hero-globe-card">
                <div className="m3-card-header">
                  <div className="m3-card-title-group">
                    <Globe size={18} className="m3-card-icon" />
                    <h2 className="m3-card-title">Global Climate Overview</h2>
                  </div>
                  <div className="m3-card-actions">
                    <button
                      className="m3-chip"
                      onClick={() => setViewMode((prev) => (prev === "3d" ? "2d" : "3d"))}
                      title={`Switch to ${viewMode === "3d" ? "2D Map" : "3D Earth Globe"}`}
                    >
                      {viewMode === "3d" ? <Globe size={14} /> : <Compass size={14} />}
                      <span>{viewMode === "3d" ? "3D Globe" : "2D Map"}</span>
                    </button>
                    <button
                      className="m3-chip"
                      onClick={() => setActiveTab("map")}
                      title="Expand to Full Map View"
                    >
                      <span>Expand</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="m3-globe-container">
                  <InteractiveMap
                    currentLocation={currentLocation}
                    onSelectLocation={handleSelectLocation}
                    weatherData={weatherData}
                    theme={theme}
                    viewMode={viewMode}
                    onToggleViewMode={() => setViewMode((prev) => (prev === "3d" ? "2d" : "3d"))}
                    isM3Embedded={true}
                    wildfireHotspots={wildfireData.hotspots}
                  />
                </div>
              </div>

              {/* Right Column: Weather Detail Card & Air Quality */}
              <div className="m3-dashboard-side-col">
                <WeatherDetailCard
                  locationName={currentLocation.name}
                  weatherData={weatherData}
                  unit={unit}
                  onOpenVoiceBriefing={() => setIsVoiceBriefingOpen(true)}
                />
                <AirQualityCard airQualityData={airQualityData} />
              </div>

              {/* Bottom Full Row: Forecast & Anomaly Section */}
              <div className="m3-dashboard-bottom-row">
                <ForecastSection weatherData={weatherData} unit={unit} />
              </div>
            </div>
          )}

          {/* Tab 2: Full-Size Interactive Globe & Map View */}
          {activeTab === "map" && (
            <div className="m3-tab-content-container">
              <div className="m3-card" style={{ padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Globe2 size={20} style={{ color: "var(--md-sys-color-primary)" }} />
                    <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>Interactive Planetary Map & Thermal Hotspots</h2>
                  </div>
                  <button
                    className="m3-chip active"
                    onClick={() => setViewMode((prev) => (prev === "3d" ? "2d" : "3d"))}
                  >
                    <span>Switch to {viewMode === "3d" ? "2D Map" : "3D Globe"}</span>
                  </button>
                </div>
                <div style={{ height: "clamp(340px, calc(100dvh - 170px), 850px)", minHeight: "300px", borderRadius: "16px", overflow: "hidden" }}>
                  <InteractiveMap
                    currentLocation={currentLocation}
                    onSelectLocation={handleSelectLocation}
                    weatherData={weatherData}
                    theme={theme}
                    viewMode={viewMode}
                    onToggleViewMode={() => setViewMode((prev) => (prev === "3d" ? "2d" : "3d"))}
                    isM3Embedded={true}
                    wildfireHotspots={wildfireData.hotspots}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Forecast & Trends */}
          {activeTab === "forecast" && (
            <div className="m3-tab-content-container">
              <ForecastSection weatherData={weatherData} unit={unit} />
              <HistoricalAnomalyChart />
            </div>
          )}

          {/* Tab 4: Historical Climate Time Machine (1950 - 2026) */}
          {activeTab === "history" && (
            <div className="m3-tab-content-container">
              <HistoricalTimeMachine
                locationName={currentLocation.name}
                lat={currentLocation.lat}
                lon={currentLocation.lon}
                currentTemp={weatherData?.current?.temp}
                unit={unit}
              />
            </div>
          )}

          {/* Tab 5: Earth's Vital Signs & NASA Wildfire Sentinel */}
          {activeTab === "vitals" && (
            <div className="m3-tab-content-container">
              <ClimateVitals />
              <WildfireSatelliteCard
                currentLocation={currentLocation}
                weatherData={weatherData}
                onSelectLocation={handleSelectLocation}
                hotspots={wildfireData.hotspots}
                source={wildfireData.source}
                fetchedAt={wildfireData.fetchedAt}
              />
            </div>
          )}

          {/* Tab 6: Clean Energy Yield Estimator */}
          {activeTab === "energy" && (
            <div className="m3-tab-content-container">
              <RenewableEnergyEstimator
                locationName={currentLocation.name}
                lat={currentLocation.lat}
                lon={currentLocation.lon}
                weatherData={weatherData}
              />
            </div>
          )}

          {/* Tab 7: Personal Carbon Footprint Calculator */}
          {activeTab === "footprint" && (
            <div className="m3-tab-content-container">
              <CarbonFootprintCalculator locationName={currentLocation.name} />
            </div>
          )}

          {/* Tab 8: Climate Impact Simulator */}
          {activeTab === "sim" && (
            <div className="m3-tab-content-container">
              <ClimateImpactSimulator
                locationName={currentLocation.name}
                lat={currentLocation.lat}
                lon={currentLocation.lon}
                unit={unit}
              />
            </div>
          )}
        </main>
      </div>

      {/* Error Notification */}
      {error && (
        <div
          role="alert"
          className="m3-card"
          style={{
            position: "fixed",
            bottom: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 130,
            padding: "0.65rem 1rem",
            background: "var(--sk-surface-elevated)",
            borderColor: "var(--accent-red)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "var(--text-main)",
            fontSize: "13px",
            borderRadius: "var(--radius-md)",
            maxWidth: "calc(100vw - 2rem)"
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Material 3 Bottom Navigation Bar (Mobile) */}
      <nav className="m3-bottom-nav" aria-label="Sections">
        <button
          className={`m3-bottom-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
          aria-current={activeTab === "dashboard" ? "page" : undefined}
        >
          <div className="m3-bottom-item-pill">
            <LayoutDashboard size={18} />
          </div>
          <span className="m3-bottom-label">Dashboard</span>
        </button>

        <button
          className={`m3-bottom-item ${activeTab === "map" ? "active" : ""}`}
          onClick={() => setActiveTab("map")}
          aria-current={activeTab === "map" ? "page" : undefined}
        >
          <div className="m3-bottom-item-pill">
            <Globe2 size={18} />
          </div>
          <span className="m3-bottom-label">Map</span>
        </button>

        <button
          className={`m3-bottom-item ${activeTab === "forecast" ? "active" : ""}`}
          onClick={() => setActiveTab("forecast")}
          aria-current={activeTab === "forecast" ? "page" : undefined}
        >
          <div className="m3-bottom-item-pill">
            <Compass size={18} />
          </div>
          <span className="m3-bottom-label">Forecast</span>
        </button>

        <button
          className={`m3-bottom-item ${activeTab === "vitals" ? "active" : ""}`}
          onClick={() => setActiveTab("vitals")}
          aria-current={activeTab === "vitals" ? "page" : undefined}
        >
          <div className="m3-bottom-item-pill">
            <Activity size={18} />
          </div>
          <span className="m3-bottom-label">Vitals</span>
        </button>

        <button
          className={`m3-bottom-item ${secondaryTabs.some((t) => t.id === activeTab) ? "active" : ""}`}
          onClick={() => setIsNavSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isNavSheetOpen}
        >
          <div className="m3-bottom-item-pill">
            <MoreHorizontal size={18} />
          </div>
          <span className="m3-bottom-label">More</span>
        </button>
      </nav>

      {isNavSheetOpen && (
        <div className="m3-nav-sheet-scrim" onClick={() => setIsNavSheetOpen(false)}>
          <div
            className="m3-nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="More sections"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="m3-nav-sheet-head">
              <span>More sections</span>
              <button
                className="m3-icon-btn"
                onClick={() => setIsNavSheetOpen(false)}
                aria-label="Close sections"
              >
                <X size={18} />
              </button>
            </div>
            <div className="m3-nav-sheet-grid">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`m3-nav-sheet-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsNavSheetOpen(false);
                    }}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}


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
          wildfireHotspots={wildfireData.hotspots}
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
