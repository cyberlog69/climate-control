import React from "react";
import {
  LayoutDashboard,
  Globe2,
  Compass,
  History,
  Activity,
  Zap,
  Leaf,
  Sliders,
  GitCompare,
  FileText,
  Info
} from "lucide-react";

export default function MaterialNavRail({
  activeTab,
  onSelectTab,
  onOpenComparison,
  onOpenReport,
  onOpenAbout
}) {
  const primaryDestinations = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "map", label: "Globe & Map", icon: Globe2 },
    { id: "forecast", label: "Forecast", icon: Compass },
    { id: "history", label: "Time Machine", icon: History },
    { id: "vitals", label: "Vitals & Fires", icon: Activity },
    { id: "energy", label: "Clean Energy", icon: Zap },
    { id: "footprint", label: "Carbon", icon: Leaf },
    { id: "sim", label: "AI Simulator", icon: Sliders }
  ];

  return (
    <aside className="m3-nav-rail" aria-label="Material Navigation Rail">
      <div className="m3-nav-rail-destinations">
        {primaryDestinations.map((dest) => {
          const Icon = dest.icon;
          const isActive = activeTab === dest.id;
          return (
            <button
              key={dest.id}
              className={`m3-rail-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectTab(dest.id)}
              aria-label={dest.label}
              title={dest.label}
            >
              <div className="m3-rail-icon-wrapper">
                <Icon size={20} />
              </div>
              <span className="m3-rail-label">{dest.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Utility Actions */}
      <div className="m3-nav-rail-footer">
        <button
          className="m3-rail-action-btn"
          onClick={onOpenComparison}
          title="Compare Two Global Cities"
          aria-label="Compare Cities"
        >
          <GitCompare size={18} />
          <span className="m3-rail-label">Compare</span>
        </button>

        <button
          className="m3-rail-action-btn"
          onClick={onOpenReport}
          title="Generate Environmental Report"
          aria-label="Generate Report"
        >
          <FileText size={18} />
          <span className="m3-rail-label">Report</span>
        </button>

        <button
          className="m3-rail-action-btn"
          onClick={onOpenAbout}
          title="About ClimateSphere"
          aria-label="About ClimateSphere"
        >
          <Info size={18} />
          <span className="m3-rail-label">About</span>
        </button>
      </div>
    </aside>
  );
}
