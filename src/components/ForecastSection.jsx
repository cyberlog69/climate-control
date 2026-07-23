import React, { useState } from "react";
import { getWmoInfo } from "../services/climateData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Clock, CloudRain, Sun, Umbrella } from "lucide-react";

export default function ForecastSection({ weatherData, unit }) {
  const [activeTab, setActiveTab] = useState("hourly"); // 'hourly' | 'daily'

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
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      {/* Tab Controls Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Clock size={20} />
          <span>Weather & Climate Forecast Outlook</span>
        </div>

        <div style={{ display: "flex", background: "rgba(15, 23, 42, 0.8)", padding: "0.25rem", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
          <button
            onClick={() => setActiveTab("hourly")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "16px",
              border: "none",
              background: activeTab === "hourly" ? "var(--accent-cyan)" : "transparent",
              color: activeTab === "hourly" ? "#000" : "var(--text-muted)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            24-Hour Hourly
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "16px",
              border: "none",
              background: activeTab === "daily" ? "var(--accent-cyan)" : "transparent",
              color: activeTab === "daily" ? "#000" : "var(--text-muted)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            7-Day Outlook
          </button>
        </div>
      </div>

      {/* Hourly View */}
      {activeTab === "hourly" && (
        <div>
          <div style={{ height: "220px", width: "100%", marginTop: "0.5rem" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-dim)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-dim)" domain={["auto", "auto"]} unit={`°${unit}`} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "10px",
                    color: "#fff"
                  }}
                  formatter={(val, name) => [
                    name === "dispTemp" ? `${val}°${unit}` : `${val}%`,
                    name === "dispTemp" ? "Temperature" : "Rain Prob"
                  ]}
                />
                <Area type="monotone" dataKey="dispTemp" stroke="var(--accent-cyan)" strokeWidth={3} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Hourly Cards horizontal scroll */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              overflowX: "auto",
              paddingTop: "1rem",
              paddingBottom: "0.5rem"
            }}
          >
            {hourly.slice(0, 12).map((item, idx) => {
              const info = getWmoInfo(item.weatherCode);
              return (
                <div
                  key={idx}
                  style={{
                    minWidth: "75px",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "14px",
                    padding: "0.6rem",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.time}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: "0.3rem 0" }}>
                    {item.dispTemp}°
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--accent-cyan)" }}>☔ {item.pop}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily View */}
      {activeTab === "daily" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem" }}>
          {daily.map((d, idx) => {
            const info = getWmoInfo(d.weatherCode);
            return (
              <div
                key={idx}
                style={{
                  background: idx === 0 ? "rgba(6, 182, 212, 0.15)" : "rgba(15, 23, 42, 0.6)",
                  border: idx === 0 ? "1px solid var(--accent-cyan)" : "1px solid var(--border-light)",
                  borderRadius: "14px",
                  padding: "0.85rem",
                  textAlign: "center"
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: idx === 0 ? "var(--accent-cyan)" : "#fff" }}>
                  {d.date}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>{info.label}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: "0.4rem 0" }}>
                  {displayTemp(d.maxTemp)}°
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Min: {displayTemp(d.minTemp)}°</div>
                {d.precipSum > 0 && (
                  <div style={{ fontSize: "0.72rem", color: "#38bdf8", marginTop: "0.3rem" }}>
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
