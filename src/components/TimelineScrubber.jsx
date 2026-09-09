import React, { useState } from "react";
import { Clock, Play, Pause, ChevronUp, ChevronDown } from "lucide-react";
import { getWmoInfo } from "../services/climateData";

export default function TimelineScrubber({ weatherData, unit = "C", onSelectHour }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!weatherData || !weatherData.hourly || weatherData.hourly.length === 0) {
    return null;
  }

  const hourly = weatherData.hourly.slice(0, 10);

  const displayTemp = (tempC) => {
    if (unit === "F") return Math.round((tempC * 9) / 5 + 32);
    return tempC;
  };

  const handleSelect = (idx) => {
    setSelectedIndex(idx);
    if (onSelectHour) {
      onSelectHour(hourly[idx]);
    }
  };

  return (
    <div className="timeline-scrubber glass-card" aria-label="Forecast Timeline Scrubber">
      <div className="scrubber-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span className="pulse-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Orbital Timeline
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--accent-cyan)", fontFamily: "monospace" }}>
          {hourly[selectedIndex]?.time || "Live"}
        </span>
      </div>

      <div className="scrubber-track">
        {hourly.map((h, idx) => {
          const isSelected = selectedIndex === idx;
          const wmo = getWmoInfo(h.weatherCode);
          return (
            <button
              key={idx}
              className={`scrubber-step ${isSelected ? "active" : ""}`}
              onClick={() => handleSelect(idx)}
              title={`${h.time}: ${displayTemp(h.temp)}°${unit}, ${wmo.label}`}
            >
              <span className="step-time">{idx === 0 ? "NOW" : h.time}</span>
              <span className="step-marker" />
              <span className="step-temp">{displayTemp(h.temp)}°</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
