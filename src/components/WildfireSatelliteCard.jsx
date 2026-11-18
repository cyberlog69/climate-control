import React, { useMemo } from "react";
import {
  SAMPLE_WILDFIRE_HOTSPOTS,
  evaluateLocalWildfireRisk
} from "../services/wildfireSatelliteApi";
import { Flame, Radio, ChevronRight } from "lucide-react";

const formatNumber = (value, digits = 0) =>
  Number.isFinite(value) ? value.toFixed(digits).replace(/\.0$/, "") : null;

export default function WildfireSatelliteCard({
  currentLocation,
  weatherData,
  onSelectLocation,
  hotspots = SAMPLE_WILDFIRE_HOTSPOTS,
  source = "sample",
  fetchedAt = null
}) {
  const isLive = source === "live";
  const fireList = useMemo(
    () => (Array.isArray(hotspots) ? hotspots : SAMPLE_WILDFIRE_HOTSPOTS),
    [hotspots]
  );

  const localRisk = useMemo(() => {
    return evaluateLocalWildfireRisk(
      currentLocation?.lat ?? 35.67,
      currentLocation?.lon ?? 139.65,
      weatherData,
      fireList
    );
  }, [currentLocation?.lat, currentLocation?.lon, weatherData, fireList]);

  const totalClusters = fireList.reduce((acc, fire) => acc + (Number(fire.activeClusters) || 1), 0);
  const peakFRP = fireList.reduce(
    (max, fire) => (Number.isFinite(fire.frp) ? Math.max(max, fire.frp) : max),
    0
  );
  const severeOutbreaks = fireList.filter((fire) => Number(fire.frp) >= 500).length;

  const handleInspectFire = (fire) => {
    onSelectLocation({
      name: fire.name,
      cityName: fire.name.split(",")[0],
      lat: fire.lat,
      lon: fire.lon
    });
  };

  return (
    <div className="m3-card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Flame size={18} style={{ color: "var(--accent-red)" }} />
          <span>NASA open wildfire events</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {isLive && <span className="pulse-dot" style={{ background: "var(--accent-red)", width: 7, height: 7 }} />}
          <span className={`badge badge-${isLive ? "red" : "amber"}`}>
            {isLive ? "NASA EONET live" : "Sample dataset"}
          </span>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
        {isLive
          ? "Open wildfire events reported by NASA EONET. Positions are approximate centroids; the feed carries no fire radiative power."
          : "The NASA EONET feed is unavailable, so this panel shows the bundled example dataset. Example values are not measurements."}
        {fetchedAt && isLive ? ` Updated ${new Date(fetchedAt).toLocaleTimeString()}.` : ""}
      </p>

      {/* Global Activity Telemetry Bar (Debossed Sunken Instrument Wells) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem" }}>
        <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.2rem" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
            {isLive ? "Open NASA Events" : "Sample Clusters"}
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", margin: "0.1rem 0", fontFamily: "var(--font-heading)" }}>
            {isLive ? fireList.length : totalClusters}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            {isLive ? "Worldwide detections" : "Illustrative only"}
          </div>
        </div>

        <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.2rem" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Severe Outbreaks</div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-red)", margin: "0.1rem 0", fontFamily: "var(--font-heading)" }}>
            {peakFRP > 0 ? `${severeOutbreaks} Zones` : "n/a"}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            {peakFRP > 0 ? "FRP > 500 MW" : "FRP not reported"}
          </div>
        </div>

        <div className="sk-recessed-tile" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.2rem" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Peak Radiative Power</div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-amber)", margin: "0.1rem 0", fontFamily: "var(--font-heading)" }}>
            {peakFRP > 0 ? `${formatNumber(peakFRP, 1)} MW` : "n/a"}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            {peakFRP > 0 ? "Across tracked zones" : "Not in EONET feed"}
          </div>
        </div>
      </div>

      {/* Local fire danger: only scored when the weather feed has all drivers. */}
      {localRisk.available ? (
        <div
          className="sk-lcd-panel"
          style={{
            padding: "1rem 1.1rem",
            border: `1px solid ${localRisk.color}44`,
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Radio size={16} style={{ color: localRisk.color }} />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                Local hazard: {currentLocation?.cityName || "active location"}
              </span>
            </div>
            <span className={`badge badge-${localRisk.badge}`}>
              {localRisk.level} risk, {localRisk.score}/100
            </span>
          </div>

          <div className="sk-meter-track" style={{ height: "6px" }}>
            <div
              className="sk-meter-fill"
              style={{
                width: `${localRisk.score}%`,
                background: localRisk.color
              }}
            />
          </div>

          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {localRisk.nearestCluster && Number.isFinite(localRisk.minDistanceKm) ? (
              <>
                Nearest tracked event is about{" "}
                <strong style={{ color: "var(--text-main)" }}>{localRisk.minDistanceKm.toLocaleString()} km</strong> away
                ({localRisk.nearestCluster.name}).
              </>
            ) : (
              "No tracked wildfire event is near this location."
            )}
          </div>
        </div>
      ) : (
        <div className="sk-recessed-tile" style={{ alignItems: "flex-start", gap: "0.6rem" }}>
          <Radio size={16} style={{ color: "var(--text-dim)", flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.15rem" }}>
              Local hazard index unavailable
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              The index needs current temperature, humidity and wind. They are not in the weather feed yet.
            </div>
          </div>
        </div>
      )}

      {/* Active Wildfire Outbreaks List */}
      <div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.6rem" }}>
          {isLive ? "Open NASA EONET events" : "Example events"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {fireList.length === 0 && (
            <div style={{ fontSize: "12px", color: "var(--text-muted)", padding: "0.5rem 0" }}>
              No open wildfire events were returned by NASA EONET.
            </div>
          )}

          {fireList.map((fire) => (
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
                  <Flame size={15} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {fire.name}
                  </span>
                  <span
                    className={`badge badge-${isLive ? "red" : fire.status === "Expanding" ? "red" : fire.status === "Active" ? "amber" : "green"}`}
                    style={{ fontSize: "11px", padding: "0.1rem 0.4rem" }}
                  >
                    {isLive ? "Open" : fire.status}
                  </span>
                </div>

                <div style={{ fontSize: "11px", color: "var(--text-dim)", display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                  <span>Source: <strong style={{ color: "var(--accent-cyan)" }}>{fire.sensor}</strong></span>
                  {Number.isFinite(fire.frp) && (
                    <span>FRP: <strong style={{ color: "var(--accent-amber)" }}>{formatNumber(fire.frp, 1)} MW</strong></span>
                  )}
                  {Number.isFinite(fire.brightnessTempC) && (
                    <span>Brightness: <strong>{formatNumber(fire.brightnessTempC, 1)}°C</strong></span>
                  )}
                  <span>Detected: {fire.detectedAgo}</span>
                </div>
              </div>

              <button
                onClick={() => handleInspectFire(fire)}
                className="m3-chip active"
                style={{
                  padding: "0.32rem 0.65rem",
                  fontSize: "12px",
                  gap: "0.25rem",
                  flexShrink: 0
                }}
                title="Fly camera to wildfire coordinates"
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
