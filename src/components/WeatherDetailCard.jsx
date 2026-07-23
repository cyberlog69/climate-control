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
  Sunset
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
    <div className="glass-card" style={{ padding: "1.25rem", position: "relative", overflow: "hidden" }}>
      {/* Location Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Current Weather Sentinel
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)" }}>{locationName}</h2>
        </div>
        <span className="badge badge-cyan">{current.isDay ? "Daytime" : "Nighttime"}</span>
      </div>

      {/* Main Temperature & Icon Container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "0.75rem 0",
          padding: "0.85rem 1rem",
          background: "var(--bg-inner)",
          borderRadius: "16px",
          border: "1px solid var(--border-light)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          {getIconComponent(wmo.icon)}
          <div>
            <div style={{ fontSize: "2.75rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1 }}>
              {displayTemp(current.temp)}°{unit}
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--accent-cyan)", fontWeight: 600, marginTop: "0.2rem" }}>
              {wmo.label}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Feels Like</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
            {displayTemp(current.feelsLike)}°{unit}
          </div>
          {todayForecast.maxTemp !== undefined && (
            <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
              H: {displayTemp(todayForecast.maxTemp)}° | L: {displayTemp(todayForecast.minTemp)}°
            </div>
          )}
        </div>
      </div>

      {/* Grid Specs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginTop: "0.75rem" }}>
        {/* Humidity */}
        <div style={{ background: "var(--bg-inner)", padding: "0.65rem 0.85rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.65rem", border: "1px solid var(--border-light)" }}>
          <Droplets size={18} style={{ color: "var(--accent-cyan)" }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Humidity</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>{current.humidity}%</div>
          </div>
        </div>

        {/* Wind */}
        <div style={{ background: "var(--bg-inner)", padding: "0.65rem 0.85rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.65rem", border: "1px solid var(--border-light)" }}>
          <Wind size={18} style={{ color: "#38bdf8" }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Wind Speed</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>{current.windSpeed} km/h</div>
          </div>
        </div>

        {/* Pressure */}
        <div style={{ background: "var(--bg-inner)", padding: "0.65rem 0.85rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.65rem", border: "1px solid var(--border-light)" }}>
          <Gauge size={18} style={{ color: "var(--accent-amber)" }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Pressure</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>{current.pressure} hPa</div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div style={{ background: "var(--bg-inner)", padding: "0.65rem 0.85rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.65rem", border: "1px solid var(--border-light)" }}>
          <Cloud size={18} style={{ color: "var(--text-muted)" }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Cloud Cover</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>{current.cloudCover}%</div>
          </div>
        </div>
      </div>

      {/* Sunrise & Sunset */}
      {todayForecast.sunrise && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.75rem",
            paddingTop: "0.65rem",
            borderTop: "1px solid var(--border-light)",
            fontSize: "0.82rem",
            color: "var(--text-muted)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Sunrise size={16} style={{ color: "var(--accent-amber)" }} />
            <span>Sunrise: <strong style={{ color: "var(--text-main)" }}>{todayForecast.sunrise}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Sunset size={16} style={{ color: "var(--accent-red)" }} />
            <span>Sunset: <strong style={{ color: "var(--text-main)" }}>{todayForecast.sunset}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
