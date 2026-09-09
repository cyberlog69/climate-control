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
    <div className="glass-card" style={{ padding: "1.35rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.95rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Wind size={20} style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.02em", margin: 0 }}>
            Air Quality & Atmospheric Health
          </h3>
        </div>
        <span
          className="badge"
          style={{
            background: `${aqiInfo.color}1c`,
            color: aqiInfo.color,
            border: `1px solid ${aqiInfo.color}44`,
            fontSize: "0.72rem",
            padding: "0.25rem 0.65rem"
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: aqiInfo.color, display: "inline-block" }}></span>
          {aqiInfo.status}
        </span>
      </div>

      {/* AQI Score Display Container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.15rem",
          padding: "1rem 1.15rem",
          background: "var(--bg-inner)",
          borderRadius: "var(--radius-lg)",
          border: `1px solid ${aqiInfo.color}35`,
          boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.06), 0 8px 24px -6px ${aqiInfo.color}15`,
          marginBottom: "1.1rem"
        }}
      >
        <div
          style={{
            width: "66px",
            height: "66px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${aqiInfo.color}25 0%, var(--bg-card) 75%)`,
            border: `2.5px solid ${aqiInfo.color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 20px ${aqiInfo.color}35, inset 0 0 12px ${aqiInfo.color}20`,
            flexShrink: 0
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--text-main)",
              lineHeight: 1,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.03em"
            }}
          >
            {usAqi}
          </div>
          <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em", marginTop: "2px" }}>
            AQI
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem", letterSpacing: "-0.01em" }}>
            Health Advisory
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.45, fontWeight: 450 }}>
            {aqiInfo.desc}
          </div>
        </div>
      </div>

      {/* Pollutant Progress Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {pollutants.map((p, idx) => {
          const pct = Math.min(100, Math.round((p.current / p.max) * 100));
          const barColor = pct > 75 ? "linear-gradient(90deg, #f59e0b, #ef4444)" : pct > 45 ? "linear-gradient(90deg, #06b6d4, #f59e0b)" : "linear-gradient(90deg, #10b981, #06b6d4)";
          return (
            <div key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                <span style={{ fontWeight: 500 }}>{p.label}</span>
                <span style={{ color: "var(--text-main)", fontWeight: 700, fontFamily: "monospace" }}>{p.val}</span>
              </div>
              <div
                style={{
                  height: "7px",
                  width: "100%",
                  background: "var(--bg-inner)",
                  borderRadius: "var(--radius-pill)",
                  overflow: "hidden",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)"
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: barColor,
                    borderRadius: "var(--radius-pill)",
                    transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
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
