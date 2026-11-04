import React, { useState, useEffect, useMemo } from "react";
import { AlertTriangle, ShieldAlert, Volume2, VolumeX, X, Bell, Flame, Wind, Droplets, CloudLightning, Info } from "lucide-react";

// Security: reuse a single AudioContext singleton to prevent audio handle exhaustion
let _alertAudioCtx = null;
function getAlertAudioCtx() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!_alertAudioCtx || _alertAudioCtx.state === "closed") {
    _alertAudioCtx = new AudioContext();
  }
  if (_alertAudioCtx.state === "suspended") {
    _alertAudioCtx.resume();
  }
  return _alertAudioCtx;
}

export default function ClimateAlertSystem({ weatherData, airQualityData, locationName }) {
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // Synthesize Web Audio API Alert Beep (Zero external asset dependency)
  const playAlertChime = () => {
    try {
      const ctx = getAlertAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio Context playback error:", e);
    }
  };

  // Evaluate active severe weather & environmental alerts dynamically
  const activeAlerts = useMemo(() => {
    const alerts = [];
    if (!weatherData || !weatherData.current) return alerts;

    const current = weatherData.current;
    const usAqi = airQualityData?.us_aqi || 0;

    // 1. Extreme Heatwave Warning
    if (current.temp >= 38) {
      alerts.push({
        id: `heat-${current.temp}`,
        title: "Extreme Heatwave Warning",
        severity: "Critical",
        category: "Temperature",
        icon: Flame,
        color: "var(--accent-red)",
        message: `Dangerous heat index detected at ${current.temp}°C in ${locationName}. High risk of heatstroke. Stay hydrated and indoors.`
      });
    } else if (current.temp >= 33) {
      alerts.push({
        id: `heat-mod-${current.temp}`,
        title: "High Thermal Stress Advisory",
        severity: "High",
        category: "Temperature",
        icon: Flame,
        color: "var(--accent-amber)",
        message: `Elevated temperatures (${current.temp}°C) in ${locationName}. Limit prolonged direct sun exposure.`
      });
    }

    // 2. Severe Storm & Wind Warning
    if (current.windSpeed >= 50 || current.windGusts >= 70) {
      alerts.push({
        id: `wind-${current.windSpeed}`,
        title: "Gale Force Wind & Storm Warning",
        severity: "Critical",
        category: "Wind",
        icon: Wind,
        color: "var(--accent-red)",
        message: `Severe wind gusts up to ${current.windGusts || current.windSpeed} km/h recorded in ${locationName}. Secure loose outdoor objects.`
      });
    }

    // 3. Hazardous Air Quality Alert
    if (usAqi > 150) {
      alerts.push({
        id: `aqi-${usAqi}`,
        title: "Hazardous Air Pollution Alert",
        severity: usAqi > 200 ? "Critical" : "High",
        category: "Air Quality",
        icon: Wind,
        color: usAqi > 200 ? "var(--accent-red)" : "var(--accent-amber)",
        message: `Unhealthy AQI index (${usAqi}) detected in ${locationName}. Sensitive groups and general population advised to wear N95 masks.`
      });
    }

    // 4. Torrential Rainfall / Flood Warning
    if (current.precipitation >= 15) {
      alerts.push({
        id: `precip-${current.precipitation}`,
        title: "Torrential Precipitation Alert",
        severity: "High",
        category: "Precipitation",
        icon: Droplets,
        color: "var(--accent-cyan)",
        message: `Heavy rainfall rate (${current.precipitation} mm) in ${locationName}. Elevated risk of localized urban flash flooding.`
      });
    }

    // 5. Thunderstorm / Hail
    if ([95, 96, 99].includes(current.weatherCode)) {
      alerts.push({
        id: `storm-${current.weatherCode}`,
        title: "Severe Thunderstorm & Hail Warning",
        severity: "Critical",
        category: "Storm",
        icon: CloudLightning,
        color: "var(--accent-red)",
        message: `Active lightning and potential hail storms reported in ${locationName}. Seek immediate structural shelter.`
      });
    }

    return alerts;
  }, [weatherData, airQualityData, locationName]);

  // Trigger Audio Chime when new Critical alert arrives
  useEffect(() => {
    const hasCritical = activeAlerts.some((a) => a.severity === "Critical");
    if (hasCritical && audioEnabled) {
      playAlertChime();
    }
  }, [activeAlerts, audioEnabled]);

  const visibleAlerts = activeAlerts.filter((a) => !dismissedAlerts.includes(a.id));

  return (
    <>
      {/* Alert Header Trigger Pill (Tactile Skeuomorphic Button) */}
      <button
        onClick={() => setIsAlertDrawerOpen(true)}
        className="glass-pill"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.42rem 0.85rem",
          background: visibleAlerts.length > 0 ? "linear-gradient(180deg, rgba(239, 68, 68, 0.3) 0%, rgba(185, 28, 28, 0.2) 100%)" : "var(--sk-surface-btn)",
          border: visibleAlerts.length > 0 ? "1px solid rgba(239, 68, 68, 0.6)" : "var(--sk-bezel-border)",
          color: visibleAlerts.length > 0 ? "#fca5a5" : "var(--text-main)",
          boxShadow: visibleAlerts.length > 0 ? "0 0 14px rgba(239, 68, 68, 0.4), var(--sk-shadow-btn)" : "var(--sk-shadow-btn)",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontWeight: 700,
          transition: "all 0.18s cubic-bezier(0.2, 0, 0, 1)"
        }}
      >
        <Bell size={15} className={visibleAlerts.length > 0 ? "animate-bounce" : ""} />
        <span>Alerts</span>
        {visibleAlerts.length > 0 && (
          <span
            style={{
              background: "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)",
              color: "#fff",
              borderRadius: "50%",
              width: "19px",
              height: "19px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.68rem",
              fontWeight: 800,
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)"
            }}
          >
            {visibleAlerts.length}
          </span>
        )}
      </button>

      {/* Emergency Alert Drawer Modal */}
      {isAlertDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            zIndex: 1200,
            display: "flex",
            justifyContent: "flex-end"
          }}
          onClick={() => setIsAlertDrawerOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "100%",
              padding: "1.5rem",
              borderRadius: 0,
              background: "var(--sk-surface-elevated)",
              borderLeft: "var(--sk-bezel-border)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-15px 0 40px rgba(0, 0, 0, 0.8), inset 1px 0 0 rgba(255, 255, 255, 0.1)",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <ShieldAlert size={22} style={{ color: "var(--accent-red)" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>Live Climate Emergency Hub</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="m3-icon-btn"
                  style={{ width: "36px", height: "36px" }}
                  title={audioEnabled ? "Mute Audio Alerts" : "Enable Audio Alerts"}
                >
                  {audioEnabled ? <Volume2 size={18} style={{ color: "var(--accent-cyan)" }} /> : <VolumeX size={18} />}
                </button>

                <button
                  onClick={() => setIsAlertDrawerOpen(false)}
                  className="m3-icon-btn"
                  style={{ width: "36px", height: "36px" }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Real-time atmospheric hazard monitoring for <strong>{locationName}</strong> based on Open-Meteo live feeds.
            </p>

            {/* Active Alerts List */}
            {visibleAlerts.length === 0 ? (
              <div
                className="sk-recessed-tile"
                style={{
                  padding: "2.5rem 1rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(16, 185, 129, 0.3)"
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem auto",
                    color: "var(--accent-green)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)"
                  }}
                >
                  ✓
                </div>
                <h4 style={{ color: "var(--text-main)", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>No Active Severe Warnings</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                  Current environmental parameters for {locationName} are within normal safety baselines.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                {visibleAlerts.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <div
                      key={alert.id}
                      className="sk-lcd-panel"
                      style={{
                        padding: "1rem 1.15rem",
                        border: `1px solid ${alert.color}55`,
                        position: "relative"
                      }}
                    >
                      <button
                        onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          right: "0.75rem",
                          background: "transparent",
                          border: "none",
                          color: "var(--text-dim)",
                          cursor: "pointer"
                        }}
                        title="Dismiss Alert"
                      >
                        <X size={15} />
                      </button>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                        <Icon size={20} style={{ color: alert.color }} />
                        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>{alert.title}</span>
                        <span className={`badge badge-${alert.severity === "Critical" ? "red" : "amber"}`}>
                          {alert.severity}
                        </span>
                      </div>

                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45, margin: 0 }}>
                        {alert.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              style={{
                marginTop: "auto",
                paddingTop: "1rem",
                borderTop: "var(--sk-bezel-border)",
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                textAlign: "center"
              }}
            >
              Emergency alerts are computed automatically from live Open-Meteo sensors.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
