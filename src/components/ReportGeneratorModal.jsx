import React from "react";
import { getAqiLevel } from "../services/climateData";
import { Printer, X, ShieldCheck, Globe, Thermometer, Wind, Droplets, Calendar } from "lucide-react";

export default function ReportGeneratorModal({ locationName, weatherData, airQualityData, unit, onClose }) {
  if (!weatherData) return null;

  const current = weatherData.current || {};
  const usAqi = airQualityData?.us_aqi || 42;
  const aqiInfo = getAqiLevel(usAqi);
  const now = new Date().toUTCString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(16px)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card printable-report"
        style={{
          width: "100%",
          maxWidth: "750px",
          maxHeight: "90vh",
          padding: "2rem",
          position: "relative",
          overflowY: "auto",
          background: "var(--bg-card-hover)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Globe size={24} style={{ color: "var(--accent-cyan)" }} />
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)" }}>
                Environmental Health Diagnostic Report
              </h3>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ClimateSphere Sentinel Feed • {now}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handlePrint}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--accent-cyan)",
                border: "none",
                color: "#000",
                padding: "0.45rem 0.85rem",
                borderRadius: "20px",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer"
              }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: "var(--bg-inner)",
                border: "1px solid var(--border-light)",
                color: "var(--text-main)",
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Location & Summary Card */}
        <div
          style={{
            padding: "1.25rem",
            background: "var(--bg-inner)",
            borderRadius: "16px",
            border: "1px solid var(--border-light)",
            marginBottom: "1.25rem"
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Target Inspection Zone</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", margin: "0.2rem 0" }}>{locationName}</h2>
          <div style={{ fontSize: "0.85rem", color: "var(--accent-cyan)" }}>
            Timezone: {weatherData.timezone} | Coordinates: {weatherData.raw?.latitude?.toFixed(2)}°, {weatherData.raw?.longitude?.toFixed(2)}°
          </div>
        </div>

        {/* Real-time Diagnostics Specs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.85rem", marginBottom: "1.25rem" }}>
          <div style={{ background: "var(--bg-inner)", padding: "0.85rem", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Current Temp</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)" }}>{current.temp}°{unit}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Feels like {current.feelsLike}°{unit}</div>
          </div>

          <div style={{ background: "var(--bg-inner)", padding: "0.85rem", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Air Quality Index</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: aqiInfo.color }}>{usAqi}</div>
            <div style={{ fontSize: "0.72rem", color: aqiInfo.color }}>{aqiInfo.status}</div>
          </div>

          <div style={{ background: "var(--bg-inner)", padding: "0.85rem", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Wind & Pressure</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)" }}>{current.windSpeed} km/h</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{current.pressure} hPa</div>
          </div>
        </div>

        {/* Safety & Health Advisory */}
        <div
          style={{
            padding: "1rem",
            background: "rgba(16, 185, 129, 0.12)",
            borderRadius: "14px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            marginBottom: "1.25rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem" }}>
            <ShieldCheck size={18} style={{ color: "var(--accent-green)" }} />
            <span>Health & Environmental Advisory</span>
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
            {aqiInfo.desc} Stay hydrated during outdoor thermal spikes.
          </div>
        </div>

        {/* 7-Day Forecast Summary Table */}
        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>7-Day Weather Outlook</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", color: "var(--text-main)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Day</th>
                <th style={{ textAlign: "right", padding: "0.5rem" }}>High</th>
                <th style={{ textAlign: "right", padding: "0.5rem" }}>Low</th>
                <th style={{ textAlign: "right", padding: "0.5rem" }}>Precipitation</th>
              </tr>
            </thead>
            <tbody>
              {(weatherData.daily || []).map((d, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "0.5rem", fontWeight: 600 }}>{d.date}</td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>{d.maxTemp}°</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", color: "var(--text-dim)" }}>{d.minTemp}°</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", color: "var(--accent-cyan)" }}>{d.precipSum.toFixed(1)} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
