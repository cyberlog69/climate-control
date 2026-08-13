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
  ShoppingBag,
  TreePine,
  CheckCircle2,
  Circle,
  TrendingDown,
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
    { id: "petrol", label: "Petrol / Diesel", icon: "⛽" },
    { id: "hybrid", label: "Hybrid", icon: "🔋" },
    { id: "ev", label: "Electric EV", icon: "⚡" },
    { id: "transit", label: "Public Transit", icon: "🚆" },
    { id: "bicycle", label: "Bike / Walk", icon: "🚲" }
  ];

  const diets = [
    { id: "highMeat", label: "High Meat", icon: "🥩" },
    { id: "average", label: "Average", icon: "🍗" },
    { id: "pescatarian", label: "Pescatarian", icon: "🐟" },
    { id: "vegetarian", label: "Vegetarian", icon: "🥗" },
    { id: "vegan", label: "Vegan", icon: "🌱" }
  ];

  return (
    <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
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
        Calculate your annual greenhouse gas emissions ($t\text{CO}_2\text{e}$), benchmark against Paris Climate Accord limits, and build a personalized net-zero roadmap.
      </p>

      {/* Main Footprint Score & Target Benchmark Card */}
      <div
        style={{
          background: "var(--bg-inner)",
          padding: "1.1rem",
          borderRadius: "18px",
          border: `1px solid ${footprint.color}44`,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Total Annual Carbon Footprint
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: footprint.color }}>
              {footprint.totalTons} <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500 }}>tons CO₂e/yr</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tree Planting Offset Needed</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-green)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.3rem" }}>
              <TreePine size={18} />
              <span>{footprint.treesNeededToOffset} Trees/yr</span>
            </div>
            {footprint.totalSavingsTons > 0 && (
              <div style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", marginTop: "0.15rem" }}>
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
          <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "6px", position: "relative", overflow: "hidden" }}>
            {/* Target 2.0t Marker */}
            <div style={{ position: "absolute", left: "13.8%", top: 0, bottom: 0, width: "2px", background: "var(--accent-green)", zIndex: 5 }} />
            {/* User progress bar (scaled to 14.5t max) */}
            <div
              style={{
                width: `${Math.min(100, (footprint.totalTons / 14.5) * 100)}%`,
                height: "100%",
                background: `linear-gradient(90deg, #10b981, #06b6d4, #f59e0b, #ef4444)`,
                transition: "width 0.3s ease"
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

      {/* 4-Pillar Interactive Configurator */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
        {/* Pillar 1: Mobility */}
        <div style={{ background: "var(--bg-inner)", padding: "0.9rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
            <Car size={16} style={{ color: "var(--accent-cyan)" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Daily Commute & Vehicle</span>
          </div>

          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicleType(v.id)}
                style={{
                  background: vehicleType === v.id ? "var(--accent-cyan)" : "var(--bg-card)",
                  color: vehicleType === v.id ? "#000" : "var(--text-muted)",
                  border: vehicleType === v.id ? "1px solid var(--accent-cyan)" : "1px solid var(--border-light)",
                  borderRadius: "8px",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.72rem",
                  fontWeight: vehicleType === v.id ? 700 : 500,
                  cursor: "pointer"
                }}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
            <span>Weekly Commute Distance:</span>
            <strong style={{ color: "var(--text-main)" }}>{commuteKmWeek} km/wk</strong>
          </div>
          <input
            type="range"
            min="0"
            max="600"
            step="20"
            value={commuteKmWeek}
            onChange={(e) => setCommuteKmWeek(parseInt(e.target.value, 10))}
            style={{ width: "100%", accentColor: "var(--accent-cyan)", cursor: "pointer", height: "4px" }}
          />
        </div>

        {/* Pillar 2: Flights & Aviation */}
        <div style={{ background: "var(--bg-inner)", padding: "0.9rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
            <Plane size={16} style={{ color: "#38bdf8" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Annual Flights</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Short Flights (&lt;3 hrs):</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  onClick={() => setShortFlights(Math.max(0, shortFlights - 1))}
                  style={{ width: "24px", height: "24px", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-main)", cursor: "pointer" }}
                >
                  -
                </button>
                <span style={{ fontWeight: 700, fontSize: "0.85rem", width: "18px", textAlign: "center" }}>{shortFlights}</span>
                <button
                  onClick={() => setShortFlights(shortFlights + 1)}
                  style={{ width: "24px", height: "24px", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-main)", cursor: "pointer" }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Long Flights (&gt;3 hrs):</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  onClick={() => setLongFlights(Math.max(0, longFlights - 1))}
                  style={{ width: "24px", height: "24px", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-main)", cursor: "pointer" }}
                >
                  -
                </button>
                <span style={{ fontWeight: 700, fontSize: "0.85rem", width: "18px", textAlign: "center" }}>{longFlights}</span>
                <button
                  onClick={() => setLongFlights(longFlights + 1)}
                  style={{ width: "24px", height: "24px", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-main)", cursor: "pointer" }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Home Energy */}
        <div style={{ background: "var(--bg-inner)", padding: "0.9rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <Zap size={16} style={{ color: "var(--accent-amber)" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Home Electricity</span>
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
            <span>Monthly Usage:</span>
            <strong style={{ color: "var(--text-main)" }}>{electricityKwh} kWh/mo</strong>
          </div>
          <input
            type="range"
            min="50"
            max="1000"
            step="25"
            value={electricityKwh}
            onChange={(e) => setElectricityKwh(parseInt(e.target.value, 10))}
            style={{ width: "100%", accentColor: "var(--accent-amber)", cursor: "pointer", height: "4px", marginBottom: "0.5rem" }}
          />

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
            <span>Green Energy Mix:</span>
            <strong style={{ color: "var(--accent-green)" }}>{greenPercent}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={greenPercent}
            onChange={(e) => setGreenPercent(parseInt(e.target.value, 10))}
            style={{ width: "100%", accentColor: "var(--accent-green)", cursor: "pointer", height: "4px" }}
          />
        </div>

        {/* Pillar 4: Diet Profile */}
        <div style={{ background: "var(--bg-inner)", padding: "0.9rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <Utensils size={16} style={{ color: "#34d399" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Diet & Nutrition Profile</span>
          </div>

          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
            {diets.map((d) => (
              <button
                key={d.id}
                onClick={() => setDietType(d.id)}
                style={{
                  background: dietType === d.id ? "var(--accent-green)" : "var(--bg-card)",
                  color: dietType === d.id ? "#000" : "var(--text-muted)",
                  border: dietType === d.id ? "1px solid var(--accent-green)" : "1px solid var(--border-light)",
                  borderRadius: "8px",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.72rem",
                  fontWeight: dietType === d.id ? 700 : 500,
                  cursor: "pointer"
                }}
              >
                {d.icon} {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Grid */}
      <div style={{ background: "var(--bg-inner)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.6rem" }}>
          Emissions Category Breakdown
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.6rem" }}>
          {footprint.breakdown.map((item, idx) => (
            <div key={idx} style={{ background: "var(--bg-card)", padding: "0.6rem", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.name}</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: item.color, margin: "0.15rem 0" }}>
                {item.value} <span style={{ fontSize: "0.7rem", fontWeight: 500 }}>t</span>
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>
                {Math.round((item.value / footprint.totalTons) * 100) || 0}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Net-Zero Reduction Checklist */}
      <div style={{ background: "var(--bg-inner)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Target size={16} style={{ color: "var(--accent-cyan)" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
              Actionable Net-Zero Reduction Milestones
            </span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--accent-cyan)" }}>Click to toggle impact</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {MITIGATION_ACTIONS.map((action) => {
            const isActive = activeMitigations.includes(action.id);
            return (
              <div
                key={action.id}
                onClick={() => toggleMitigation(action.id)}
                style={{
                  background: isActive ? "rgba(16, 185, 129, 0.12)" : "var(--bg-card)",
                  border: isActive ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--border-light)",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s"
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

                <span className="badge badge-green" style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem" }}>
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
