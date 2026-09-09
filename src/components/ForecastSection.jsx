import React, { useState } from "react";
import { getWmoInfo } from "../services/climateData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";

export default function ForecastSection({ weatherData, unit }) {
  const [activeTab, setActiveTab] = useState("hourly");

  if (!weatherData) return null;

  const displayTemp = (tempC) => {
    if (unit === "F") return Math.round((tempC * 9) / 5 + 32);
    return tempC;
  };

  const hourly = (weatherData.hourly || []).map((h) => ({
    ...h,
    dispTemp: displayTemp(h.temp)
  }));

  const daily = weatherData.daily || [];

  return (
    <div className="glass-card" style={{ padding: "1.35rem" }}>
      {/* Tab Controls Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Clock size={19} style={{ color: "var(--accent-cyan)" }} />
          <span style={{ letterSpacing: "-0.015em" }}>Forecast & Atmospheric Trajectory</span>
        </div>

        {/* Linear Segmented Control */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "var(--bg-inner)",
            padding: "3px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--border-light)",
            backdropFilter: "var(--blur-subtle)"
          }}
        >
          <button
            onClick={() => setActiveTab("hourly")}
            style={{
              padding: "0.35rem 0.85rem",
              borderRadius: "var(--radius-pill)",
              border: "none",
              background: activeTab === "hourly" ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))" : "transparent",
              color: activeTab === "hourly" ? "#fff" : "var(--text-muted)",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: activeTab === "hourly" ? "0 2px 10px rgba(6, 182, 212, 0.35)" : "none"
            }}
          >
            24-Hour Hourly
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            style={{
              padding: "0.35rem 0.85rem",
              borderRadius: "var(--radius-pill)",
              border: "none",
              background: activeTab === "daily" ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))" : "transparent",
              color: activeTab === "daily" ? "#fff" : "var(--text-muted)",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: activeTab === "daily" ? "0 2px 10px rgba(6, 182, 212, 0.35)" : "none"
            }}
          >
            7-Day Outlook
          </button>
        </div>
      </div>

      {/* Hourly View */}
      {activeTab === "hourly" && (
        <div>
          <div style={{ height: "205px", width: "100%", marginTop: "0.5rem" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-dim)" tick={{ fontSize: 10, fill: "var(--text-dim)" }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-dim)" domain={["auto", "auto"]} unit={`°`} tick={{ fontSize: 10, fill: "var(--text-dim)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "14px",
                    color: "var(--text-main)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
                  }}
                  formatter={(val, name) => [
                    name === "dispTemp" ? `${val}°${unit}` : `${val}%`,
                    name === "dispTemp" ? "Temperature" : "Rain Prob"
                  ]}
                />
                <Area type="monotone" dataKey="dispTemp" stroke="var(--accent-cyan)" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Hourly Scroll Cards */}
          <div
            style={{
              display: "flex",
              gap: "0.65rem",
              overflowX: "auto",
              paddingTop: "0.85rem",
              paddingBottom: "0.4rem"
            }}
          >
            {hourly.slice(0, 12).map((item, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: "75px",
                  background: "var(--bg-inner)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.65rem 0.5rem",
                  textAlign: "center",
                  transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease",
                  cursor: "default"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "var(--accent-cyan)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.borderColor = "var(--border-light)";
                }}
              >
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>{item.time}</div>
                <div
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                    margin: "0.3rem 0",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "-0.02em"
                  }}
                >
                  {item.dispTemp}°
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--accent-cyan)", fontWeight: 600 }}>☔ {item.pop}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily View */}
      {activeTab === "daily" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))", gap: "0.65rem" }}>
          {daily.map((d, idx) => {
            const info = getWmoInfo(d.weatherCode);
            const isToday = idx === 0;
            return (
              <div
                key={idx}
                style={{
                  background: isToday ? "rgba(6, 182, 212, 0.12)" : "var(--bg-inner)",
                  border: isToday ? "1px solid rgba(6, 182, 212, 0.4)" : "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem 0.75rem",
                  textAlign: "center",
                  position: "relative",
                  boxShadow: isToday ? "0 0 16px rgba(6, 182, 212, 0.15)" : "none",
                  transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                {isToday && (
                  <span
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      color: "var(--accent-cyan)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em"
                    }}
                  >
                    TODAY
                  </span>
                )}
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: isToday ? "var(--accent-cyan)" : "var(--text-main)" }}>
                  {d.date}
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", margin: "0.25rem 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {info.label}
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                    margin: "0.35rem 0",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "-0.02em"
                  }}
                >
                  {displayTemp(d.maxTemp)}°
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: 500 }}>
                  Min: <span style={{ color: "var(--text-muted)" }}>{displayTemp(d.minTemp)}°</span>
                </div>
                {d.precipSum > 0 && (
                  <div style={{ fontSize: "0.72rem", color: "#38bdf8", marginTop: "0.35rem", fontWeight: 600 }}>
                    🌧️ {d.precipSum.toFixed(1)} mm
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
