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
      {/* Alert Header Trigger Pill */}
      <button
        onClick={() => setIsAlertDrawerOpen(true)}
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.45rem 0.85rem",
          borderRadius: "20px",
          background: visibleAlerts.length > 0 ? "rgba(239, 68, 68, 0.2)" : "rgba(30, 41, 59, 0.7)",
          border: visibleAlerts.length > 0 ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid var(--border-light)",
          color: visibleAlerts.length > 0 ? "#fca5a5" : "var(--text-muted)",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontWeight: 600,
          transition: "all 0.25s ease"
        }}
      >
        <Bell size={15} className={visibleAlerts.length > 0 ? "animate-bounce" : ""} />
        <span>Alerts</span>
        {visibleAlerts.length > 0 && (
          <span
            style={{
              background: "var(--accent-red)",
              color: "#fff",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 800
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
            zIndex: 1200,
            display: "flex",
            justifyContent: "flex-end"
          }}
          onClick={() => setIsAlertDrawerOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "100%",
              padding: "1.5rem",
              borderRadius: 0,
              borderLeft: "1px solid var(--border-light)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-15px 0 35px rgba(0, 0, 0, 0.8)",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <ShieldAlert size={22} style={{ color: "var(--accent-red)" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)" }}>Live Climate Emergency Hub</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "none",
                    color: audioEnabled ? "var(--accent-cyan)" : "var(--text-dim)",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title={audioEnabled ? "Mute Audio Alerts" : "Enable Audio Alerts"}
                >
                  {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>

                <button
                  onClick={() => setIsAlertDrawerOpen(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "none",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
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
                style={{
                  padding: "2.5rem 1rem",
                  textAlign: "center",
                  background: "rgba(16, 185, 129, 0.08)",
                  borderRadius: "16px",
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
                    color: "var(--accent-green)"
                  }}
                >
                  ✓
                </div>
                <h4 style={{ color: "var(--text-main)", fontSize: "1.1rem", fontWeight: 700 }}>No Active Severe Warnings</h4>
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
                      style={{
                        padding: "1rem",
                        borderRadius: "16px",
                        background: `${alert.color}15`,
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

                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
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
                borderTop: "1px solid var(--border-light)",
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
