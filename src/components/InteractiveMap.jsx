import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { CLIMATE_HOTSPOTS } from "../services/climateData";
import { GLOBAL_WILDFIRE_HOTSPOTS } from "../services/wildfireSatelliteApi";
import { MapPin, Layers, Flame, Wind, Cloud, Globe2, Map as MapIcon, Radio } from "lucide-react";
import EarthGlobe3D from "./EarthGlobe3D";

// Security: sanitize SVG parameters to prevent XSS via crafted map data
const SAFE_COLOR_RE = /^[#a-zA-Z0-9(),%. ]+$/;
function sanitizeSvgParam(value, fallback) {
  if (typeof value !== "string") return fallback;
  // Strip any HTML tags or script-injectable characters
  const stripped = value.replace(/<[^>]*>/g, "").replace(/["'`\\]/g, "");
  if (!SAFE_COLOR_RE.test(stripped)) return fallback;
  return stripped;
}

// Custom Leaflet Icons using SVG strings
const createCustomMarkerIcon = (color, text = "") => {
  const safeColor = sanitizeSvgParam(color, "#06b6d4");
  // Only allow plain emoji or short alphanumeric text (no HTML)
  const safeText = typeof text === "string"
    ? text.replace(/<[^>]*>/g, "").replace(/["'<>&`]/g, "").slice(0, 4)
    : "";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="${safeColor}" flood-opacity="0.8"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z" fill="${safeColor}" filter="url(#glow)"/>
      <circle cx="16" cy="15" r="7" fill="#0f172a"/>
      ${
        safeText
          ? `<text x="16" y="19" font-size="10" font-weight="bold" fill="${safeColor}" text-anchor="middle" font-family="sans-serif">${safeText}</text>`
          : `<circle cx="16" cy="15" r="3.5" fill="${safeColor}"/>`
      }
    </svg>
  `;
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: svg,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -36]
  });
};

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 6, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    }
  });
  return null;
}

// Detect WebGL support before attempting to render Three.js globe
// On older/low-end Android WebViews, WebGL context creation fails silently and crashes the app
function detectWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch (e) {
    return false;
  }
}

const webGLSupported = detectWebGLSupport();

export default function InteractiveMap({
  currentLocation,
  onSelectLocation,
  weatherData,
  theme = "dark"
}) {
  // Default to 2D map when WebGL is not available (common on older/low-end Android WebViews)
  const [viewMode, setViewMode] = useState(webGLSupported ? "3d" : "2d");
  const [activeLayer, setActiveLayer] = useState("temp");
  const [mapCenter, setMapCenter] = useState([
    currentLocation?.lat || 35.6762,
    currentLocation?.lon || 139.6503
  ]);

  useEffect(() => {
    if (currentLocation?.lat && currentLocation?.lon) {
      setMapCenter([currentLocation.lat, currentLocation.lon]);
    }
  }, [currentLocation]);

  const handleHotspotClick = (hotspot) => {
    setMapCenter([hotspot.lat, hotspot.lon]);
    onSelectLocation({
      name: hotspot.name,
      cityName: hotspot.name.split(",")[0],
      lat: hotspot.lat,
      lon: hotspot.lon
    });
  };

  const handleMapClick = (lat, lon) => {
    onSelectLocation({
      name: `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°`,
      cityName: "Custom Location",
      lat: lat,
      lon: lon
    });
  };

  const layers = [
    { id: "temp", label: "Thermal Map", icon: Flame, color: "var(--accent-amber)" },
    { id: "wildfires", label: "Wildfires (NASA)", icon: Flame, color: "var(--accent-red)" },
    { id: "aqi", label: "Air Quality", icon: Wind, color: "var(--accent-cyan)" },
    { id: "clouds", label: "Cloud Cover", icon: Cloud, color: "#38bdf8" }
  ];

  const baseTileUrl =
    theme === "light"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";

  const referenceTileUrl =
    theme === "light"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";

  return (
    <div className="glass-card map-globe-mobile-wrapper" style={{ padding: "1.1rem", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header & Controls Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
          gap: "0.6rem"
        }}
      >
        <div className="section-title" style={{ margin: 0 }}>
          <MapPin size={20} />
          <span>{viewMode === "3d" ? "3D Planetary WebGL Globe" : "Interactive Global Climate Map"}</span>
        </div>

        {/* View Mode Toggle (2D Flat Map vs 3D Globe) & Layer Switches */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {/* 2D / 3D Toggle Pill */}
          <div
            style={{
              display: "flex",
              background: "var(--bg-inner)",
              padding: "0.2rem",
              borderRadius: "20px",
              border: "1px solid var(--border-light)"
            }}
          >
            <button
              onClick={() => setViewMode("3d")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "16px",
                border: "none",
                background: viewMode === "3d" ? "var(--accent-cyan)" : "transparent",
                color: viewMode === "3d" ? "#000" : "var(--text-muted)",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              title="3D WebGL Earth Globe View"
            >
              <Globe2 size={14} />
              <span>3D Globe</span>
            </button>

            <button
              onClick={() => setViewMode("2d")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "16px",
                border: "none",
                background: viewMode === "2d" ? "var(--accent-cyan)" : "transparent",
                color: viewMode === "2d" ? "#000" : "var(--text-muted)",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              title="2D Leaflet Flat Map View"
            >
              <MapIcon size={14} />
              <span>2D Map</span>
            </button>
          </div>

          {/* 2D Layer Switches (Only in 2D Map mode) */}
          {viewMode === "2d" && (
            <div style={{ display: "flex", gap: "0.35rem" }}>
              {layers.map((l) => {
                const Icon = l.icon;
                const isActive = activeLayer === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(l.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.4rem 0.7rem",
                      borderRadius: "20px",
                      border: isActive ? `1px solid ${l.color}` : "1px solid var(--border-light)",
                      background: isActive ? `${l.color}22` : "var(--bg-card)",
                      color: isActive ? "var(--text-main)" : "var(--text-muted)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? l.color : "inherit" }} />
                    <span>{l.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preset Climate Hotspots Bar */}
      <div
        style={{
          display: "flex",
          gap: "0.45rem",
          overflowX: "auto",
          paddingBottom: "0.6rem",
          marginBottom: "0.6rem"
        }}
      >
        {CLIMATE_HOTSPOTS.map((h) => (
          <button
            key={h.id}
            onClick={() => handleHotspotClick(h)}
            style={{
              whiteSpace: "nowrap",
              padding: "0.35rem 0.7rem",
              borderRadius: "14px",
              background:
                currentLocation?.cityName?.toLowerCase() === h.name.split(",")[0].toLowerCase()
                  ? "rgba(6, 182, 212, 0.25)"
                  : "var(--bg-card)",
              border:
                currentLocation?.cityName?.toLowerCase() === h.name.split(",")[0].toLowerCase()
                  ? "1px solid var(--accent-cyan)"
                  : "1px solid var(--border-light)",
              color: "var(--text-main)",
              fontSize: "0.78rem",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            🔥 {h.name.split(",")[0]}
          </button>
        ))}
      </div>

      {/* Map or 3D Globe Container */}
      <div style={{ flex: 1, minHeight: "360px", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
        {viewMode === "3d" ? (
          <EarthGlobe3D
            currentLocation={currentLocation}
            onSelectLocation={onSelectLocation}
            weatherData={weatherData}
            theme={theme}
          />
        ) : (
          <MapContainer center={mapCenter} zoom={4} scrollWheelZoom={true} style={{ width: "100%", height: "100%" }}>
            <MapController center={mapCenter} zoom={5} />
            <MapClickHandler onMapClick={handleMapClick} />

            <TileLayer
              key={`base-${theme}`}
              url={baseTileUrl}
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ'
            />
            <TileLayer
              key={`ref-${theme}`}
              url={referenceTileUrl}
              pane="overlayPane"
              opacity={0.85}
            />

            {/* Selected Location Marker */}
            {currentLocation && (
              <Marker position={[currentLocation.lat, currentLocation.lon]} icon={createCustomMarkerIcon("#06b6d4")}>
                <Popup>
                  <div style={{ padding: "0.25rem" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "0.2rem" }}>
                      📍 {currentLocation.name}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--accent-cyan)" }}>
                      Lat: {currentLocation.lat.toFixed(2)}°, Lon: {currentLocation.lon.toFixed(2)}°
                    </div>
                    {weatherData && (
                      <div style={{ marginTop: "0.4rem", fontSize: "0.82rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.4rem" }}>
                        <div>Current Temp: <strong>{weatherData.current?.temp}°C</strong></div>
                        <div>Humidity: {weatherData.current?.humidity}%</div>
                        <div>Wind: {weatherData.current?.windSpeed} km/h</div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Hotspots Markers */}
            {CLIMATE_HOTSPOTS.map((h) => (
              <Marker key={h.id} position={[h.lat, h.lon]} icon={createCustomMarkerIcon("#f59e0b", "🔥")}>
                <Popup>
                  <div style={{ padding: "0.25rem", maxWidth: "220px" }}>
                    <div className="badge badge-amber" style={{ marginBottom: "0.4rem" }}>
                      {h.badge}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>{h.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      {h.description}
                    </div>
                    <button
                      onClick={() => handleHotspotClick(h)}
                      style={{
                        width: "100%",
                        marginTop: "0.5rem",
                        background: "var(--accent-cyan)",
                        border: "none",
                        color: "#000",
                        padding: "0.35rem",
                        borderRadius: "6px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      Inspect Weather & Climate
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* NASA Active Wildfire Thermal Anomaly Markers */}
            {(activeLayer === "wildfires" || activeLayer === "temp") &&
              GLOBAL_WILDFIRE_HOTSPOTS.map((fire) => (
                <Marker key={fire.id} position={[fire.lat, fire.lon]} icon={createCustomMarkerIcon("#ef4444", "🔥")}>
                  <Popup>
                    <div style={{ padding: "0.25rem", maxWidth: "230px" }}>
                      <div className="badge badge-red" style={{ marginBottom: "0.4rem" }}>
                        NASA Thermal Anomaly ({fire.sensor})
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>
                        {fire.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                        Biome: {fire.biome}
                      </div>
                      <div style={{ fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "0.2rem", margin: "0.4rem 0" }}>
                        <div>Fire Radiative Power: <strong style={{ color: "var(--accent-amber)" }}>{fire.frp} MW</strong></div>
                        <div>Brightness Temp: <strong>{fire.brightnessTempC}°C</strong></div>
                        <div>Active Clusters: <strong>{fire.activeClusters}</strong> ({fire.status})</div>
                        <div>Confidence: <strong style={{ color: "var(--accent-green)" }}>{fire.confidence}%</strong></div>
                      </div>
                      <button
                        onClick={() =>
                          onSelectLocation({
                            name: fire.name,
                            cityName: fire.name.split(",")[0],
                            lat: fire.lat,
                            lon: fire.lon
                          })
                        }
                        style={{
                          width: "100%",
                          marginTop: "0.4rem",
                          background: "var(--accent-red)",
                          border: "none",
                          color: "#fff",
                          padding: "0.35rem",
                          borderRadius: "6px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "0.78rem"
                        }}
                      >
                        Target Wildfire Zone
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}

        {viewMode === "2d" && (
          <div
            style={{
              position: "absolute",
              bottom: "0.85rem",
              left: "0.85rem",
              zIndex: 400,
              background: "var(--bg-card-hover)",
              backdropFilter: "blur(10px)",
              padding: "0.4rem 0.8rem",
              borderRadius: "12px",
              border: "1px solid var(--border-light)",
              fontSize: "0.75rem",
              color: "var(--text-muted)"
            }}
          >
            💡 Click anywhere on the map to inspect live weather & climate stats
          </div>
        )}
      </div>
    </div>
  );
}
