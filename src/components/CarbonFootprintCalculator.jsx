import React, { useState, useMemo } from "react";
import {
  calculateCarbonFootprint,
  BENCHMARKS,
  MITIGATION_ACTIONS
} from "../services/carbonFootprintApi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  Leaf,
  Car,
  Plane,
  Zap,
  Utensils,
  TreePine,
  CheckCircle2,
  Circle,
  Target,
  Sparkles,
  Info
} from "lucide-react";

export default function CarbonFootprintCalculator({ locationName }) {
  // Lifestyle state
  const [commuteKmWeek, setCommuteKmWeek] = useState(160);
  const [vehicleType, setVehicleType] = useState("petrol");
  const [shortFlights, setShortFlights] = useState(2);
  const [longFlights, setLongFlights] = useState(1);
  const [electricityKwh, setElectricityKwh] = useState(320);
  const [greenPercent, setGreenPercent] = useState(15);
  const [dietType, setDietType] = useState("average");
  const [consumptionLevel, setConsumptionLevel] = useState("medium");
  const [activeMitigations, setActiveMitigations] = useState(["act-meatless"]);

  const cityName = locationName ? locationName.split(",")[0] : "Your Location";

  const footprint = useMemo(() => {
    return calculateCarbonFootprint({
      commuteKmWeek,
      vehicleType,
      shortFlightsYear: shortFlights,
      longFlightsYear: longFlights,
      electricityKwhMonth: electricityKwh,
      greenEnergyPercent: greenPercent,
      dietType,
      consumptionLevel,
      activeMitigations
    });
  }, [
    commuteKmWeek,
    vehicleType,
    shortFlights,
    longFlights,
    electricityKwh,
    greenPercent,
    dietType,
    consumptionLevel,
    activeMitigations
  ]);

  const toggleMitigation = (id) => {
    setActiveMitigations((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const vehicles = [
    { id: "petrol", label: "Petrol", icon: "⛽" },
    { id: "hybrid", label: "Hybrid", icon: "🔋" },
    { id: "ev", label: "EV", icon: "⚡" },
    { id: "transit", label: "Transit", icon: "🚆" },
    { id: "bicycle", label: "Bike", icon: "🚲" }
  ];

  const diets = [
    { id: "highMeat", label: "Meat-Rich", icon: "🥩" },
    { id: "average", label: "Average", icon: "🍗" },
    { id: "pescatarian", label: "Pescatarian", icon: "🐟" },
    { id: "vegetarian", label: "Vegetarian", icon: "🥗" },
    { id: "vegan", label: "Vegan", icon: "🌱" }
  ];

  const chartData = footprint.breakdown.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color
  }));

  return (
    <div className="m3-card" style={{ padding: "1.35rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Leaf size={20} style={{ color: "var(--accent-green)" }} />
          <span>Personal Carbon Footprint & Offset Engine</span>
        </div>
        <span className={`badge badge-${footprint.badge}`} style={{ fontSize: "0.78rem" }}>
          {footprint.rating}
        </span>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
        Analyze personal greenhouse gas emissions (tCO₂e), benchmark against Paris Climate Accord limits, and build a personalized net-zero roadmap.
      </p>

      {/* Main Footprint Score & Target Benchmark Card (Skeuomorphic LCD Panel) */}
      <div
        className="sk-lcd-panel"
        style={{
          padding: "1.2rem",
          border: `1px solid ${footprint.color}44`,
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.6rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
              Total Annual Carbon Footprint
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: footprint.color, fontFamily: "var(--font-heading)" }}>
              {footprint.totalTons} <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500 }}>tons CO₂e/yr</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Tree Planting Offset Needed</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-green)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.3rem", fontFamily: "var(--font-heading)" }}>
              <TreePine size={18} />
              <span>{footprint.treesNeededToOffset} Trees/yr</span>
            </div>
            {footprint.totalSavingsTons > 0 && (
              <div style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", marginTop: "0.15rem", fontWeight: 600 }}>
                ✨ {footprint.totalSavingsTons} tons saved via actions
              </div>
            )}
          </div>
        </div>

        {/* Benchmark Visual Comparison Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: "0.35rem" }}>
            <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>🎯 Paris 2030 Limit: 2.0 t</span>
            <span>🌍 Global Avg: 4.5 t</span>
            <span>🇺🇸 US Avg: 14.5 t</span>
          </div>
          <div className="sk-meter-track" style={{ height: "10px", position: "relative" }}>
            {/* Target 2.0t Marker */}
            <div style={{ position: "absolute", left: "13.8%", top: 0, bottom: 0, width: "2px", background: "var(--accent-green)", zIndex: 5, boxShadow: "0 0 6px var(--accent-green)" }} />
            {/* User progress bar (scaled to 14.5t max) */}
            <div
              className="sk-meter-fill"
              style={{
                width: `${Math.min(100, (footprint.totalTons / 14.5) * 100)}%`,
                background: `linear-gradient(90deg, #10b981, #06b6d4, #f59e0b, #ef4444)`
              }}
            />
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
            {footprint.parisDelta <= 0
              ? `🎉 Outstanding! You are ${Math.abs(footprint.parisDelta)} tons below the Paris 2030 threshold.`
              : `⚠️ You are +${footprint.parisDelta} tons above the Paris 2030 climate safety target (2.0 t).`}
          </div>
        </div>
      </div>

      {/* Donut Chart & Category Breakdown Row */}
      <div className="sk-recessed-tile" style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)" }}>
          Emissions Category Breakdown
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.55rem", width: "100%" }}>
          {footprint.breakdown.map((item, idx) => (
            <div key={idx} style={{ background: "var(--sk-surface-btn)", padding: "0.65rem 0.75rem", borderRadius: "12px", border: "var(--sk-bezel-border)", boxShadow: "var(--sk-shadow-btn)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>{item.name}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: item.color, margin: "0.15rem 0", fontFamily: "var(--font-heading)" }}>
                {item.value} <span style={{ fontSize: "0.72rem", fontWeight: 500 }}>t</span>
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>
                {Math.round((item.value / footprint.totalTons) * 100) || 0}% share
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Pillar Interactive Configurator Grid (Tactile Instrument Tiles) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
        {/* Pillar 1: Mobility */}
        <div className="sk-recessed-tile" style={{ padding: "0.95rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Car size={16} style={{ color: "var(--accent-cyan)" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Daily Commute & Vehicle</span>
          </div>

          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
            {vehicles.map((v) => {
              const isSelected = vehicleType === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setVehicleType(v.id)}
                  style={{
                    background: isSelected ? "var(--sk-surface-primary-btn)" : "var(--sk-surface-btn)",
                    color: isSelected ? "#ffffff" : "var(--text-muted)",
                    border: isSelected ? "1px solid rgba(255, 255, 255, 0.3)" : "var(--sk-bezel-border)",
                    boxShadow: isSelected ? "0 3px 8px rgba(2, 132, 199, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)" : "var(--sk-shadow-btn)",
                    borderRadius: "8px",
                    padding: "0.3rem 0.5rem",
                    fontSize: "0.72rem",
                    fontWeight: isSelected ? 800 : 500,
                    cursor: "pointer",
                    transition: "all 0.16s ease"
                  }}
                >
                  {v.icon} {v.label}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
            <span>Distance:</span>
            <strong style={{ color: "var(--text-main)" }}>{commuteKmWeek} km/wk</strong>
          </div>
          <input
            type="range"
            min="0"
            max="600"
            step="20"
            value={commuteKmWeek}
            onChange={(e) => setCommuteKmWeek(parseInt(e.target.value, 10))}
          />
        </div>

        {/* Pillar 2: Flights & Aviation */}
        <div className="sk-recessed-tile" style={{ padding: "0.95rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Plane size={16} style={{ color: "#38bdf8" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Annual Flights</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Short (&lt;3h):</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <button
                onClick={() => setShortFlights(Math.max(0, shortFlights - 1))}
                style={{ width: "26px", height: "26px", borderRadius: "8px", background: "var(--sk-surface-btn)", border: "var(--sk-bezel-border)", boxShadow: "var(--sk-shadow-btn)", color: "var(--text-main)", cursor: "pointer", fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ fontWeight: 800, fontSize: "0.85rem", width: "22px", textAlign: "center", fontFamily: "var(--font-heading)" }}>{shortFlights}</span>
              <button
                onClick={() => setShortFlights(shortFlights + 1)}
                style={{ width: "26px", height: "26px", borderRadius: "8px", background: "var(--sk-surface-btn)", border: "var(--sk-bezel-border)", boxShadow: "var(--sk-shadow-btn)", color: "var(--text-main)", cursor: "pointer", fontWeight: 700 }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Long (&gt;3h):</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <button
                onClick={() => setLongFlights(Math.max(0, longFlights - 1))}
                style={{ width: "26px", height: "26px", borderRadius: "8px", background: "var(--sk-surface-btn)", border: "var(--sk-bezel-border)", boxShadow: "var(--sk-shadow-btn)", color: "var(--text-main)", cursor: "pointer", fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ fontWeight: 800, fontSize: "0.85rem", width: "22px", textAlign: "center", fontFamily: "var(--font-heading)" }}>{longFlights}</span>
              <button
                onClick={() => setLongFlights(longFlights + 1)}
                style={{ width: "26px", height: "26px", borderRadius: "8px", background: "var(--sk-surface-btn)", border: "var(--sk-bezel-border)", boxShadow: "var(--sk-shadow-btn)", color: "var(--text-main)", cursor: "pointer", fontWeight: 700 }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Pillar 3: Home Energy */}
        <div className="sk-recessed-tile" style={{ padding: "0.95rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={16} style={{ color: "var(--accent-amber)" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Home Electricity</span>
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
            <span>Monthly:</span>
            <strong style={{ color: "var(--text-main)" }}>{electricityKwh} kWh/mo</strong>
          </div>
          <input
            type="range"
            min="50"
            max="1000"
            step="25"
            value={electricityKwh}
            onChange={(e) => setElectricityKwh(parseInt(e.target.value, 10))}
          />

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
            <span>Green Mix:</span>
            <strong style={{ color: "var(--accent-green)" }}>{greenPercent}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={greenPercent}
            onChange={(e) => setGreenPercent(parseInt(e.target.value, 10))}
          />
        </div>

        {/* Pillar 4: Diet Profile */}
        <div className="sk-recessed-tile" style={{ padding: "0.95rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Utensils size={16} style={{ color: "#34d399" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Diet & Nutrition Profile</span>
          </div>

          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
            {diets.map((d) => {
              const isSelected = dietType === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDietType(d.id)}
                  style={{
                    background: isSelected ? "var(--sk-surface-primary-btn)" : "var(--sk-surface-btn)",
                    color: isSelected ? "#ffffff" : "var(--text-muted)",
                    border: isSelected ? "1px solid rgba(255, 255, 255, 0.3)" : "var(--sk-bezel-border)",
                    boxShadow: isSelected ? "0 3px 8px rgba(2, 132, 199, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)" : "var(--sk-shadow-btn)",
                    borderRadius: "8px",
                    padding: "0.3rem 0.5rem",
                    fontSize: "0.72rem",
                    fontWeight: isSelected ? 800 : 500,
                    cursor: "pointer",
                    transition: "all 0.16s ease"
                  }}
                >
                  {d.icon} {d.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actionable Net-Zero Reduction Checklist */}
      <div className="sk-recessed-tile" style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Target size={16} style={{ color: "var(--accent-cyan)" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
              Actionable Net-Zero Reduction Milestones
            </span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", fontWeight: 600 }}>Click to toggle impact</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", width: "100%" }}>
          {MITIGATION_ACTIONS.map((action) => {
            const isActive = activeMitigations.includes(action.id);
            return (
              <div
                key={action.id}
                onClick={() => toggleMitigation(action.id)}
                style={{
                  background: isActive ? "linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.08) 100%)" : "var(--sk-surface-btn)",
                  border: isActive ? "1px solid rgba(16, 185, 129, 0.45)" : "var(--sk-bezel-border)",
                  boxShadow: isActive ? "0 3px 8px rgba(16, 185, 129, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)" : "var(--sk-shadow-btn)",
                  padding: "0.65rem 0.95rem",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.18s cubic-bezier(0.2, 0, 0, 1)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {isActive ? (
                    <CheckCircle2 size={16} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
                  ) : (
                    <Circle size={16} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)" }}>{action.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{action.description}</div>
                  </div>
                </div>

                <span className="badge badge-green" style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", flexShrink: 0 }}>
                  -{action.savingsTons} t/yr
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
