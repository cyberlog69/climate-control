import React, { useState, useMemo } from "react";
import { calculateRenewableYield } from "../services/renewableEnergyApi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import {
  Zap,
  Sun,
  Wind,
  Leaf,
  DollarSign,
  TreePine,
  Sliders,
  Sparkles,
  TrendingUp,
  BatteryCharging
} from "lucide-react";

export default function RenewableEnergyEstimator({
  locationName,
  lat,
  lon,
  weatherData
}) {
  const [solarSizeKw, setSolarSizeKw] = useState(5.0);
  const [windSizeKw, setWindSizeKw] = useState(3.0);

  const cityName = locationName ? locationName.split(",")[0] : "Selected Location";

  const yieldData = useMemo(() => {
    return calculateRenewableYield({
      lat: lat || 35.67,
      lon: lon || 139.65,
      weatherData,
      systemSizeKw: solarSizeKw,
      windTurbineKw: windSizeKw
    });
  }, [lat, lon, weatherData, solarSizeKw, windSizeKw]);

  const { solar, wind, impact, hourlyProfile } = yieldData;

  return (
    <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <Zap size={20} style={{ color: "var(--accent-amber)" }} />
          <span>Renewable Energy Yield Estimator</span>
        </div>
        <span className="badge badge-green" style={{ fontSize: "0.78rem" }}>
          Clean Energy Potential
        </span>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
        Estimate solar photovoltaic and wind turbine power generation capacity, carbon displacement, and utility savings for <strong>{cityName}</strong>.
      </p>

      {/* Interactive System Capacity Configurator */}
      <div
        style={{
          background: "var(--bg-inner)",
          padding: "1rem 1.1rem",
          borderRadius: "18px",
          border: "1px solid var(--border-light)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.1rem"
        }}
      >
        {/* Solar Size Slider */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Sun size={15} style={{ color: "var(--accent-amber)" }} />
              Rooftop Solar PV Size:
            </span>
            <strong style={{ color: "var(--accent-amber)", fontSize: "0.95rem" }}>{solarSizeKw.toFixed(1)} kWp</strong>
          </div>
          <input
            type="range"
            min="1.0"
            max="15.0"
            step="0.5"
            value={solarSizeKw}
            onChange={(e) => setSolarSizeKw(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent-amber)", cursor: "pointer", height: "5px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            <span>1 kW (Small)</span>
            <span>5 kW (Standard)</span>
            <span>15 kW (Large)</span>
          </div>
        </div>

        {/* Wind Size Slider */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Wind size={15} style={{ color: "var(--accent-cyan)" }} />
              Micro Wind Turbine:
            </span>
            <strong style={{ color: "var(--accent-cyan)", fontSize: "0.95rem" }}>{windSizeKw.toFixed(1)} kW</strong>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={windSizeKw}
            onChange={(e) => setWindSizeKw(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent-cyan)", cursor: "pointer", height: "5px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            <span>1 kW (Micro)</span>
            <span>3 kW (Home)</span>
            <span>10 kW (Commercial)</span>
          </div>
        </div>
      </div>

      {/* Dual Solar & Wind Yield Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
        {/* Solar Card */}
        <div style={{ background: "var(--bg-inner)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sun size={18} style={{ color: "var(--accent-amber)" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)" }}>Solar Photovoltaic</span>
            </div>
            <span className={`badge badge-${solar.badge}`}>{solar.rating}</span>
          </div>

          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-amber)", margin: "0.3rem 0" }}>
            {solar.annualSolarMwh} MWh/yr
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.65rem" }}>
            Estimated output: ~<strong>{solar.dailySolarKwh} kWh/day</strong>
          </div>

          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: "0.25rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.5rem" }}>
            <div>Peak Sun Hours: <strong style={{ color: "var(--text-main)" }}>{solar.peakSunHours} hrs/day</strong></div>
            <div>Solar Irradiance: <strong style={{ color: "var(--text-main)" }}>{solar.peakIrradianceWm2} W/m²</strong></div>
            <div>Capacity Factor: <strong style={{ color: "var(--text-main)" }}>{solar.capacityFactor}%</strong></div>
          </div>
        </div>

        {/* Wind Card */}
        <div style={{ background: "var(--bg-inner)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Wind size={18} style={{ color: "var(--accent-cyan)" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)" }}>Wind Kinetic Energy</span>
            </div>
            <span className={`badge badge-${wind.badge}`}>{wind.rating}</span>
          </div>

          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-cyan)", margin: "0.3rem 0" }}>
            {wind.annualWindMwh} MWh/yr
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.65rem" }}>
            Estimated output: ~<strong>{wind.dailyWindKwh} kWh/day</strong>
          </div>

          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: "0.25rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.5rem" }}>
            <div>Wind Speed (10m / 50m): <strong style={{ color: "var(--text-main)" }}>{wind.windSpeed10m} / {wind.windSpeed50m} m/s</strong></div>
            <div>Power Density: <strong style={{ color: "var(--text-main)" }}>{wind.powerDensity} W/m²</strong></div>
            <div>Wind Power Class: <strong style={{ color: "var(--text-main)" }}>Class {wind.windClass}</strong></div>
          </div>
        </div>
      </div>

      {/* Combined Ecological & Financial ROI Impact Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.65rem" }}>
        <div style={{ background: "var(--bg-inner)", padding: "0.75rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <BatteryCharging size={15} style={{ color: "var(--accent-green)" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Clean Energy</span>
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)" }}>
            {impact.totalAnnualMwh} MWh
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Combined annual yield</div>
        </div>

        <div style={{ background: "var(--bg-inner)", padding: "0.75rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <Leaf size={15} style={{ color: "var(--accent-green)" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>CO₂ Avoided</span>
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-green)" }}>
            {impact.co2AvoidedKgYear.toLocaleString()} kg
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Grid displacement/yr</div>
        </div>

        <div style={{ background: "var(--bg-inner)", padding: "0.75rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <TreePine size={15} style={{ color: "#34d399" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>Tree Equivalent</span>
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)" }}>
            {impact.treesEquivalentYear} Trees
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Offset capacity/yr</div>
        </div>

        <div style={{ background: "var(--bg-inner)", padding: "0.75rem", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
            <DollarSign size={15} style={{ color: "var(--accent-amber)" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>Utility Savings</span>
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-amber)" }}>
            ${impact.estimatedSavingsUsdYear.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Est. bill savings/yr</div>
        </div>
      </div>

      {/* 24-Hour Projected Clean Generation Profile Chart */}
      <div style={{ background: "var(--bg-inner)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)" }}>
            24-Hour Clean Energy Generation Curve (kW)
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--accent-green)", fontFamily: "monospace" }}>
            Solar Bell Curve + Wind Profile
          </span>
        </div>

        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyProfile} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-amber)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--accent-amber)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={11} tickLine={false} interval={3} />
              <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} domain={[0, "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card-hover)",
                  borderColor: "var(--border-light)",
                  borderRadius: "10px",
                  fontSize: "0.75rem",
                  color: "var(--text-main)"
                }}
              />
              <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.4rem" }} />
              <Area
                type="monotone"
                dataKey="solarKw"
                name="Solar PV (kW)"
                stroke="var(--accent-amber)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#solarGrad)"
              />
              <Area
                type="monotone"
                dataKey="windKw"
                name="Wind Turbine (kW)"
                stroke="var(--accent-cyan)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#windGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
