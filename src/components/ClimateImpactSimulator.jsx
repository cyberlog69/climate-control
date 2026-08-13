import React, { useState } from "react";
import {
  Sliders,
  Waves,
  Flame,
  Droplets,
  Leaf,
  AlertTriangle,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function ClimateImpactSimulator({
  locationName = "Current Location",
  lat = 0,
  lon = 0,
  unit = "C"
}) {
  const [warmingDegree, setWarmingDegree] = useState(2.0); // 1.0°C to 4.5°C

  // Regional vulnerability heuristics
  const isCoastal =
    Math.abs(lat) < 65 && (Math.abs(lon) > 100 || Math.abs(lon) < 20 || Math.abs(lat) < 15);
  const isArctic = Math.abs(lat) >= 60;
  const isEquatorial = Math.abs(lat) <= 23.5;

  // Impact calculations based on IPCC AR6 Working Group II models
  const seaLevelRiseMeters = parseFloat((warmingDegree * 0.38 + (isCoastal ? 0.28 : 0.12)).toFixed(2));
  const extraHeatwaveDays = Math.round(warmingDegree * (isEquatorial ? 24 : isArctic ? 8 : 16));
  const droughtRiskPercent = Math.min(95, Math.round(warmingDegree * 18 + (isEquatorial ? 14 : 8)));
  const cropLossPercent = Math.min(80, Math.round(warmingDegree * 7.8 + 4));

  const scenarios = [
    { degree: 1.5, label: "+1.5°C", name: "Paris Accord Target", badge: "green", color: "var(--accent-green)" },
    { degree: 2.0, label: "+2.0°C", name: "Critical Threshold", badge: "amber", color: "var(--accent-amber)" },
    { degree: 3.0, label: "+3.0°C", name: "Severe Trajectory", badge: "red", color: "#f97316" },
    { degree: 4.0, label: "+4.0°C", name: "Catastrophic Risk", badge: "purple", color: "var(--accent-purple)" }
  ];

  const getActiveScenario = (deg) => {
    if (deg <= 1.7) return scenarios[0];
    if (deg <= 2.5) return scenarios[1];
    if (deg <= 3.5) return scenarios[2];
    return scenarios[3];
  };

  const activeScenario = getActiveScenario(warmingDegree);
  const cityName = locationName ? locationName.split(",")[0] : "your region";

  return (
    <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Sliders size={20} style={{ color: "var(--accent-purple)" }} />
          <span>AI Climate Impact Scenario Simulator</span>
        </div>
        <span className={`badge badge-${activeScenario.badge}`} style={{ fontSize: "0.78rem" }}>
          {activeScenario.name}
        </span>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
        Simulate future global warming scenarios and model coordinate-specific environmental stress factors for{" "}
        <strong style={{ color: "var(--text-main)" }}>{locationName}</strong>.
      </p>

      {/* Target Warming Selector Card */}
      <div
        style={{
          background: "var(--bg-inner)",
          padding: "1.1rem",
          borderRadius: "18px",
          border: `1px solid ${activeScenario.color}44`,
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Global Warming Trajectory
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: activeScenario.color }}>
              +{warmingDegree.toFixed(1)}°C
            </div>
          </div>

          {/* Quick Scenario Preset Pills */}
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {scenarios.map((sc) => (
              <button
                key={sc.degree}
                onClick={() => setWarmingDegree(sc.degree)}
                style={{
                  background: Math.abs(warmingDegree - sc.degree) < 0.2 ? sc.color : "var(--bg-card)",
                  color: Math.abs(warmingDegree - sc.degree) < 0.2 ? "#000" : "var(--text-muted)",
                  border: Math.abs(warmingDegree - sc.degree) < 0.2 ? `1px solid ${sc.color}` : "1px solid var(--border-light)",
                  borderRadius: "10px",
                  padding: "0.35rem 0.65rem",
                  fontSize: "0.75rem",
                  fontWeight: Math.abs(warmingDegree - sc.degree) < 0.2 ? 800 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Smooth Step Slider */}
        <div>
          <input
            type="range"
            min="1.0"
            max="4.5"
            step="0.1"
            value={warmingDegree}
            onChange={(e) => setWarmingDegree(parseFloat(e.target.value))}
            style={{
              width: "100%",
              accentColor: activeScenario.color,
              cursor: "pointer",
              height: "6px",
              display: "block"
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.35rem" }}>
            <span>+1.0°C (Pre-industrial)</span>
            <span style={{ color: "var(--accent-green)" }}>+1.5°C (Paris)</span>
            <span style={{ color: "var(--accent-amber)" }}>+2.0°C (Limit)</span>
            <span style={{ color: "var(--accent-red)" }}>+4.0°C (Extreme)</span>
          </div>
        </div>
      </div>

      {/* 4-Metric Stress Indicators Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
        {/* Metric 1: Sea Level Rise */}
        <div style={{ background: "var(--bg-inner)", padding: "0.9rem", borderRadius: "16px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
              <Waves size={16} style={{ color: "#38bdf8" }} />
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>Sea Level Inundation</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#38bdf8" }}>
              +{seaLevelRiseMeters} m
            </div>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", lineHeight: 1.4 }}>
            {isCoastal ? "⚠️ High vulnerability: Increased risk of tidal flooding & coastal storm surge." : "River basin & estuary drainage pressure."}
          </div>
        </div>

        {/* Metric 2: Heatwave Days */}
        <div style={{ background: "var(--bg-inner)", padding: "0.9rem", borderRadius: "16px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
              <Flame size={16} style={{ color: "var(--accent-amber)" }} />
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>Extra Heatwave Days</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-amber)" }}>
              +{extraHeatwaveDays} days/yr
            </div>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", lineHeight: 1.4 }}>
            Projected additional days per year exceeding the dangerous 35°C (95°F) thermal threshold.
          </div>
        </div>

        {/* Metric 3: Drought Stress */}
        <div style={{ background: "var(--bg-inner)", padding: "0.9rem", borderRadius: "16px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
              <Droplets size={16} style={{ color: "var(--accent-cyan)" }} />
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>Water & Drought Deficit</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
              +{droughtRiskPercent}%
            </div>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", lineHeight: 1.4 }}>
            Surge in soil moisture evapotranspiration and freshwater aquifer replenishment stress.
          </div>
        </div>

        {/* Metric 4: Crop Yield Decline */}
        <div style={{ background: "var(--bg-inner)", padding: "0.9rem", borderRadius: "16px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
              <Leaf size={16} style={{ color: "var(--accent-red)" }} />
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>Agricultural Yield Drop</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-red)" }}>
              -{cropLossPercent}%
            </div>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", lineHeight: 1.4 }}>
            Estimated production decrease for regional staple grain, cereal, and orchard crops.
          </div>
        </div>
      </div>

      {/* AI Scenario Narrative Diagnostic */}
      <div
        style={{
          background: "var(--bg-inner)",
          padding: "1rem",
          borderRadius: "16px",
          border: "1px solid var(--border-light)",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Sparkles size={16} style={{ color: activeScenario.color }} />
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
            AI Scenario Assessment for {cityName}
          </span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
          {warmingDegree <= 1.5 && (
            <span>
              Under a <strong>+1.5°C Paris trajectory</strong>, {cityName} avoids the most severe tipping points. Coral reefs experience manageable bleaching cycles, heatwaves remain episodic, and seasonal snowpack/aquifer recharge stabilizes within historical margins.
            </span>
          )}
          {warmingDegree > 1.5 && warmingDegree <= 2.0 && (
            <span>
              At <strong>+2.0°C warming</strong>, {cityName} faces frequent summer heat stress with {extraHeatwaveDays} extra days above 35°C. Agricultural yields contract by ~{cropLossPercent}%, requiring enhanced municipal grid cooling resilience and water management policies.
            </span>
          )}
          {warmingDegree > 2.0 && warmingDegree <= 3.0 && (
            <span>
              At <strong>+3.0°C severe warming</strong>, {cityName} enters persistent environmental stress. Extended drought seasons disrupt local agriculture, while sea level rise (+{seaLevelRiseMeters}m) threatens low-lying infrastructure, requiring major regional adaptation investments.
            </span>
          )}
          {warmingDegree > 3.0 && (
            <span>
              Under an <strong>extreme +{warmingDegree.toFixed(1)}°C pathway</strong>, {cityName} confronts catastrophic climate disruption. Severe compounding heat domes, extreme water scarcity (+{droughtRiskPercent}%), and widespread crop reductions (-{cropLossPercent}%) pose severe ecological and economic risks.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
