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
        className="m3-card printable-report"
        style={{
          width: "100%",
          maxWidth: "750px",
          maxHeight: "90vh",
          padding: "2rem",
          position: "relative",
          overflowY: "auto",
          border: "var(--sk-bezel-border)",
          boxShadow: "var(--sk-shadow-card)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Globe size={24} style={{ color: "var(--accent-cyan)" }} />
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                Environmental Health Diagnostic Report
              </h3>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ClimateSphere Sentinel Feed • {now}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handlePrint}
              className="m3-chip active"
              style={{
                padding: "0.45rem 1rem",
                fontSize: "0.82rem",
                gap: "0.4rem"
              }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
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

        {/* Location & Summary Card (Skeuomorphic LCD Panel) */}
        <div
          className="sk-lcd-panel"
          style={{
            padding: "1.25rem 1.4rem",
            marginBottom: "1.25rem"
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Target Inspection Zone</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", margin: "0.2rem 0", fontFamily: "var(--font-heading)" }}>{locationName}</h2>
          <div style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", fontWeight: 600 }}>
            Timezone: {weatherData.timezone || "UTC"} | Coordinates: {weatherData.raw?.latitude != null ? weatherData.raw.latitude.toFixed(2) : (weatherData.latitude != null ? weatherData.latitude.toFixed(2) : "0.00")}°, {weatherData.raw?.longitude != null ? weatherData.raw.longitude.toFixed(2) : (weatherData.longitude != null ? weatherData.longitude.toFixed(2) : "0.00")}°
          </div>
        </div>

        {/* Real-time Diagnostics Specs (Debossed Instrument Tiles) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.85rem", marginBottom: "1.25rem" }}>
          <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0.95rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Current Temp</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)", fontFamily: "var(--font-heading)" }}>{current.temp}°{unit}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Feels like {current.feelsLike}°{unit}</div>
          </div>

          <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0.95rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Air Quality Index</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: aqiInfo.color, fontFamily: "var(--font-heading)" }}>{usAqi}</div>
            <div style={{ fontSize: "0.72rem", color: aqiInfo.color, fontWeight: 700 }}>{aqiInfo.status}</div>
          </div>

          <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0.95rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Wind & Pressure</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)", fontFamily: "var(--font-heading)" }}>{current.windSpeed} km/h</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{current.pressure} hPa</div>
          </div>
        </div>

        {/* Safety & Health Advisory */}
        <div
          className="sk-recessed-tile"
          style={{
            padding: "1.1rem",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            marginBottom: "1.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
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
                  <td style={{ padding: "0.5rem", textAlign: "right", color: "var(--accent-cyan)" }}>
                    {d.precipSum != null ? d.precipSum.toFixed(1) : "0.0"} mm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
