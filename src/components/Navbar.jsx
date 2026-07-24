import React, { useState, useEffect, useRef } from "react";
import { Globe, Search, Navigation, RefreshCw, Sun, Moon, Volume2, VolumeX, GitCompare, FileText } from "lucide-react";
import { searchLocations } from "../services/weatherApi";
import { audioSynth } from "../services/audioSynth";
import ClimateAlertSystem from "./ClimateAlertSystem";

export default function Navbar({
  currentLocation,
  onSelectLocation,
  unit,
  onToggleUnit,
  onAutoLocate,
  isRefreshing,
  onRefresh,
  weatherData,
  airQualityData,
  theme,
  onToggleTheme,
  onOpenComparison,
  onOpenReport
}) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [utcTime, setUtcTime] = useState("");

  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // UTC Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (val.trim().length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchLocations(val);
        setSearchResults(results);
        setIsSearching(false);
        setShowDropdown(true);
      }, 300);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setQuery("");
    setShowDropdown(false);
  };

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      audioSynth.stop();
      setIsAudioPlaying(false);
    } else {
      const code = weatherData?.current?.weatherCode || 0;
      audioSynth.playForWeatherCode(code);
      setIsAudioPlaying(true);
    }
  };

  return (
    <header className="navbar glass-card">
      {/* Brand Header */}
      <div className="brand-logo">
        <div className="brand-icon-wrapper">
          <Globe size={26} />
        </div>
        <div>
          <h1 className="brand-title">ClimateSphere</h1>
          <div className="brand-subtitle">Global Realtime Sentinel</div>
        </div>
      </div>

      {/* Global City Search */}
      <div className="search-container" ref={dropdownRef}>
        <div className="search-input-wrapper">
          <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search any global city, region, or coordinate..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
          />
          {isSearching && <RefreshCw size={16} className="animate-spin" style={{ color: "var(--accent-cyan)" }} />}
        </div>

        {showDropdown && searchResults.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((item) => (
              <div key={item.id} className="search-result-item" onClick={() => handleSelect(item)}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{item.cityName}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {item.admin ? `${item.admin}, ` : ""}
                    {item.country}
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontFamily: "monospace" }}>
                  {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UTC Clock & Quick Actions */}
      <div className="nav-actions">
        {/* Live Climate Alert System Pill */}
        <ClimateAlertSystem
          weatherData={weatherData}
          airQualityData={airQualityData}
          locationName={currentLocation.name}
        />

        {/* Ambient Sound Player */}
        <button
          className="locate-btn"
          onClick={handleToggleAudio}
          title={isAudioPlaying ? "Mute Ambient Weather Audio" : "Play Ambient Weather Audio"}
          style={{ padding: "0.45rem 0.75rem" }}
        >
          {isAudioPlaying ? <Volume2 size={16} style={{ color: "var(--accent-cyan)" }} /> : <VolumeX size={16} />}
        </button>

        {/* Dual City Comparison */}
        <button
          className="locate-btn"
          onClick={onOpenComparison}
          title="Compare Two Cities Side-by-Side"
          style={{ padding: "0.45rem 0.75rem" }}
        >
          <GitCompare size={16} style={{ color: "var(--accent-cyan)" }} />
          <span className="hide-on-mobile">Compare</span>
        </button>

        {/* Diagnostic Report Export */}
        <button
          className="locate-btn"
          onClick={onOpenReport}
          title="Generate Diagnostic Health Report"
          style={{ padding: "0.45rem 0.75rem" }}
        >
          <FileText size={16} style={{ color: "var(--accent-cyan)" }} />
          <span className="hide-on-mobile">Report</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun size={16} style={{ color: "#f59e0b" }} /> : <Moon size={16} style={{ color: "#38bdf8" }} />}
          <span className="hide-on-mobile">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <div
          className="nav-clock-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--bg-card)",
            padding: "0.45rem 0.85rem",
            borderRadius: "20px",
            border: "1px solid var(--border-light)",
            fontSize: "0.8rem",
            color: "var(--text-muted)"
          }}
        >
          <span className="pulse-dot"></span>
          <span style={{ fontFamily: "monospace", color: "var(--text-main)" }}>{utcTime || "UTC Sync"}</span>
        </div>

        <button className="locate-btn" onClick={onAutoLocate} title="Detect My Geolocation">
          <Navigation size={15} />
          <span className="hide-on-mobile">My Location</span>
        </button>

        <button
          className={`unit-btn ${unit === "C" ? "active" : ""}`}
          onClick={onToggleUnit}
          title="Switch Temperature Unit"
        >
          °C / °F
        </button>

        <button
          className="locate-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{ padding: "0.45rem 0.75rem" }}
          title="Refresh Live Feeds"
        >
          <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>
    </header>
  );
}
