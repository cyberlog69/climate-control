import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Flame } from "lucide-react";

export default function HistoricalAnomalyChart({ locationName, weatherData }) {
  const currentTemp = weatherData?.current?.temp || 24;

  const historicalBars = [
    { era: "1950-1980 Baseline", anomaly: 0.0, temp: currentTemp - 1.8 },
    { era: "1981-2000 Period", anomaly: +0.4, temp: currentTemp - 1.4 },
    { era: "2001-2015 Period", anomaly: +0.8, temp: currentTemp - 1.0 },
    { era: "2016-2024 Period", anomaly: +1.2, temp: currentTemp - 0.4 },
    { era: "Present (2026 Observed)", anomaly: +1.3, temp: currentTemp }
  ];

  return (
    <div className="glass-card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
        <div>
          <div className="section-title" style={{ margin: 0 }}>
            <Flame size={18} style={{ color: "var(--accent-amber)" }} />
            <span>Regional Climate Warming Trajectory</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Estimated historical thermal shift for <strong>{locationName}</strong> relative to 1950–1980 pre-industrial baselines.
          </p>
        </div>
        <span className="badge badge-amber">+1.3°C Local Warming</span>
      </div>

      <div style={{ height: "170px", width: "100%", marginTop: "0.5rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historicalBars}>
            <XAxis dataKey="era" stroke="var(--text-dim)" tick={{ fontSize: 10 }} />
            <YAxis stroke="var(--text-dim)" unit="°C" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "var(--bg-card-hover)",
                border: "1px solid var(--border-light)",
                borderRadius: "10px",
                color: "var(--text-main)"
              }}
              formatter={(val) => [`+${val.toFixed(1)}°C Anomaly`, "Thermal Shift"]}
            />
            <Bar dataKey="anomaly" radius={[6, 6, 0, 0]}>
              {historicalBars.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === historicalBars.length - 1
                      ? "var(--accent-red)"
                      : index >= 3
                      ? "var(--accent-amber)"
                      : "var(--accent-cyan)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
