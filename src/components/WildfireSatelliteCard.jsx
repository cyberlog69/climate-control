import React, { useMemo } from "react";
import {
  GLOBAL_WILDFIRE_HOTSPOTS,
  evaluateLocalWildfireRisk
} from "../services/wildfireSatelliteApi";
import {
  Flame,
  Satellite,
  Radio,
  Compass,
  AlertTriangle,
  Zap,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

export default function WildfireSatelliteCard({
  currentLocation,
  weatherData,
  onSelectLocation
}) {
  const localRisk = useMemo(() => {
    return evaluateLocalWildfireRisk(
      currentLocation?.lat || 35.67,
      currentLocation?.lon || 139.65,
      weatherData
    );
  }, [currentLocation, weatherData]);

  // Global aggregate stats
  const totalClusters = GLOBAL_WILDFIRE_HOTSPOTS.reduce((acc, f) => acc + f.activeClusters, 0);
  const maxFRP = Math.max(...GLOBAL_WILDFIRE_HOTSPOTS.map((f) => f.frp));
  const severeOutbreaks = GLOBAL_WILDFIRE_HOTSPOTS.filter((f) => f.frp >= 500).length;

  const handleInspectFire = (fire) => {
    onSelectLocation({
      name: fire.name,
      cityName: fire.name.split(",")[0],
      lat: fire.lat,
      lon: fire.lon
    });
  };

  return (
    <div className="m3-card" style={{ padding: "1.35rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Flame size={20} style={{ color: "var(--accent-red)" }} />
          <span>NASA Wildfire & Thermal Sentinel</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span className="pulse-dot" style={{ background: "var(--accent-red)" }} />
          <span className="badge badge-red" style={{ fontSize: "0.72rem" }}>
            VIIRS / MODIS Live Feed
          </span>
        </div>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
        Near-realtime satellite thermal anomaly monitoring powered by NASA FIRMS orbital infrared radiometers.
      </p>

      {/* Global Activity Telemetry Bar (Debossed Sunken Instrument Wells) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem" }}>
        <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.2rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Active Thermal Clusters</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", margin: "0.1rem 0", fontFamily: "var(--font-heading)" }}>
            {totalClusters}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>Worldwide detections</div>
        </div>

        <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.2rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Severe Outbreaks</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-red)", margin: "0.1rem 0", fontFamily: "var(--font-heading)" }}>
            {severeOutbreaks} Zones
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>FRP &gt; 500 MW</div>
        </div>

        <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.2rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Peak Radiative Power</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-amber)", margin: "0.1rem 0", fontFamily: "var(--font-heading)" }}>
            {maxFRP} MW
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>Amazon Basin</div>
        </div>
      </div>

      {/* Local Fire Danger Risk Gauge (Skeuomorphic LCD Panel) */}
      <div
        className="sk-lcd-panel"
        style={{
          padding: "1rem 1.2rem",
          border: `1px solid ${localRisk.color}44`,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Radio size={16} style={{ color: localRisk.color }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
              Local Wildfire Hazard Assessment: {currentLocation?.cityName || "Active Location"}
            </span>
          </div>
          <span className={`badge badge-${localRisk.badge}`} style={{ fontWeight: 800 }}>
            {localRisk.level} Risk ({localRisk.score}/100)
          </span>
        </div>

        {/* Skeuomorphic Progress meter */}
        <div className="sk-meter-track" style={{ height: "8px" }}>
          <div
            className="sk-meter-fill"
            style={{
              width: `${localRisk.score}%`,
              background: `linear-gradient(90deg, #10b981, #f59e0b, #ef4444)`
            }}
          />
        </div>

        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          📍 Closest active thermal cluster is ~<strong>{localRisk.minDistanceKm.toLocaleString()} km</strong> away (
          {localRisk.nearestCluster?.name}).
        </div>
      </div>

      {/* Active Wildfire Outbreaks List */}
      <div>
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.6rem" }}>
          Active Global Satellite Telemetry Feeds
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {GLOBAL_WILDFIRE_HOTSPOTS.map((fire) => (
            <div
              key={fire.id}
              style={{
                background: "var(--sk-surface-btn)",
                padding: "0.75rem 0.95rem",
                borderRadius: "var(--radius-md)",
                border: "var(--sk-bezel-border)",
                boxShadow: "var(--sk-shadow-btn)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.6rem",
                transition: "all 0.18s cubic-bezier(0.2, 0, 0, 1)"
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                  <Flame size={15} style={{ color: fire.frp >= 500 ? "var(--accent-red)" : "var(--accent-amber)", flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {fire.name}
                  </span>
                  <span className={`badge badge-${fire.status === "Expanding" ? "red" : fire.status === "Active" ? "amber" : "green"}`} style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
                    {fire.status}
                  </span>
                </div>

                <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                  <span>Sensor: <strong style={{ color: "var(--accent-cyan)" }}>{fire.sensor}</strong></span>
                  <span>FRP: <strong style={{ color: "var(--accent-amber)" }}>{fire.frp} MW</strong></span>
                  <span>Brightness: <strong>{fire.brightnessTempC}°C</strong></span>
                  <span>Detected: {fire.detectedAgo}</span>
                </div>
              </div>

              <button
                onClick={() => handleInspectFire(fire)}
                className="m3-chip active"
                style={{
                  padding: "0.32rem 0.65rem",
                  fontSize: "0.75rem",
                  gap: "0.25rem",
                  flexShrink: 0
                }}
                title="Fly Camera to Wildfire Coordinates"
              >
                <span>Target</span>
                <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
