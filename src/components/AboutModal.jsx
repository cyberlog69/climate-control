import React from "react";
import { Globe, X, ExternalLink, Download, Smartphone, CloudSun, Cpu, Code2 } from "lucide-react";

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function AboutModal({ onClose }) {
  const netlifyUrl = "https://climate-sphere.netlify.app/";
  const githubUrl = "https://github.com/cyberlog69/climate-control";
  const apkReleaseUrl = "https://github.com/cyberlog69/climate-control/releases/download/v1.0.0/ClimateSphere-v1.0.0.apk";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(3, 7, 18, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "620px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid var(--border-light)",
          background: "var(--bg-card-hover)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="brand-icon-wrapper" style={{ width: 40, height: 40 }}>
              <Globe size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                  ClimateSphere
                </h3>
                <span className="badge badge-cyan" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                  v1.0.0
                </span>
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Global Realtime Climate & Weather Sentinel
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.3rem",
              borderRadius: "8px"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* Mission statement */}
          <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--text-main)", margin: 0 }}>
            <strong>ClimateSphere</strong> is a planetary environmental intelligence system combining
            real-time atmospheric telemetry, NASA satellite remote sensing, interactive 3D WebGL computing,
            and native Android engineering into an open, telemetry-driven platform.
          </p>

          {/* Quick Links Card Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
            {/* Live Web App */}
            <a
              href={netlifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-interactive"
              style={{
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                textDecoration: "none",
                borderRadius: "16px",
                background: "var(--bg-inner)"
              }}
            >
              <div style={{ padding: "0.6rem", borderRadius: "12px", background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)" }}>
                <Globe size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Deployed on Netlify</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  climate-sphere.netlify.app
                </div>
              </div>
              <ExternalLink size={16} style={{ color: "var(--text-dim)" }} />
            </a>

            {/* GitHub Repo */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-interactive"
              style={{
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                textDecoration: "none",
                borderRadius: "16px",
                background: "var(--bg-inner)"
              }}
            >
              <div style={{ padding: "0.6rem", borderRadius: "12px", background: "rgba(255, 255, 255, 0.1)", color: "var(--text-main)" }}>
                <Github size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>GitHub Repository</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  cyberlog69/climate-control
                </div>
              </div>
              <ExternalLink size={16} style={{ color: "var(--text-dim)" }} />
            </a>

            {/* Android APK */}
            <a
              href={apkReleaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-interactive"
              style={{
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                textDecoration: "none",
                borderRadius: "16px",
                background: "var(--bg-inner)",
                gridColumn: "1 / -1"
              }}
            >
              <div style={{ padding: "0.6rem", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "var(--accent-green)" }}>
                <Smartphone size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Native Android Application (APK)</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Download ClimateSphere-v1.0.0.apk (12 MB)
                </div>
              </div>
              <Download size={16} style={{ color: "var(--accent-green)" }} />
            </a>
          </div>

          {/* Tech Architecture Badges */}
          <div style={{ background: "var(--bg-inner)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.65rem" }}>
              Dual Platform Architecture
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <CloudSun size={16} style={{ color: "var(--accent-cyan)", marginTop: "0.15rem", flexShrink: 0 }} />
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-main)" }}>Web & PWA:</strong> React 18, Three.js 3D Globe, Leaflet, Recharts, Open-Meteo & Netlify CI/CD.
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <Cpu size={16} style={{ color: "var(--accent-purple)", marginTop: "0.15rem", flexShrink: 0 }} />
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-main)" }}>Android Native:</strong> Kotlin 2.0, Jetpack Compose, Room SQLite Offline Sync, Material You Themed Icons.
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", textAlign: "center", borderTop: "1px solid var(--border-light)", paddingTop: "0.75rem" }}>
            Open Source • MIT License • Built with Open Environmental Data
          </div>
        </div>
      </div>
    </div>
  );
}
