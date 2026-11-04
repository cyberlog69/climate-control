import React, { useState, useEffect, useMemo } from "react";
import {
  buildClimateExportData,
  convertToCSV,
  triggerFileDownload
} from "../services/dataExportApi";
import {
  Download,
  FileSpreadsheet,
  FileCode,
  Copy,
  Check,
  X,
  RefreshCw,
  Sliders,
  Database,
  CheckSquare,
  Square
} from "lucide-react";

export default function DataExportModal({
  currentLocation,
  weatherData,
  airQualityData,
  unit = "C",
  onClose
}) {
  const [format, setFormat] = useState("csv"); // 'csv' | 'json'
  const [datasets, setDatasets] = useState({
    hourly: true,
    daily: true,
    airQuality: true,
    historical: true,
    energy: true,
    wildfires: true
  });
  const [exportPayload, setExportPayload] = useState(null);
  const [formattedContent, setFormattedContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const cityName = currentLocation?.cityName || currentLocation?.name?.split(",")[0] || "Location";

  // Build export payload when location or dataset selections change
  useEffect(() => {
    let isCancelled = false;
    const generateData = async () => {
      setIsLoading(true);
      const data = await buildClimateExportData({
        location: currentLocation,
        weatherData,
        airQualityData,
        datasets,
        unit
      });

      if (!isCancelled) {
        setExportPayload(data);
        setIsLoading(false);
      }
    };

    generateData();
    return () => {
      isCancelled = true;
    };
  }, [currentLocation, weatherData, airQualityData, datasets, unit]);

  // Format content as CSV or JSON
  useEffect(() => {
    if (!exportPayload) return;

    if (format === "csv") {
      const csv = convertToCSV(exportPayload);
      setFormattedContent(csv);
    } else {
      const json = JSON.stringify(exportPayload, null, 2);
      setFormattedContent(json);
    }
  }, [exportPayload, format]);

  const toggleDataset = (key) => {
    setDatasets((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDownload = () => {
    if (!formattedContent) return;
    const safeName = cityName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `climatesphere_${safeName}_${dateStr}.${format}`;
    const mimeType = format === "csv" ? "text/csv" : "application/json";
    triggerFileDownload(formattedContent, filename, mimeType);
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(formattedContent).catch(() => {
        console.warn("Clipboard write failed — may not be supported in this context");
      });
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileSizeKb = useMemo(() => {
    if (!formattedContent) return "0.0";
    return (new Blob([formattedContent]).size / 1024).toFixed(1);
  }, [formattedContent]);

  const datasetList = [
    { id: "hourly", label: "24-Hour Hourly Forecast", count: weatherData?.hourly ? "24 rows" : "N/A" },
    { id: "daily", label: "7-Day Daily Forecast", count: weatherData?.daily ? "7 rows" : "N/A" },
    { id: "airQuality", label: "Air Quality & Particulates", count: "8 metrics" },
    { id: "historical", label: "75-Yr Trajectory (1950-2026)", count: "76 rows" },
    { id: "energy", label: "Solar & Wind Energy Potential", count: "6 models" },
    { id: "wildfires", label: "Regional NASA Hotspots", count: "10 clusters" }
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(3, 7, 18, 0.78)",
        backdropFilter: "blur(12px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="m3-card"
        style={{
          width: "100%",
          maxWidth: "820px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          border: "var(--sk-bezel-border)",
          boxShadow: "var(--sk-shadow-card)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.1rem 1.4rem",
            borderBottom: "var(--sk-bezel-border)",
            background: "var(--sk-surface-bar)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.6rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background: "var(--sk-surface-btn)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-cyan)",
                border: "var(--sk-bezel-border)",
                boxShadow: "var(--sk-shadow-btn)"
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                Raw Climate Data Exporter
              </h3>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Research-grade telemetry export for {currentLocation.name}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="m3-icon-btn"
            style={{ width: "36px", height: "36px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Configuration Bar */}
        <div
          style={{
            padding: "1rem 1.4rem",
            background: "var(--bg-inner)",
            borderBottom: "var(--sk-bezel-border)",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem"
          }}
        >
          {/* Format and Preset Selector */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginRight: "0.3rem" }}>
                Export Format:
              </span>
              <button
                onClick={() => setFormat("csv")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: format === "csv" ? "var(--sk-surface-primary-btn)" : "var(--sk-surface-btn)",
                  color: format === "csv" ? "#ffffff" : "var(--text-muted)",
                  border: format === "csv" ? "1px solid rgba(255, 255, 255, 0.3)" : "var(--sk-bezel-border)",
                  boxShadow: format === "csv" ? "0 3px 8px rgba(2, 132, 199, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)" : "var(--sk-shadow-btn)",
                  borderRadius: "10px",
                  padding: "0.38rem 0.8rem",
                  fontSize: "0.78rem",
                  fontWeight: format === "csv" ? 800 : 600,
                  cursor: "pointer",
                  transition: "all 0.16s ease"
                }}
              >
                <FileSpreadsheet size={15} />
                <span>CSV (.csv)</span>
              </button>

              <button
                onClick={() => setFormat("json")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: format === "json" ? "var(--sk-surface-primary-btn)" : "var(--sk-surface-btn)",
                  color: format === "json" ? "#ffffff" : "var(--text-muted)",
                  border: format === "json" ? "1px solid rgba(255, 255, 255, 0.3)" : "var(--sk-bezel-border)",
                  boxShadow: format === "json" ? "0 3px 8px rgba(2, 132, 199, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)" : "var(--sk-shadow-btn)",
                  borderRadius: "10px",
                  padding: "0.38rem 0.8rem",
                  fontSize: "0.78rem",
                  fontWeight: format === "json" ? 800 : 600,
                  cursor: "pointer",
                  transition: "all 0.16s ease"
                }}
              >
                <FileCode size={15} />
                <span>JSON (.json)</span>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span className="badge badge-cyan" style={{ fontSize: "0.72rem" }}>
                📦 Payload: ~{fileSizeKb} KB
              </span>
            </div>
          </div>

          {/* Dataset Toggles Grid */}
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "0.4rem" }}>
              Select Data Streams to Include:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.45rem" }}>
              {datasetList.map((ds) => {
                const isSelected = datasets[ds.id];
                return (
                  <div
                    key={ds.id}
                    onClick={() => toggleDataset(ds.id)}
                    style={{
                      background: isSelected ? "var(--sk-surface-btn-active)" : "var(--sk-surface-btn)",
                      border: isSelected ? "1px solid var(--accent-cyan)" : "var(--sk-bezel-border)",
                      boxShadow: isSelected ? "var(--sk-shadow-btn-pressed)" : "var(--sk-shadow-btn)",
                      borderRadius: "10px",
                      padding: "0.42rem 0.75rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {isSelected ? (
                        <CheckSquare size={14} style={{ color: "var(--accent-cyan)" }} />
                      ) : (
                        <Square size={14} style={{ color: "var(--text-dim)" }} />
                      )}
                      <span style={{ color: isSelected ? "var(--text-main)" : "var(--text-muted)", fontWeight: isSelected ? 700 : 500 }}>
                        {ds.label}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>{ds.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Monospace Data Preview Terminal */}
        <div style={{ padding: "1rem 1.4rem", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
              STREAM_PREVIEW [{format.toUpperCase()}]:
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Showing first 50 lines</span>
          </div>

          <div
            className="sk-lcd-panel"
            style={{
              flex: 1,
              padding: "0.95rem 1.1rem",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              lineHeight: 1.5,
              color: "#67e8f9",
              overflowX: "auto",
              whiteSpace: "pre",
              maxHeight: "260px"
            }}
          >
            {isLoading ? (
              <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
                <RefreshCw size={20} className="animate-spin" style={{ margin: "0 auto 0.5rem auto" }} />
                <span>Compiling telemetry matrix...</span>
              </div>
            ) : (
              formattedContent.split("\n").slice(0, 50).join("\n") + (formattedContent.split("\n").length > 50 ? "\n\n... [Remaining data truncated for preview]" : "")
            )}
          </div>
        </div>

        {/* Bottom Actions Toolbar */}
        <div
          style={{
            padding: "1rem 1.4rem",
            borderTop: "var(--sk-bezel-border)",
            background: "var(--sk-surface-bar)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.6rem"
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Format: <strong style={{ color: "var(--text-main)" }}>RFC 4180 / ISO 8601</strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={handleCopy}
              className="m3-chip"
              style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              {copied ? <Check size={15} style={{ color: "var(--accent-green)" }} /> : <Copy size={15} />}
              <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="m3-chip active"
              style={{
                padding: "0.45rem 1.1rem",
                fontSize: "0.85rem",
                gap: "0.4rem"
              }}
            >
              <Download size={16} />
              <span>Download .{format.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
