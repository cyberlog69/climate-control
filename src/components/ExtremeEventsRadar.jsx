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
    <div className="glass-card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Radio size={18} style={{ color: "var(--accent-red)" }} />
          <span>Global Climate Anomaly Radar</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--accent-cyan)" }}>
          <span className="pulse-dot"></span>
          <span>Live Sentinel Stream</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {EXTREME_EVENTS_FEED.map((event) => (
          <div
            key={event.id}
            style={{
              padding: "0.75rem 0.85rem",
              borderRadius: "14px",
              background: "var(--bg-inner)",
              border: `1px solid ${
                event.severity === "Critical"
                  ? "rgba(239, 68, 68, 0.4)"
                  : event.severity === "High"
                  ? "rgba(245, 158, 11, 0.4)"
                  : "var(--border-light)"
              }`,
              display: "flex",
              gap: "0.75rem"
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "var(--bg-card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid var(--border-light)"
              }}
            >
              {getIcon(event.type)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.15rem" }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>{event.title}</div>
                <span
                  className={`badge badge-${
                    event.severity === "Critical" ? "red" : event.severity === "High" ? "amber" : "cyan"
                  }`}
                >
                  {event.severity}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: 500, marginBottom: "0.2rem" }}>
                📍 {event.region}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.35 }}>
                {event.description}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "0.3rem", textAlign: "right" }}>
                {event.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
