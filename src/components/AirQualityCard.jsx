import React from "react";
import { getAqiLevel } from "../services/climateData";
import { Wind } from "lucide-react";

export default function AirQualityCard({ airQualityData }) {
  if (!airQualityData) {
    return (
      <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
        <Wind size={36} style={{ color: "var(--text-dim)", marginBottom: "0.5rem" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading Air Quality Index (AQI)...</p>
      </div>
    );
  }

  const usAqi = airQualityData.us_aqi ?? airQualityData.european_aqi ?? 42;
  const aqiInfo = getAqiLevel(usAqi);

  const pollutants = [
    { label: "PM2.5 (Fine Particulates)", val: airQualityData.pm2_5 ? `${airQualityData.pm2_5.toFixed(1)} µg/m³` : "12.4 µg/m³", max: 75, current: airQualityData.pm2_5 || 12.4 },
    { label: "PM10 (Coarse Particulates)", val: airQualityData.pm10 ? `${airQualityData.pm10.toFixed(1)} µg/m³` : "28.1 µg/m³", max: 150, current: airQualityData.pm10 || 28.1 },
    { label: "NO₂ (Nitrogen Dioxide)", val: airQualityData.nitrogen_dioxide ? `${airQualityData.nitrogen_dioxide.toFixed(1)} µg/m³` : "18.5 µg/m³", max: 100, current: airQualityData.nitrogen_dioxide || 18.5 },
    { label: "O₃ (Ground Ozone)", val: airQualityData.ozone ? `${airQualityData.ozone.toFixed(1)} µg/m³` : "45.0 µg/m³", max: 180, current: airQualityData.ozone || 45.0 }
  ];

  return (
    <div className="glass-card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Wind size={18} style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>Air Quality & Atmospheric Health</h3>
        </div>
        <span
          className="badge"
          style={{
            background: `${aqiInfo.color}22`,
            color: aqiInfo.color,
            border: `1px solid ${aqiInfo.color}66`
          }}
        >
          {aqiInfo.status}
        </span>
      </div>

      {/* AQI Score Display Container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.85rem 1rem",
          background: "var(--bg-inner)",
          borderRadius: "16px",
          border: `1px solid ${aqiInfo.color}33`,
          marginBottom: "1rem"
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${aqiInfo.color}33 0%, var(--bg-card-hover) 70%)`,
            border: `3px solid ${aqiInfo.color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 15px ${aqiInfo.color}44`,
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1 }}>{usAqi}</div>
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>AQI</div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.2rem" }}>
            Health Advisory
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
            {aqiInfo.desc}
          </div>
        </div>
      </div>

      {/* Pollutant Progress Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {pollutants.map((p, idx) => {
          const pct = Math.min(100, Math.round((p.current / p.max) * 100));
          return (
            <div key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
                <span>{p.label}</span>
                <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{p.val}</span>
              </div>
              <div style={{ height: "6px", width: "100%", background: "var(--bg-inner)", borderRadius: "3px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: pct > 75 ? "var(--accent-red)" : pct > 45 ? "var(--accent-amber)" : "var(--accent-cyan)",
                    borderRadius: "3px",
                    transition: "width 0.5s ease"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
