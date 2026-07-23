import React from "react";
import { getWmoInfo } from "../services/climateData";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Compass,
  Sunrise,
  Sunset,
  Thermometer
} from "lucide-react";

export default function WeatherDetailCard({ locationName, weatherData, unit }) {
  if (!weatherData || !weatherData.current) {
    return (
      <div className="glass-card" style={{ padding: "2rem", textAlign: "center" }}>
        <Cloud size={40} style={{ color: "var(--text-dim)", marginBottom: "1rem" }} />
        <p style={{ color: "var(--text-muted)" }}>Loading live weather feeds...</p>
      </div>
    );
  }

  const current = weatherData.current;
  const wmo = getWmoInfo(current.weatherCode);

  // Unit Converters
  const displayTemp = (tempC) => {
    if (unit === "F") return Math.round((tempC * 9) / 5 + 32);
    return tempC;
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "sun":
      case "sun-cloud":
        return <Sun size={48} style={{ color: "#f59e0b" }} />;
      case "cloud-sun":
      case "cloud":
        return <Cloud size={48} style={{ color: "#94a3b8" }} />;
      case "cloud-drizzle":
      case "cloud-rain":
      case "cloud-rain-heavy":
        return <CloudRain size={48} style={{ color: "#38bdf8" }} />;
      case "cloud-lightning":
      case "cloud-hail":
        return <CloudLightning size={48} style={{ color: "#a855f7" }} />;
      case "snowflake":
        return <Snowflake size={48} style={{ color: "#67e8f9" }} />;
      default:
        return <Cloud size={48} style={{ color: "#94a3b8" }} />;
    }
  };

  const todayForecast = weatherData.daily?.[0] || {};

  return (
    <div className="glass-card" style={{ padding: "1.5rem", position: "relative", overflow: "hidden" }}>
      {/* Background Weather Glow Aura */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
          pointerEvents: "none"
        }}
      />

      {/* Location Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Current Weather Sentinel
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>{locationName}</h2>
        </div>
        <span className="badge badge-cyan">{current.isDay ? "Daytime" : "Nighttime"}</span>
      </div>

      {/* Main Temperature & Icon Grid */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "1rem 0",
          padding: "1rem",
          background: "rgba(15, 23, 42, 0.6)",
          borderRadius: "16px",
          border: "1px solid var(--border-light)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {getIconComponent(wmo.icon)}
          <div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
              {displayTemp(current.temp)}°{unit}
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", fontWeight: 500, marginTop: "0.2rem" }}>
              {wmo.label}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Feels Like</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
            {displayTemp(current.feelsLike)}°{unit}
          </div>
          {todayForecast.maxTemp !== undefined && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
              H: {displayTemp(todayForecast.maxTemp)}° | L: {displayTemp(todayForecast.minTemp)}°
            </div>
          )}
        </div>
      </div>

      {/* Grid Specs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
        {/* Humidity */}
        <div style={{ background: "rgba(30, 41, 59, 0.5)", padding: "0.75rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Droplets size={20} style={{ color: "var(--accent-cyan)" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Humidity</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{current.humidity}%</div>
          </div>
        </div>

        {/* Wind */}
        <div style={{ background: "rgba(30, 41, 59, 0.5)", padding: "0.75rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Wind size={20} style={{ color: "#38bdf8" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Wind Speed</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{current.windSpeed} km/h</div>
          </div>
        </div>

        {/* Pressure */}
        <div style={{ background: "rgba(30, 41, 59, 0.5)", padding: "0.75rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Gauge size={20} style={{ color: "var(--accent-amber)" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pressure</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{current.pressure} hPa</div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div style={{ background: "rgba(30, 41, 59, 0.5)", padding: "0.75rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Cloud size={20} style={{ color: "var(--text-muted)" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cloud Cover</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{current.cloudCover}%</div>
          </div>
        </div>
      </div>

      {/* Sunrise & Sunset */}
      {todayForecast.sunrise && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-light)",
            fontSize: "0.85rem",
            color: "var(--text-muted)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sunrise size={16} style={{ color: "var(--accent-amber)" }} />
            <span>Sunrise: <strong style={{ color: "#fff" }}>{todayForecast.sunrise}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sunset size={16} style={{ color: "var(--accent-red)" }} />
            <span>Sunset: <strong style={{ color: "#fff" }}>{todayForecast.sunset}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
