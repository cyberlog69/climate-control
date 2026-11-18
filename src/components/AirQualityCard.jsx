import React from "react";
import { getAqiLevel } from "../services/climateData";
import { Wind } from "lucide-react";

const POLLUTANTS = [
  { key: "pm2_5", label: "PM2.5 (fine particulates)", max: 75 },
  { key: "pm10", label: "PM10 (coarse particulates)", max: 150 },
  { key: "nitrogen_dioxide", label: "NO2 (nitrogen dioxide)", max: 100 },
  { key: "ozone", label: "O3 (ground ozone)", max: 180 }
];

export default function AirQualityCard({ airQualityData }) {
  if (!airQualityData) {
    return (
      <div className="m3-card" style={{ padding: "1.25rem", textAlign: "center" }}>
        <Wind size={32} style={{ color: "var(--text-dim)", marginBottom: "0.5rem" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
          Loading air quality for this location.
        </p>
      </div>
    );
  }

  const usAqi = airQualityData.us_aqi ?? airQualityData.european_aqi ?? null;
  const aqiInfo = usAqi == null ? null : getAqiLevel(usAqi);

  const pollutants = POLLUTANTS.map((p) => ({ ...p, value: airQualityData[p.key] })).filter(
    (p) => Number.isFinite(p.value)
  );

  return (
    <div className="m3-card" style={{ padding: "1.2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", marginBottom: "0.9rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", minWidth: 0 }}>
          <Wind size={18} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
            Air Quality
          </h3>
        </div>
        {aqiInfo && (
          <span
            className="badge"
            style={{
              background: `${aqiInfo.color}1c`,
              color: aqiInfo.color,
              border: `1px solid ${aqiInfo.color}44`
            }}
          >
            {aqiInfo.status}
          </span>
        )}
      </div>

      {aqiInfo ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.9rem 1rem",
            border: `1px solid ${aqiInfo.color}40`,
            borderRadius: "var(--radius-md)",
            background: "var(--sk-surface-well)",
            marginBottom: "1rem"
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--sk-surface-lcd)",
              border: `2px solid ${aqiInfo.color}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)", lineHeight: 1 }}>
              {usAqi}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em", marginTop: "2px" }}>
              AQI
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.15rem" }}>
              Health advisory
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.45 }}>
              {aqiInfo.desc}
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 1rem" }}>
          The air quality feed did not return an index for this location.
        </p>
      )}

      {pollutants.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {pollutants.map((p) => {
            const pct = Math.min(100, Math.round((p.value / p.max) * 100));
            const barColor = pct > 75 ? "var(--accent-red)" : pct > 45 ? "var(--accent-amber)" : "var(--accent-green)";
            return (
              <div key={p.key}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", fontSize: "12px", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  <span>{p.label}</span>
                  <span style={{ color: "var(--text-main)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {p.value.toFixed(1)} µg/m³
                  </span>
                </div>
                <div className="sk-meter-track" style={{ height: "6px" }}>
                  <div className="sk-meter-fill" style={{ width: `${pct}%`, background: barColor }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ fontSize: "12px", color: "var(--text-dim)", margin: 0 }}>
          Pollutant breakdown not reported for this location.
        </p>
      )}
    </div>
  );
}
