import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Flame } from "lucide-react";

// Rounded period means of the global land-ocean temperature index against the
// 1951-1980 baseline. These are global, not local, so the panel says so.
const ERA_MEANS = [
  { era: "1950-1980", anomaly: 0.0 },
  { era: "1981-2000", anomaly: 0.4 },
  { era: "2001-2015", anomaly: 0.8 },
  { era: "2016-2024", anomaly: 1.2 },
  { era: "2025-2026", anomaly: 1.3 }
];

export default function HistoricalAnomalyChart() {
  return (
    <div className="m3-card" style={{ padding: "1.2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.85rem" }}>
        <div>
          <div className="section-title" style={{ margin: 0 }}>
            <Flame size={18} style={{ color: "var(--accent-amber)" }} />
            <span>Global warming trajectory</span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
            Period averages of the global land-ocean temperature index, against the 1951-1980 baseline.
          </p>
        </div>
        <span className="badge badge-amber">+1.3 °C latest period</span>
      </div>

      <div className="sk-lcd-panel" style={{ height: "200px", width: "100%", padding: "0.85rem 0.6rem 0.2rem 0" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ERA_MEANS} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <XAxis dataKey="era" stroke="var(--text-dim)" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis stroke="var(--text-dim)" unit="°C" tick={{ fontSize: 11 }} tickLine={false} width={44} />
            <Tooltip
              contentStyle={{
                background: "var(--sk-surface-elevated)",
                border: "var(--sk-bezel-border)",
                borderRadius: "8px",
                color: "var(--text-main)",
                boxShadow: "var(--md-elevation-3)"
              }}
              formatter={(val) => [`${Number(val).toFixed(1)} °C`, "Anomaly"]}
            />
            <Bar dataKey="anomaly" radius={[4, 4, 0, 0]} maxBarSize={56}>
              {ERA_MEANS.map((entry, index) => (
                <Cell
                  key={entry.era}
                  fill={index === ERA_MEANS.length - 1 ? "var(--accent-red)" : "var(--accent-cyan)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p style={{ fontSize: "11px", color: "var(--text-dim)", margin: "0.6rem 0 0" }}>
        Source: NASA GISTEMP global land-ocean temperature index, rounded period means.
      </p>
    </div>
  );
}
