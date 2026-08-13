import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  getHistoricalClimateTrajectory,
  getHistoricalComparisonInsight,
  HISTORICAL_CO2_SERIES
} from "../services/historicalClimateApi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
  ReferenceLine
} from "recharts";
import {
  History,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Thermometer,
  Flame,
  CloudRain,
  Wind,
  TrendingUp,
  Sparkles
} from "lucide-react";

export default function HistoricalTimeMachine({
  locationName,
  lat,
  lon,
  currentTemp = 25,
  unit = "C"
}) {
  const [selectedYear, setSelectedYear] = useState(1970);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef(null);

  const cityName = locationName ? locationName.split(",")[0] : "Selected Location";

  // Generate 75-year trajectory data for this location
  const trajectory = useMemo(() => {
    return getHistoricalClimateTrajectory(lat || 35.6, lon || 139.6, currentTemp || 25);
  }, [lat, lon, currentTemp]);

  const years = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2026];

  // Current selected year data point & present baseline
  const selectedData = useMemo(() => {
    return trajectory.find((d) => d.year === selectedYear) || trajectory[0];
  }, [trajectory, selectedYear]);

  const presentData = useMemo(() => {
    return trajectory[trajectory.length - 1];
  }, [trajectory]);

  const insight = useMemo(() => {
    return getHistoricalComparisonInsight(cityName, selectedData, presentData);
  }, [cityName, selectedData, presentData]);

  // Handle Play Time-Lapse Auto-advancer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setSelectedYear((prev) => {
          const currentIdx = years.indexOf(prev);
          if (currentIdx < years.length - 1) {
            return years[currentIdx + 1];
          } else {
            setIsPlaying(false);
            return years[0];
          }
        });
      }, 1200);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, years]);

  const displayTemp = (tempC) => {
    if (tempC == null) return "--";
    if (unit === "F") return ((tempC * 9) / 5 + 32).toFixed(1);
    return tempC.toFixed(1);
  };

  const chartData = useMemo(() => {
    return trajectory.map((d) => ({
      year: d.year.toString(),
      temp: unit === "F" ? parseFloat(((d.temp * 9) / 5 + 32).toFixed(1)) : d.temp,
      anomaly: d.anomaly,
      co2: d.co2,
      heatwaveDays: d.heatwaveDays
    }));
  }, [trajectory, unit]);

  return (
    <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <History size={20} style={{ color: "var(--accent-cyan)" }} />
          <span>Historical Climate Time Machine (1950 – 2026)</span>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: "0.8rem", padding: "0.3rem 0.75rem" }}>
          Year {selectedYear}
        </span>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
        Step through 75+ years of climate shifts for <strong>{cityName}</strong> to visualize thermal anomalies, atmospheric greenhouse gas escalation, and heatwave trends.
      </p>

      {/* Timeline Controls & Scrubber */}
      <div
        style={{
          background: "var(--bg-inner)",
          padding: "1rem 1.1rem",
          borderRadius: "18px",
          border: "1px solid var(--border-light)",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem"
        }}
      >
        {/* Playback Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                background: isPlaying ? "rgba(239, 68, 68, 0.2)" : "var(--accent-cyan)",
                border: isPlaying ? "1px solid var(--accent-red)" : "none",
                color: isPlaying ? "var(--accent-red)" : "#000",
                padding: "0.4rem 0.85rem",
                borderRadius: "20px",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? "Pause Time-Lapse" : "Play Time-Lapse"}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSelectedYear(1950);
              }}
              className="locate-btn"
              style={{ padding: "0.4rem 0.65rem" }}
              title="Reset to 1950"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSelectedYear(2026);
              }}
              className="locate-btn"
              style={{ padding: "0.4rem 0.65rem" }}
              title="Jump to 2026 Present"
            >
              <FastForward size={14} />
            </button>
          </div>

          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
            Decade: {selectedYear}s Era
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="0"
          max={years.length - 1}
          step="1"
          value={years.indexOf(selectedYear)}
          onChange={(e) => {
            setIsPlaying(false);
            setSelectedYear(years[parseInt(e.target.value, 10)]);
          }}
          style={{
            width: "100%",
            accentColor: "var(--accent-cyan)",
            cursor: "pointer",
            height: "6px"
          }}
        />

        {/* Decade Step Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.2rem", overflowX: "auto" }}>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                setIsPlaying(false);
                setSelectedYear(yr);
              }}
              style={{
                background: selectedYear === yr ? "var(--accent-cyan)" : "transparent",
                color: selectedYear === yr ? "#000" : "var(--text-muted)",
                border: selectedYear === yr ? "1px solid var(--accent-cyan)" : "1px solid transparent",
                borderRadius: "10px",
                padding: "0.25rem 0.45rem",
                fontSize: "0.72rem",
                fontWeight: selectedYear === yr ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Metric Comparative Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {/* Mean Temperature */}
        <div style={{ background: "var(--bg-inner)", padding: "0.85rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <Thermometer size={16} style={{ color: "var(--accent-cyan)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Estimated Mean Temp</span>
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
            {displayTemp(selectedData.temp)}°{unit}
          </div>
          <div style={{ fontSize: "0.72rem", color: selectedData.year === 2026 ? "var(--accent-green)" : "var(--accent-amber)", marginTop: "0.2rem" }}>
            {selectedData.year === 2026 ? "Current baseline" : `Shift: +${insight.tempDelta}°${unit} vs 2026`}
          </div>
        </div>

        {/* Atmospheric CO2 */}
        <div style={{ background: "var(--bg-inner)", padding: "0.85rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <Wind size={16} style={{ color: "var(--accent-purple)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Global CO₂ Level</span>
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--accent-purple)" }}>
            {selectedData.co2} ppm
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            {selectedData.year === 2026 ? "Highest in human history" : `+${insight.co2Delta} ppm added by 2026`}
          </div>
        </div>

        {/* Extreme Heatwave Days */}
        <div style={{ background: "var(--bg-inner)", padding: "0.85rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <Flame size={16} style={{ color: "var(--accent-red)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Annual Heatwave Days</span>
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
            {selectedData.heatwaveDays} days/yr
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            {selectedData.year === 2026 ? "High thermal frequency" : `+${insight.heatDelta} extra heat days today`}
          </div>
        </div>

        {/* Precipitation Anomaly */}
        <div style={{ background: "var(--bg-inner)", padding: "0.85rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <CloudRain size={16} style={{ color: "#38bdf8" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Moisture / Precip Shift</span>
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
            {selectedData.precipDeltaPercent}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            Atmospheric moisture capacity shift
          </div>
        </div>
      </div>

      {/* 75-Year Trajectory Chart */}
      <div
        style={{
          background: "var(--bg-inner)",
          padding: "1rem",
          borderRadius: "16px",
          border: "1px solid var(--border-light)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)" }}>
            75-Year Thermal Trajectory (1950 – 2026)
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", fontFamily: "monospace" }}>
            Dot = {selectedYear}
          </span>
        </div>

        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="timeMachineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="var(--text-dim)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card-hover)",
                  borderColor: "var(--border-light)",
                  borderRadius: "10px",
                  fontSize: "0.75rem",
                  color: "var(--text-main)"
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name={`Temp (°${unit})`}
                stroke="var(--accent-cyan)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#timeMachineGrad)"
              />
              <ReferenceDot
                x={selectedYear.toString()}
                y={unit === "F" ? parseFloat(((selectedData.temp * 9) / 5 + 32).toFixed(1)) : selectedData.temp}
                r={6}
                fill="var(--accent-amber)"
                stroke="#fff"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Natural Language Diagnostic Insight Summary */}
      <div
        style={{
          padding: "0.85rem 1rem",
          borderRadius: "14px",
          background: "rgba(6, 182, 212, 0.12)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          fontSize: "0.8rem",
          color: "var(--text-main)",
          lineHeight: 1.5
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: "0.25rem" }}>
          <Sparkles size={15} />
          <span>Historical Era Diagnostic Analysis</span>
        </div>
        {insight.summary}
      </div>
    </div>
  );
}
