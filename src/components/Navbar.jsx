import React, { useState, useEffect, useRef } from "react";
import { Globe, Search, Navigation, RefreshCw } from "lucide-react";
import { searchLocations } from "../services/weatherApi";
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
  airQualityData
}) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
                  <div style={{ fontWeight: 600, color: "#fff" }}>{item.cityName}</div>
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

        <div
          className="nav-clock-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(15, 23, 42, 0.7)",
            padding: "0.45rem 0.85rem",
            borderRadius: "20px",
            border: "1px solid var(--border-light)",
            fontSize: "0.8rem",
            color: "var(--text-muted)"
          }}
        >
          <span className="pulse-dot"></span>
          <span style={{ fontFamily: "monospace", color: "#e2e8f0" }}>{utcTime || "UTC Sync"}</span>
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
