import React, { useState, useEffect } from "react";
import {
  fetchWatchlistSummaries,
  isCityPinned
} from "../services/watchlistApi";
import { searchLocations } from "../services/weatherApi";
import {
  Bookmark,
  BookmarkCheck,
  X,
  Plus,
  Trash2,
  Navigation,
  Wind,
  Droplets,
  Search,
  RefreshCw,
  MapPin,
  ExternalLink
} from "lucide-react";

export default function WatchlistModal({
  currentLocation,
  watchlist,
  onUpdateWatchlist,
  onSelectLocation,
  unit = "C",
  onClose
}) {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch summaries for all pinned locations
  const loadSummaries = async () => {
    setIsLoading(true);
    const data = await fetchWatchlistSummaries(watchlist);
    setSummaries(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSummaries();
  }, [watchlist]);

  const isCurrentCityPinned = isCityPinned(currentLocation, watchlist);

  const handleToggleCurrentPin = () => {
    if (isCurrentCityPinned) {
      const updated = watchlist.filter(
        (c) => c.cityName?.toLowerCase() !== currentLocation?.cityName?.toLowerCase()
      );
      onUpdateWatchlist(updated);
    } else {
      const newCity = {
        id: `loc-${Date.now()}`,
        name: currentLocation.name,
        cityName: currentLocation.cityName || currentLocation.name.split(",")[0],
        country: currentLocation.country || "",
        lat: currentLocation.lat,
        lon: currentLocation.lon
      };
      onUpdateWatchlist([...watchlist, newCity]);
    }
  };

  const handleUnpinCity = (e, cityId) => {
    e.stopPropagation();
    const updated = watchlist.filter((c) => c.id !== cityId);
    onUpdateWatchlist(updated);
  };

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      const results = await searchLocations(val);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handlePinSearchResult = (res) => {
    if (!isCityPinned(res, watchlist)) {
      const newCity = {
        id: `loc-${Date.now()}`,
        name: res.name,
        cityName: res.cityName,
        country: res.country,
        lat: res.lat,
        lon: res.lon
      };
      onUpdateWatchlist([...watchlist, newCity]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const displayTemp = (tempC) => {
    if (tempC == null || tempC === "--") return "--";
    if (unit === "F") return ((parseFloat(tempC) * 9) / 5 + 32).toFixed(1);
    return parseFloat(tempC).toFixed(1);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(3, 7, 18, 0.78)",
        backdropFilter: "blur(12px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="m3-card"
        style={{
          width: "100%",
          maxWidth: "840px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          border: "var(--sk-bezel-border)",
          boxShadow: "var(--sk-shadow-card)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.1rem 1.4rem",
            borderBottom: "var(--sk-bezel-border)",
            background: "var(--sk-surface-bar)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.6rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Bookmark size={22} style={{ color: "var(--accent-cyan)" }} />
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                Multi-City Watchlist & Pinboard
              </h3>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                {watchlist.length} pinned sentinels monitored simultaneously
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Quick Pin / Unpin Active Location */}
            <button
              onClick={handleToggleCurrentPin}
              className={`m3-chip ${isCurrentCityPinned ? "active" : ""}`}
              style={{ padding: "0.42rem 0.85rem" }}
            >
              {isCurrentCityPinned ? <BookmarkCheck size={16} /> : <Plus size={16} />}
              <span>{isCurrentCityPinned ? "Pinned: " + currentLocation.cityName : "Pin " + currentLocation.cityName}</span>
            </button>

            <button
              onClick={onClose}
              className="m3-icon-btn"
              style={{ width: "36px", height: "36px" }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* In-Modal Search to Pin */}
        <div style={{ padding: "0.85rem 1.4rem", borderBottom: "var(--sk-bezel-border)", position: "relative", background: "var(--bg-inner)" }}>
          <div
            className="m3-search-bar"
            style={{
              maxWidth: "100%",
              height: "44px"
            }}
          >
            <Search size={16} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search and pin new global cities..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="m3-search-input"
            />
            {isSearching && <RefreshCw size={14} className="animate-spin" style={{ color: "var(--accent-cyan)" }} />}
          </div>

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div
              className="m3-search-dropdown"
              style={{
                left: "1.4rem",
                right: "1.4rem"
              }}
            >
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handlePinSearchResult(res)}
                  style={{
                    padding: "0.65rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    borderBottom: "var(--sk-bezel-border)"
                  }}
                  className="search-result-item"
                >
                  <div>
                    <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.85rem" }}>{res.name}</span>
                  </div>
                  <button
                    className="m3-chip active"
                    style={{
                      padding: "0.25rem 0.6rem",
                      fontSize: "0.72rem",
                      gap: "0.25rem"
                    }}
                  >
                    <Plus size={12} />
                    <span>Pin</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pinned Cities Grid */}
        <div
          style={{
            padding: "1.2rem 1.4rem",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "0.85rem"
          }}
        >
          {isLoading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2.5rem 0", color: "var(--text-muted)" }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 0.6rem auto", color: "var(--accent-cyan)" }} />
              <div>Synchronizing live telemetry across pinned cities...</div>
            </div>
          ) : summaries.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2.5rem 0", color: "var(--text-muted)" }}>
              <Bookmark size={32} style={{ margin: "0 auto 0.6rem auto", color: "var(--text-dim)" }} />
              <h4>No Pinned Cities in Watchlist</h4>
              <p style={{ fontSize: "0.82rem", marginTop: "0.3rem" }}>
                Use the search bar above to bookmark your favorite global cities.
              </p>
            </div>
          ) : (
            summaries.map((city) => {
              const isActive = currentLocation?.cityName?.toLowerCase() === city.cityName?.toLowerCase();
              return (
                <div
                  key={city.id}
                  onClick={() => {
                    onSelectLocation(city);
                    onClose();
                  }}
                  style={{
                    background: isActive ? "var(--sk-surface-elevated)" : "var(--sk-surface-btn)",
                    border: isActive ? "1px solid var(--accent-cyan)" : "var(--sk-bezel-border)",
                    boxShadow: isActive ? "0 4px 16px rgba(2, 132, 199, 0.3), var(--sk-shadow-btn)" : "var(--sk-shadow-btn)",
                    borderRadius: "18px",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.18s cubic-bezier(0.2, 0, 0, 1)"
                  }}
                  className="glass-card-interactive"
                >
                  {/* Top Bar: City Name & Unpin button */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.4rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <MapPin size={15} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
                        <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>
                          {city.cityName}
                        </span>
                        {isActive && (
                          <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>
                            Active
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginLeft: "1.25rem" }}>
                        {city.country}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleUnpinCity(e, city.id)}
                      className="m3-icon-btn"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px"
                      }}
                      title="Unpin City"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Temp & AQI Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text-main)", fontFamily: "var(--font-heading)" }}>
                        {displayTemp(city.temp)}°{unit}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", gap: "0.5rem" }}>
                        <span>💨 {city.windSpeed} km/h</span>
                        <span>💧 {city.humidity}%</span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginBottom: "0.2rem" }}>Air Quality</div>
                      <span
                        className="badge"
                        style={{
                          background: `${city.aqiColor}22`,
                          color: city.aqiColor,
                          border: `1px solid ${city.aqiColor}44`,
                          fontSize: "0.72rem"
                        }}
                      >
                        AQI {city.aqi} • {city.aqiLevel}
                      </span>
                    </div>
                  </div>

                  {/* Quick Switch Action */}
                  <div
                    style={{
                      borderTop: "var(--sk-bezel-border)",
                      paddingTop: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.72rem",
                      color: "var(--accent-cyan)",
                      fontWeight: 600
                    }}
                  >
                    <span>Fly to on 3D Globe</span>
                    <ExternalLink size={12} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
