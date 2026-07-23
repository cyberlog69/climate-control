import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { CLIMATE_HOTSPOTS } from "../services/climateData";
import { MapPin, Layers, Flame, Wind, Cloud, Eye } from "lucide-react";

// Custom Leaflet Icons using SVG strings
const createCustomMarkerIcon = (color, text = "") => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="${color}" flood-opacity="0.8"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z" fill="${color}" filter="url(#glow)"/>
      <circle cx="16" cy="15" r="7" fill="#0f172a"/>
      ${
        text
          ? `<text x="16" y="19" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle" font-family="sans-serif">${text}</text>`
          : `<circle cx="16" cy="15" r="3.5" fill="${color}"/>`
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

// Component to handle map panning programmatically
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 6, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

// Component to handle user clicking anywhere on the map
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    }
  });
  return null;
}

export default function InteractiveMap({
  currentLocation,
  onSelectLocation,
  weatherData
}) {
  const [activeLayer, setActiveLayer] = useState("temp"); // 'temp' | 'aqi' | 'wind' | 'clouds'
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
    { id: "aqi", label: "Air Quality (AQI)", icon: Wind, color: "var(--accent-cyan)" },
    { id: "clouds", label: "Cloud Cover", icon: Cloud, color: "#38bdf8" }
  ];

  return (
    <div className="glass-card" style={{ padding: "1.25rem", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header & Controls Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.75rem"
        }}
      >
        <div className="section-title" style={{ margin: 0 }}>
          <MapPin size={22} />
          <span>Interactive Global Climate Map</span>
        </div>

        {/* Layer Switches */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
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
                  gap: "0.4rem",
                  padding: "0.45rem 0.75rem",
                  borderRadius: "20px",
                  border: isActive ? `1px solid ${l.color}` : "1px solid var(--border-light)",
                  background: isActive ? `${l.color}22` : "rgba(15, 23, 42, 0.6)",
                  color: isActive ? "#fff" : "var(--text-muted)",
                  fontSize: "0.8rem",
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
      </div>

      {/* Preset Climate Hotspots Quick Selection */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.75rem",
          marginBottom: "0.75rem"
        }}
      >
        {CLIMATE_HOTSPOTS.map((h) => (
          <button
            key={h.id}
            onClick={() => handleHotspotClick(h)}
            style={{
              whiteSpace: "nowrap",
              padding: "0.35rem 0.75rem",
              borderRadius: "14px",
              background:
                currentLocation?.cityName?.toLowerCase() === h.name.split(",")[0].toLowerCase()
                  ? "rgba(6, 182, 212, 0.25)"
                  : "rgba(30, 41, 59, 0.6)",
              border:
                currentLocation?.cityName?.toLowerCase() === h.name.split(",")[0].toLowerCase()
                  ? "1px solid var(--accent-cyan)"
                  : "1px solid var(--border-light)",
              color: "#fff",
              fontSize: "0.78rem",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            🔥 {h.name.split(",")[0]}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div style={{ flex: 1, minHeight: "420px", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
        <MapContainer center={mapCenter} zoom={4} scrollWheelZoom={true} style={{ width: "100%", height: "100%" }}>
          <MapController center={mapCenter} zoom={5} />
          <MapClickHandler onMapClick={handleMapClick} />

          {/* CartoDB Dark Matter tiles for modern dark map styling */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
          />

          {/* Selected Location Marker */}
          {currentLocation && (
            <Marker
              position={[currentLocation.lat, currentLocation.lon]}
              icon={createCustomMarkerIcon("#06b6d4")}
            >
              <Popup>
                <div style={{ padding: "0.25rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: "0.2rem" }}>
                    📍 {currentLocation.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--accent-cyan)" }}>
                    Lat: {currentLocation.lat.toFixed(2)}°, Lon: {currentLocation.lon.toFixed(2)}°
                  </div>
                  {weatherData && (
                    <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "0.4rem" }}>
                      <div>Current Temp: <strong>{weatherData.current?.temp}°C</strong></div>
                      <div>Humidity: {weatherData.current?.humidity}%</div>
                      <div>Wind: {weatherData.current?.windSpeed} km/h</div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Climate Hotspots Markers */}
          {CLIMATE_HOTSPOTS.map((h) => (
            <Marker
              key={h.id}
              position={[h.lat, h.lon]}
              icon={createCustomMarkerIcon("#f59e0b", "🔥")}
            >
              <Popup>
                <div style={{ padding: "0.25rem", maxWidth: "220px" }}>
                  <div className="badge badge-amber" style={{ marginBottom: "0.4rem" }}>
                    {h.badge}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>{h.name}</div>
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
        </MapContainer>

        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            zIndex: 400,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(10px)",
            padding: "0.45rem 0.85rem",
            borderRadius: "12px",
            border: "1px solid var(--border-light)",
            fontSize: "0.75rem",
            color: "var(--text-muted)"
          }}
        >
          💡 Click anywhere on the map to inspect live weather & climate stats
        </div>
      </div>
    </div>
  );
}
