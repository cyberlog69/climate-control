import React, { useState, useEffect, useRef } from "react";
import {
  Globe,
  Search,
  Navigation,
  RefreshCw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  GitCompare,
  FileText,
  Bookmark,
  BookmarkCheck,
  Mic,
  Download,
  MoreVertical,
  X,
  Sparkles,
  Sliders
} from "lucide-react";
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
  onOpenReport,
  watchlist = [],
  onOpenWatchlist,
  isCurrentPinned = false,
  onTogglePin,
  onOpenVoiceBriefing,
  onOpenExport
}) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [utcTime, setUtcTime] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

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
    setIsMobileSearchOpen(false);
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
    <>
      <header className="navbar glass-card">
        {/* Brand Header */}
        <div className="brand-logo">
          <div className="brand-icon-wrapper">
            <Globe size={22} />
          </div>
          <div>
            <h1 className="brand-title">ClimateSphere</h1>
            <div className="brand-subtitle">Global Realtime Sentinel</div>
          </div>
        </div>

        {/* Global City Search (Desktop) */}
        <div className="search-container hide-on-mobile" ref={dropdownRef}>
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

        {/* Desktop Quick Actions */}
        <div className="nav-actions hide-on-mobile">
          {/* Live Climate Alert System Pill */}
          <ClimateAlertSystem
            weatherData={weatherData}
            airQualityData={airQualityData}
            locationName={currentLocation.name}
          />

          {/* AI Voice Briefing Button */}
          <button
            className="locate-btn"
            onClick={onOpenVoiceBriefing}
            title="Play AI Voice Climate Briefing"
          >
            <Mic size={15} style={{ color: "var(--accent-cyan)" }} />
            <span>Voice Briefing</span>
          </button>

          {/* Ambient Sound Player */}
          <button
            className="locate-btn"
            onClick={handleToggleAudio}
            title={isAudioPlaying ? "Mute Ambient Weather Audio" : "Play Ambient Weather Audio"}
          >
            {isAudioPlaying ? <Volume2 size={15} style={{ color: "var(--accent-cyan)" }} /> : <VolumeX size={15} />}
          </button>

          {/* Multi-City Watchlist Button */}
          <button
            className="locate-btn"
            onClick={onOpenWatchlist}
            title="Open Multi-City Watchlist"
          >
            <Bookmark size={15} style={{ color: "var(--accent-cyan)" }} />
            <span>Watchlist</span>
            {watchlist.length > 0 && (
              <span
                style={{
                  background: "var(--accent-cyan)",
                  color: "#000",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "0.1rem 0.4rem",
                  borderRadius: "10px"
                }}
              >
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Pin Active City */}
          <button
            className="locate-btn"
            onClick={onTogglePin}
            title={isCurrentPinned ? "Unpin Active City" : "Pin Active City"}
            style={{
              color: isCurrentPinned ? "var(--accent-green)" : "inherit",
              borderColor: isCurrentPinned ? "var(--accent-green)" : "var(--border-light)"
            }}
          >
            {isCurrentPinned ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>

          {/* Dual City Comparison */}
          <button className="locate-btn" onClick={onOpenComparison} title="Compare Cities">
            <GitCompare size={15} style={{ color: "var(--accent-cyan)" }} />
            <span>Compare</span>
          </button>

          {/* Report Generator */}
          <button className="locate-btn" onClick={onOpenReport} title="Diagnostic Report">
            <FileText size={15} style={{ color: "var(--accent-cyan)" }} />
            <span>Report</span>
          </button>

          {/* CSV/JSON Exporter */}
          <button className="locate-btn" onClick={onOpenExport} title="Export Raw Data">
            <Download size={15} style={{ color: "var(--accent-cyan)" }} />
            <span>Export</span>
          </button>

          {/* Theme Toggle */}
          <button className="theme-toggle-btn" onClick={onToggleTheme}>
            {theme === "dark" ? <Sun size={15} style={{ color: "#f59e0b" }} /> : <Moon size={15} style={{ color: "#38bdf8" }} />}
          </button>

          {/* UTC Clock Pill */}
          <div
            className="nav-clock-pill"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              background: "var(--bg-inner)",
              padding: "0.4rem 0.75rem",
              borderRadius: "18px",
              border: "1px solid var(--border-light)",
              fontSize: "0.75rem"
            }}
          >
            <span className="pulse-dot"></span>
            <span style={{ fontFamily: "monospace", color: "var(--text-main)" }}>{utcTime || "UTC Sync"}</span>
          </div>

          <button className="locate-btn" onClick={onAutoLocate} title="My Geolocation">
            <Navigation size={14} />
          </button>

          <button className={`unit-btn ${unit === "C" ? "active" : ""}`} onClick={onToggleUnit}>
            °C/°F
          </button>

          <button className="locate-btn" onClick={onRefresh} disabled={isRefreshing} title="Refresh Feeds">
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Mobile Header Actions (Android Compact) */}
        <div style={{ display: "none" }} className="mobile-actions-wrapper">
          {/* Style rule to show only on mobile */}
          <style>{`
            @media (max-width: 900px) {
              .mobile-actions-wrapper {
                display: flex !important;
                align-items: center;
                gap: 0.35rem;
              }
            }
          `}</style>

          {/* Search Trigger Button */}
          <button
            onClick={() => {
              setIsMobileSearchOpen(true);
              setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
            }}
            className="locate-btn"
            style={{ padding: "0.4rem 0.6rem" }}
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          {/* Quick Auto Locate */}
          <button
            onClick={onAutoLocate}
            className="locate-btn"
            style={{ padding: "0.4rem 0.6rem" }}
            aria-label="Locate"
          >
            <Navigation size={16} />
          </button>

          {/* Android Overflow Menu Trigger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="locate-btn"
            style={{
              padding: "0.4rem 0.65rem",
              background: isMobileMenuOpen ? "var(--accent-cyan)" : "var(--bg-inner)",
              color: isMobileMenuOpen ? "#000" : "var(--text-main)",
              position: "relative"
            }}
            aria-label="Menu"
          >
            <MoreVertical size={18} />
            {watchlist.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--accent-cyan)",
                  color: "#000",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--bg-card)"
                }}
              >
                {watchlist.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Expanding Fullscreen Search Overlay */}
      {isMobileSearchOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(3, 7, 18, 0.95)",
            backdropFilter: "blur(24px)",
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            paddingTop: "max(1rem, env(safe-area-inset-top))"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
            <div className="search-input-wrapper" style={{ flex: 1 }}>
              <Search size={18} style={{ color: "var(--text-muted)" }} />
              <input
                ref={mobileSearchInputRef}
                type="text"
                className="search-input"
                placeholder="Search global city, coordinates..."
                value={query}
                onChange={handleInputChange}
              />
              {isSearching && <RefreshCw size={16} className="animate-spin" style={{ color: "var(--accent-cyan)" }} />}
            </div>
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setQuery("");
              }}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--bg-inner)",
                border: "1px solid var(--border-light)",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="search-result-item"
                style={{ borderRadius: "12px", marginBottom: "0.35rem", background: "var(--bg-inner)" }}
                onClick={() => handleSelect(item)}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{item.cityName}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
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
        </div>
      )}

      {/* Mobile Android Quick Actions Bottom Sheet */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(3, 7, 18, 0.7)",
            backdropFilter: "blur(12px)",
            zIndex: 1200
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="mobile-quick-actions-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-handle" />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Sparkles size={18} style={{ color: "var(--accent-cyan)" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>ClimateSphere Actions</h3>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-action-grid">
              {/* Voice Briefing */}
              <button
                className="mobile-action-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenVoiceBriefing();
                }}
              >
                <Mic size={18} style={{ color: "var(--accent-cyan)" }} />
                <span>AI Voice Briefing</span>
              </button>

              {/* Watchlist */}
              <button
                className="mobile-action-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenWatchlist();
                }}
              >
                <Bookmark size={18} style={{ color: "var(--accent-cyan)" }} />
                <span>Watchlist ({watchlist.length})</span>
              </button>

              {/* Pin Current City */}
              <button
                className="mobile-action-btn"
                onClick={() => {
                  onTogglePin();
                }}
                style={{ color: isCurrentPinned ? "var(--accent-green)" : "inherit" }}
              >
                {isCurrentPinned ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                <span>{isCurrentPinned ? "City Pinned" : "Pin This City"}</span>
              </button>

              {/* Ambient Audio */}
              <button className="mobile-action-btn" onClick={handleToggleAudio}>
                {isAudioPlaying ? <Volume2 size={18} style={{ color: "var(--accent-cyan)" }} /> : <VolumeX size={18} />}
                <span>{isAudioPlaying ? "Mute Audio" : "Play Sound"}</span>
              </button>

              {/* Compare */}
              <button
                className="mobile-action-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenComparison();
                }}
              >
                <GitCompare size={18} style={{ color: "var(--accent-cyan)" }} />
                <span>Dual Compare</span>
              </button>

              {/* PDF Report */}
              <button
                className="mobile-action-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenReport();
                }}
              >
                <FileText size={18} style={{ color: "var(--accent-cyan)" }} />
                <span>Health Report</span>
              </button>

              {/* CSV Exporter */}
              <button
                className="mobile-action-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenExport();
                }}
              >
                <Download size={18} style={{ color: "var(--accent-cyan)" }} />
                <span>Data Exporter</span>
              </button>

              {/* Theme Toggle */}
              <button className="mobile-action-btn" onClick={onToggleTheme}>
                {theme === "dark" ? <Sun size={18} style={{ color: "#f59e0b" }} /> : <Moon size={18} style={{ color: "#38bdf8" }} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>

              {/* Unit Switcher */}
              <button className="mobile-action-btn" onClick={onToggleUnit}>
                <Sliders size={18} style={{ color: "var(--accent-cyan)" }} />
                <span>Unit: °{unit}</span>
              </button>

              {/* Refresh */}
              <button className="mobile-action-btn" onClick={onRefresh} disabled={isRefreshing}>
                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                <span>Refresh Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
