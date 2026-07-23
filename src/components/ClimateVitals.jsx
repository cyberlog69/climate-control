import React, { useState } from "react";
import {
  CO2_HISTORICAL_DATA,
  TEMP_ANOMALY_DATA,
  SEA_LEVEL_DATA,
  ARCTIC_ICE_DATA
} from "../services/climateData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Flame, Activity, Waves, Snowflake, TrendingUp, ChevronRight, X } from "lucide-react";

export default function ClimateVitals() {
  const [activeModalChart, setActiveModalChart] = useState(null);

  const vitals = [
    {
      id: "co2",
      title: "Atmospheric CO₂",
      value: "427.8 ppm",
      subtext: "+2.4 ppm vs last year",
      badge: "Keeling Curve",
      badgeType: "red",
      icon: Activity,
      color: "var(--accent-red)",
      data: CO2_HISTORICAL_DATA,
      dataKey: "ppm",
      unit: "ppm",
      description: "Highest atmospheric carbon dioxide level in human history measured at Mauna Loa Observatory."
    },
    {
      id: "temp",
      title: "Global Temp Anomaly",
      value: "+1.29 °C",
      subtext: "Above 1880-1910 baseline",
      badge: "Critical Threshold: 1.5°C",
      badgeType: "amber",
      icon: Flame,
      color: "var(--accent-amber)",
      data: TEMP_ANOMALY_DATA,
      dataKey: "anomaly",
      unit: "°C",
      description: "Global average surface warming relative to pre-industrial temperatures (1880–1910 baseline)."
    },
    {
      id: "sea",
      title: "Global Sea Level",
      value: "+114 mm",
      subtext: "+3.4 mm/year rise rate",
      badge: "Satellite Altimetry",
      badgeType: "cyan",
      icon: Waves,
      color: "var(--accent-cyan)",
      data: SEA_LEVEL_DATA,
      dataKey: "seaLevelMm",
      unit: "mm",
      description: "Observed global mean sea level rise driven by thermal expansion and ice sheet melt."
    },
    {
      id: "ice",
      title: "Arctic Ice Extent",
      value: "4.09 M km²",
      subtext: "-12.6% per decade",
      badge: "September Minimum",
      badgeType: "green",
      icon: Snowflake,
      color: "#38bdf8",
      data: ARCTIC_ICE_DATA,
      dataKey: "extent",
      unit: "M km²",
      description: "Minimum Arctic sea ice coverage measured by satellite imagery during late summer."
    }
  ];

  return (
    <section>
      <div className="section-title">
        <TrendingUp size={22} />
        <span>Earth's Vital Signs & Climate Indicators</span>
      </div>

      <div className="grid-vitals">
        {vitals.map((v) => {
          const Icon = v.icon;
          return (
            <div
              key={v.id}
              className="glass-card glass-card-interactive"
              style={{ padding: "1.25rem", cursor: "pointer" }}
              onClick={() => setActiveModalChart(v)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `rgba(255, 255, 255, 0.05)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: v.color,
                    border: `1px solid ${v.color}33`
                  }}
                >
                  <Icon size={22} />
                </div>
                <span className={`badge badge-${v.badgeType}`}>{v.badge}</span>
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>{v.title}</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", margin: "0.2rem 0" }}>{v.value}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{v.subtext}</span>
                <ChevronRight size={16} />
              </div>

              {/* Sparkline chart */}
              <div style={{ height: "40px", marginTop: "0.75rem" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={v.data}>
                    <defs>
                      <linearGradient id={`spark-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={v.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={v.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={v.dataKey} stroke={v.color} strokeWidth={2} fillOpacity={1} fill={`url(#spark-${v.id})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Chart Modal */}
      {activeModalChart && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(12px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
          onClick={() => setActiveModalChart(null)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "750px",
              padding: "2rem",
              position: "relative",
              border: `1px solid ${activeModalChart.color}66`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                color: "#fff",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={() => setActiveModalChart(null)}
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span className={`badge badge-${activeModalChart.badgeType}`}>{activeModalChart.badge}</span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>{activeModalChart.title} Trend</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              {activeModalChart.description}
            </p>

            <div style={{ height: "300px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeModalChart.data}>
                  <defs>
                    <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeModalChart.color} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={activeModalChart.color} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="var(--text-dim)" />
                  <YAxis stroke="var(--text-dim)" domain={["auto", "auto"]} unit={` ${activeModalChart.unit}`} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "10px",
                      color: "#fff"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeModalChart.dataKey}
                    stroke={activeModalChart.color}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#modalGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
