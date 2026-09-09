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
  Sunrise,
  Sunset,
  Mic
} from "lucide-react";

export default function WeatherDetailCard({ locationName, weatherData, unit, onOpenVoiceBriefing }) {
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
        return <Cloud size={48} style={{ color: "var(--text-muted)" }} />;
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
        return <Cloud size={48} style={{ color: "var(--text-muted)" }} />;
    }
  };

  const todayForecast = weatherData.daily?.[0] || {};

  return (
    <div className="m3-card" style={{ padding: "1.35rem", position: "relative" }}>
      {/* Location Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--md-sys-color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Current Conditions
          </div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--md-sys-color-on-background)", letterSpacing: "-0.025em", marginTop: "0.15rem" }}>
            {locationName}
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          {onOpenVoiceBriefing && (
            <button
              onClick={onOpenVoiceBriefing}
              className="m3-chip"
              style={{
                background: "var(--md-sys-color-primary-container)",
                color: "var(--md-sys-color-on-primary-container)",
                borderColor: "transparent"
              }}
              title="Listen to AI Climate Briefing"
            >
              <Mic size={13} />
              <span>AI Briefing</span>
            </button>
          )}
          <span className="m3-chip" style={{ background: "var(--md-sys-color-surface-container)", fontSize: "0.72rem" }}>
            <span className="pulse-dot" style={{ width: 6, height: 6 }}></span>
            {current.isDay ? "Daytime" : "Nighttime"}
          </span>
        </div>
      </div>

      {/* Main Temperature & Icon Container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "0.85rem 0",
          padding: "1rem 1.15rem",
          background: "var(--bg-inner)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-light)",
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.08)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ filter: "drop-shadow(0 4px 12px rgba(6, 182, 212, 0.25))" }}>
            {getIconComponent(wmo.icon)}
          </div>
          <div>
            <div
              style={{
                fontSize: "clamp(2.1rem, 3.4vw, 3rem)",
                fontWeight: 800,
                color: "var(--text-main)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                fontFamily: "var(--font-heading)",
                fontFeatureSettings: "'tnum' 1"
              }}
            >
              {displayTemp(current.temp)}°<span style={{ fontSize: "1.75rem", fontWeight: 600, color: "var(--text-muted)" }}>{unit}</span>
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--accent-cyan)", fontWeight: 600, marginTop: "0.25rem", letterSpacing: "-0.01em" }}>
              {wmo.label}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
            Feels Like
          </div>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "var(--text-main)",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-heading)",
              fontFeatureSettings: "'tnum' 1"
            }}
          >
            {displayTemp(current.feelsLike)}°{unit}
          </div>
          {todayForecast.maxTemp !== undefined && (
            <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", marginTop: "0.25rem", fontWeight: 500 }}>
              H: <span style={{ color: "var(--text-main)" }}>{displayTemp(todayForecast.maxTemp)}°</span> · L: <span style={{ color: "var(--text-main)" }}>{displayTemp(todayForecast.minTemp)}°</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid Specs with Glass Stat Chips */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginTop: "0.85rem" }}>
        {/* Humidity */}
        <div className="glass-stat-chip">
          <Droplets size={19} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>Humidity</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.01em" }}>{current.humidity}%</div>
          </div>
        </div>

        {/* Wind */}
        <div className="glass-stat-chip">
          <Wind size={19} style={{ color: "#38bdf8", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>Wind Speed</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.01em" }}>{current.windSpeed} km/h</div>
          </div>
        </div>

        {/* Pressure */}
        <div className="glass-stat-chip">
          <Gauge size={19} style={{ color: "var(--accent-amber)", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>Pressure</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.01em" }}>{current.pressure} hPa</div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="glass-stat-chip">
          <Cloud size={19} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>Cloud Cover</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.01em" }}>{current.cloudCover}%</div>
          </div>
        </div>
      </div>

      {/* Sunrise & Sunset */}
      {todayForecast.sunrise && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.85rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "0.82rem",
            color: "var(--text-muted)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sunrise size={16} style={{ color: "var(--accent-amber)" }} />
            <span>Sunrise: <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>{todayForecast.sunrise}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sunset size={16} style={{ color: "var(--accent-red)" }} />
            <span>Sunset: <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>{todayForecast.sunset}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
