import React, { useState } from "react";
import { Sliders, ShieldAlert, Waves, Flame, Droplets, Leaf, Info, ChevronRight } from "lucide-react";

export default function ClimateImpactSimulator({ locationName, lat, lon }) {
  const [warmingDegree, setWarmingDegree] = useState(2.0); // 1.5, 2.0, 3.0, 4.0

  // Calculate local vulnerability factors based on latitude & selected warming degree
  const isCoastal = Math.abs(lat) < 65 && (Math.abs(lon) > 100 || Math.abs(lon) < 20 || Math.abs(lat) < 15);
  const isArctic = Math.abs(lat) >= 60;

  const seaLevelRiseMeters = (warmingDegree * 0.38 + (isCoastal ? 0.25 : 0.1)).toFixed(2);
  const extraHeatwaveDays = Math.round(warmingDegree * 16 + (isArctic ? 5 : 12));
  const droughtRiskPercent = Math.round(warmingDegree * 18 + 10);
  const cropLossPercent = Math.round(warmingDegree * 7.5 + 5);

  const getScenarioBadge = (deg) => {
    if (deg <= 1.5) return { label: "Paris Target (1.5°C)", color: "var(--accent-green)", badge: "green" };
    if (deg <= 2.0) return { label: "Critical Limit (2.0°C)", color: "var(--accent-amber)", badge: "amber" };
    if (deg <= 3.0) return { label: "Severe Risk (3.0°C)", color: "var(--accent-red)", badge: "red" };
    return { label: "Extreme Trajectory (4.0°C)", color: "var(--accent-purple)", badge: "red" };
  };

  const scenario = getScenarioBadge(warmingDegree);

  return (
    <div className="glass-card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Sliders size={18} style={{ color: "var(--accent-purple)" }} />
          <span>AI Climate Impact Scenario Simulator</span>
        </div>
        <span className={`badge badge-${scenario.badge}`}>{scenario.label}</span>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
        Simulate future global warming scenarios and project local environmental stress for <strong>{locationName}</strong>.
      </p>

      {/* Warming Degree Slider */}
      <div
        style={{
          background: "var(--bg-inner)",
          padding: "1rem",
          borderRadius: "16px",
          border: "1px solid var(--border-light)",
          marginBottom: "1rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Global Warming Target Scenario:</span>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: scenario.color }}>+{warmingDegree.toFixed(1)}°C</span>
        </div>

        <input
          type="range"
          min="1.5"
          max="4.0"
          step="0.5"
          value={warmingDegree}
          onChange={(e) => setWarmingDegree(parseFloat(e.target.value))}
          style={{
            width: "100%",
            accentColor: scenario.color,
            cursor: "pointer",
            height: "6px"
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.4rem" }}>
          <span>+1.5°C</span>
          <span>+2.0°C</span>
          <span>+3.0°C</span>
          <span>+4.0°C</span>
        </div>
      </div>

      {/* Impact Indicators Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
        {/* Sea Level Rise */}
        <div style={{ background: "var(--bg-inner)", padding: "0.75rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <Waves size={16} style={{ color: "#38bdf8" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Sea Level Inundation</span>
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)" }}>+{seaLevelRiseMeters} m</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            {isCoastal ? "⚠️ High coastal surge threat" : "Moderate river basin impact"}
          </div>
        </div>

        {/* Heatwave Surge */}
        <div style={{ background: "var(--bg-inner)", padding: "0.75rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <Flame size={16} style={{ color: "var(--accent-amber)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Extra Heatwave Days</span>
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)" }}>+{extraHeatwaveDays} days/yr</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>Days exceeding 35°C threshold</div>
        </div>

        {/* Drought & Water Stress */}
        <div style={{ background: "var(--bg-inner)", padding: "0.75rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <Droplets size={16} style={{ color: "var(--accent-cyan)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Drought Stress Surge</span>
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)" }}>+{droughtRiskPercent}%</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>Water availability deficit</div>
        </div>

        {/* Crop Yield Drop */}
        <div style={{ background: "var(--bg-inner)", padding: "0.75rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <Leaf size={16} style={{ color: "var(--accent-red)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Agricultural Reduction</span>
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)" }}>-{cropLossPercent}%</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>Staple crop yield decline</div>
        </div>
      </div>
    </div>
  );
}
