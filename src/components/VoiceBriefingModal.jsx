import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  generateClimateBriefingScript,
  speechController
} from "../services/voiceBriefingApi";
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Copy,
  Check,
  Sparkles,
  Radio,
  Sliders,
  AlertCircle
} from "lucide-react";

export default function VoiceBriefingModal({
  locationName,
  weatherData,
  airQualityData,
  unit = "C",
  onClose
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check if speech synthesis is available (not available in Android WebView native context)
  const isSpeechSupported = typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";

  const cityName = locationName ? locationName.split(",")[0] : "your location";

  // Generate briefing script
  const briefing = useMemo(() => {
    return generateClimateBriefingScript({
      locationName,
      weatherData,
      airQualityData,
      unit
    });
  }, [locationName, weatherData, airQualityData, unit]);

  // Load and refresh available system voices
  useEffect(() => {
    // Skip voice loading on Android WebView where speechSynthesis is unavailable
    if (!isSpeechSupported) return;

    const updateVoices = () => {
      const avail = speechController.getAvailableVoices();
      if (avail && avail.length > 0) {
        // Prefer natural English voices first
        const englishVoices = avail.filter((v) => v.lang.toLowerCase().startsWith("en"));
        setVoices(englishVoices.length > 0 ? englishVoices : avail);
      }
    };

    updateVoices();

    // Chrome/Edge load voices asynchronously
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
      // Backup timeout in case event already fired
      setTimeout(updateVoices, 300);
      setTimeout(updateVoices, 1000);
    }

    return () => {
      speechController.stop();
    };
  }, [isSpeechSupported]);

  const handlePlay = () => {
    setErrorMessage(null);

    if (isPaused) {
      speechController.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    const selectedVoice = voices[selectedVoiceIndex] || null;

    setIsPlaying(true);
    setIsPaused(false);

    speechController.speak(briefing.fullScript, {
      voice: selectedVoice,
      rate,
      pitch: 1.0,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
        setErrorMessage(null);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onError: (err) => {
        console.warn("Speech playback notice:", err);
        setIsPlaying(false);
        setIsPaused(false);
        if (typeof err === "string") {
          setErrorMessage(err);
        }
      }
    });
  };

  const handlePause = () => {
    speechController.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    speechController.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(briefing.fullScript).catch(() => {
        // Fallback: silently fail — user can manually select text
        console.warn("Clipboard write failed — may not be supported in this WebView context");
      });
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  // If speech synthesis is not supported (Android WebView), show friendly notice instead of broken UI
  if (!isSpeechSupported) {
    return (
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(3, 7, 18, 0.85)",
          zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem"
        }}
        onClick={onClose}
      >
        <div className="glass-card" style={{ padding: "2rem", maxWidth: "380px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
          <Radio size={40} style={{ color: "var(--accent-cyan)", margin: "0 auto 1rem" }} />
          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Voice Briefing</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Voice synthesis is not available in this environment. Below is your complete climate briefing you can read:
          </p>
          <div style={{ background: "var(--bg-inner)", padding: "1rem", borderRadius: "12px", textAlign: "left", fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.7 }}>
            {briefing.fullScript}
          </div>
          <button
            onClick={onClose}
            style={{ marginTop: "1.25rem", padding: "0.6rem 1.5rem", background: "var(--accent-cyan)", color: "#000", fontWeight: 700, border: "none", borderRadius: "10px", cursor: "pointer" }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const speeds = [0.8, 1.0, 1.2, 1.5];

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
      onClick={() => {
        speechController.stop();
        onClose();
      }}
    >
      <div
        className="m3-card"
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
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
              <Mic size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                AI Climate Voice Briefing
              </h3>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Planetary weather & vital signs synthesis for {cityName}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              speechController.stop();
              onClose();
            }}
            className="m3-icon-btn"
            style={{ width: "36px", height: "36px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div
            style={{
              padding: "0.65rem 1.4rem",
              background: "rgba(239, 68, 68, 0.15)",
              borderBottom: "1px solid rgba(239, 68, 68, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.78rem",
              color: "#fca5a5"
            }}
          >
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Animated Audio Waveform Visualizer (Skeuomorphic Audio Oscilloscope) */}
        <div
          className="sk-lcd-panel"
          style={{
            margin: "0.85rem 1.4rem 0.2rem 1.4rem",
            padding: "1.1rem 1.4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "45px" }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [12, 24, 38, 18, 42, 28, 14, 32, 40, 22, 16, 36, 44, 20, 30, 15, 38, 26, 12, 34, 42, 18, 28, 14];
              const h = heights[i % heights.length];
              return (
                <div
                  key={i}
                  style={{
                    width: "4px",
                    height: isPlaying ? `${h}px` : "6px",
                    borderRadius: "3px",
                    background: isPlaying
                      ? `linear-gradient(180deg, var(--accent-cyan), var(--accent-purple))`
                      : "rgba(148, 163, 184, 0.3)",
                    boxShadow: isPlaying ? "0 0 8px var(--accent-cyan)" : "none",
                    transition: isPlaying ? "height 0.15s ease" : "height 0.3s ease"
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: isPlaying ? "var(--accent-cyan)" : "var(--text-dim)", fontWeight: 600 }}>
            <Radio size={14} className={isPlaying ? "animate-pulse" : ""} />
            <span>
              {isPlaying
                ? "🎙️ Broadcasting Planetary Intelligence Audio..."
                : isPaused
                ? "⏸️ Playback Paused"
                : "✨ Speech Synthesizer Ready — Click Play to Listen"}
            </span>
          </div>
        </div>

        {/* Teleprompter / Transcript */}
        <div
          style={{
            padding: "1.2rem 1.4rem",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
            fontSize: "0.88rem",
            lineHeight: 1.6,
            color: "var(--text-main)"
          }}
        >
          {briefing.paragraphs.map((p, idx) => (
            <p
              key={idx}
              style={{
                margin: 0,
                padding: "0.6rem 0.85rem",
                borderRadius: "10px",
                background: isPlaying ? "rgba(6, 182, 212, 0.08)" : "transparent",
                borderLeft: isPlaying ? "3px solid var(--accent-cyan)" : "3px solid transparent",
                transition: "all 0.2s"
              }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Bottom Playback & Voice Config Toolbar */}
        <div
          style={{
            padding: "1rem 1.4rem",
            borderTop: "var(--sk-bezel-border)",
            background: "var(--sk-surface-bar)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}
        >
          {/* Main Controls Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            {/* Play/Pause/Stop */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {isPlaying ? (
                <button
                  onClick={handlePause}
                  className="m3-chip active"
                  style={{
                    background: "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)",
                    gap: "0.4rem",
                    padding: "0.45rem 1.1rem"
                  }}
                >
                  <Pause size={16} />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  className="m3-chip active"
                  style={{
                    gap: "0.4rem",
                    padding: "0.45rem 1.25rem"
                  }}
                >
                  <Play size={16} fill="#fff" />
                  <span>{isPaused ? "Resume" : "Play Briefing"}</span>
                </button>
              )}

              <button
                onClick={handleStop}
                className="m3-icon-btn"
                style={{ width: "36px", height: "36px" }}
                title="Stop Speech"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Speed Presets */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginRight: "0.2rem", fontWeight: 600 }}>Speed:</span>
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setRate(s);
                    if (isPlaying) {
                      speechController.stop();
                      setIsPlaying(false);
                      setTimeout(handlePlay, 100);
                    }
                  }}
                  style={{
                    background: rate === s ? "var(--sk-surface-primary-btn)" : "var(--sk-surface-btn)",
                    color: rate === s ? "#ffffff" : "var(--text-muted)",
                    border: rate === s ? "1px solid rgba(255, 255, 255, 0.3)" : "var(--sk-bezel-border)",
                    boxShadow: rate === s ? "0 2px 6px rgba(2, 132, 199, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)" : "var(--sk-shadow-btn)",
                    borderRadius: "8px",
                    padding: "0.25rem 0.55rem",
                    fontSize: "0.72rem",
                    fontWeight: rate === s ? 800 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Copy Script */}
            <button
              onClick={handleCopy}
              className="m3-chip"
              style={{ padding: "0.42rem 0.75rem", fontSize: "0.75rem", gap: "0.35rem" }}
            >
              {copied ? <Check size={14} style={{ color: "var(--accent-green)" }} /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy Script"}</span>
            </button>
          </div>

          {/* Voice Selector Row */}
          {voices.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontWeight: 600 }}>Voice:</span>
              <select
                value={selectedVoiceIndex}
                onChange={(e) => {
                  setSelectedVoiceIndex(parseInt(e.target.value, 10));
                  if (isPlaying) {
                    speechController.stop();
                    setIsPlaying(false);
                    setTimeout(handlePlay, 100);
                  }
                }}
                style={{
                  background: "var(--sk-surface-btn)",
                  border: "var(--sk-bezel-border)",
                  boxShadow: "var(--sk-shadow-btn)",
                  color: "var(--text-main)",
                  borderRadius: "10px",
                  padding: "0.4rem 0.65rem",
                  fontSize: "0.75rem",
                  outline: "none",
                  flex: 1,
                  cursor: "pointer"
                }}
              >
                {voices.map((v, i) => (
                  <option key={i} value={i}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
