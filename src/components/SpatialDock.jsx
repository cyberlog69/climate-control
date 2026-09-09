import React from "react";
import {
  Thermometer,
  Compass,
  History,
  TrendingUp,
  Zap,
  Leaf,
  Sliders,
  Globe2,
  Map as MapIcon
} from "lucide-react";

export default function SpatialDock({
  activeTab,
  onSelectTab,
  viewMode = "3d",
  onToggleViewMode
}) {
  const navItems = [
    { id: "live", label: "Live Weather", icon: Thermometer },
    { id: "forecast", label: "Forecast Trajectory", icon: Compass },
    { id: "history", label: "Time Machine", icon: History },
    { id: "vitals", label: "Planetary Vitals", icon: TrendingUp },
    { id: "energy", label: "Clean Energy", icon: Zap },
    { id: "footprint", label: "Carbon Footprint", icon: Leaf },
    { id: "sim", label: "Climate Sim", icon: Sliders }
  ];

  return (
    <aside className="spatial-dock glass-card" aria-label="Spatial Navigation Dock">
      {/* 2D / 3D Globe Mode Quick Switcher */}
      {onToggleViewMode && (
        <button
          className={`dock-item ${viewMode === "3d" ? "dock-item-accent" : ""}`}
          onClick={onToggleViewMode}
          title={`Switch to ${viewMode === "3d" ? "2D Flat Map" : "3D Earth Globe"}`}
          aria-label="Toggle 2D/3D View"
        >
          {viewMode === "3d" ? <Globe2 size={19} /> : <MapIcon size={19} />}
          <span className="dock-tooltip">{viewMode === "3d" ? "3D Globe" : "2D Map"}</span>
        </button>
      )}

      <div className="dock-divider" />

      {/* Main Navigation Tabs */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`dock-item ${isActive ? "active" : ""}`}
            onClick={() => onSelectTab(item.id)}
            title={item.label}
            aria-label={item.label}
          >
            <Icon size={19} />
            <span className="dock-tooltip">{item.label}</span>
            {isActive && <span className="dock-active-glow" />}
          </button>
        );
      })}
    </aside>
  );
}
