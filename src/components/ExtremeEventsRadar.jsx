import React from "react";
import { EXTREME_EVENTS_FEED } from "../services/climateData";
import { Radio, AlertOctagon, Waves, Snowflake, Flame, Wind } from "lucide-react";

export default function ExtremeEventsRadar() {
  const getIcon = (type) => {
    switch (type) {
      case "ocean":
        return <Waves size={18} style={{ color: "#38bdf8" }} />;
      case "ice":
        return <Snowflake size={18} style={{ color: "#67e8f9" }} />;
      case "aqi":
        return <Wind size={18} style={{ color: "var(--accent-amber)" }} />;
      case "fire":
        return <Flame size={18} style={{ color: "var(--accent-red)" }} />;
      default:
        return <AlertOctagon size={18} style={{ color: "var(--accent-cyan)" }} />;
    }
  };

  return (
    <div className="m3-card" style={{ padding: "1.35rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.95rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Radio size={18} style={{ color: "var(--accent-red)" }} />
          <span>Global Climate Anomaly Radar</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: 600 }}>
          <span className="pulse-dot"></span>
          <span>Live Sentinel Stream</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {EXTREME_EVENTS_FEED.map((event) => (
          <div
            key={event.id}
            className="sk-recessed-tile"
            style={{
              padding: "0.85rem 1rem",
              border: `1px solid ${
                event.severity === "Critical"
                  ? "rgba(239, 68, 68, 0.45)"
                  : event.severity === "High"
                  ? "rgba(245, 158, 11, 0.45)"
                  : "var(--md-sys-color-outline-variant)"
              }`,
              display: "flex",
              alignItems: "flex-start",
              gap: "0.85rem"
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "var(--sk-surface-btn)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "var(--sk-bezel-border)",
                boxShadow: "var(--sk-shadow-btn)"
              }}
            >
              {getIcon(event.type)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>{event.title}</div>
                <span
                  className={`badge badge-${
                    event.severity === "Critical" ? "red" : event.severity === "High" ? "amber" : "cyan"
                  }`}
                >
                  {event.severity}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: 600, marginBottom: "0.25rem" }}>
                📍 {event.region}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                {event.description}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "0.35rem", textAlign: "right" }}>
                {event.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
