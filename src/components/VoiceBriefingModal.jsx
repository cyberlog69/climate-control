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
  Sliders
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
  const [copied, setCopied] = useState(false);

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

  // Load available system voices
  useEffect(() => {
    const updateVoices = () => {
      const avail = speechController.getAvailableVoices();
      if (avail.length > 0) {
        // Prefer English voices first
        const englishVoices = avail.filter((v) => v.lang.startsWith("en"));
        setVoices(englishVoices.length > 0 ? englishVoices : avail);
      }
    };

    updateVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      speechController.stop();
    };
  }, []);

  const handlePlay = () => {
    if (isPaused) {
      speechController.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    const selectedVoice = voices[selectedVoiceIndex] || null;

    speechController.speak(briefing.fullScript, {
      voice: selectedVoice,
      rate,
      pitch: 1.0,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onError: (e) => {
        console.warn("Speech synthesis error:", e);
        setIsPlaying(false);
        setIsPaused(false);
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
    navigator.clipboard.writeText(briefing.fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "680px",
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
            padding: "1.1rem 1.4rem",
            borderBottom: "1px solid var(--border-light)",
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
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(6, 182, 212, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-cyan)",
                border: "1px solid var(--accent-cyan)"
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
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--bg-inner)",
              border: "1px solid var(--border-light)",
              color: "var(--text-main)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Animated Audio Waveform Visualizer */}
        <div
          style={{
            padding: "1.25rem 1.4rem",
            background: "var(--bg-inner)",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "45px" }}>
            {Array.from({ length: 24 }).map((_, i) => {
              // Staggered animated height
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
                    transition: isPlaying ? "height 0.15s ease" : "height 0.3s ease",
                    animation: isPlaying ? `wavePulse 0.8s infinite ease-in-out ${i * 0.05}s alternate` : "none"
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: isPlaying ? "var(--accent-cyan)" : "var(--text-dim)" }}>
            <Radio size={14} className={isPlaying ? "animate-pulse" : ""} />
            <span>{isPlaying ? "Broadcasting Voice Briefing..." : isPaused ? "Playback Paused" : "Ready to Broadcast"}</span>
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
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "var(--text-main)"
          }}
        >
          {briefing.paragraphs.map((p, idx) => (
            <p
              key={idx}
              style={{
                margin: 0,
                padding: "0.5rem 0.75rem",
                borderRadius: "10px",
                background: isPlaying ? "rgba(6, 182, 212, 0.06)" : "transparent",
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
            borderTop: "1px solid var(--border-light)",
            background: "var(--bg-inner)",
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "rgba(245, 158, 11, 0.2)",
                    border: "1px solid var(--accent-amber)",
                    color: "var(--accent-amber)",
                    padding: "0.5rem 1rem",
                    borderRadius: "14px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <Pause size={16} />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "var(--accent-cyan)",
                    border: "none",
                    color: "#000",
                    padding: "0.5rem 1.1rem",
                    borderRadius: "14px",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <Play size={16} />
                  <span>{isPaused ? "Resume" : "Play Briefing"}</span>
                </button>
              )}

              <button
                onClick={handleStop}
                className="locate-btn"
                style={{ padding: "0.5rem 0.75rem" }}
                title="Stop Speech"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Speed Presets */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginRight: "0.2rem" }}>Speed:</span>
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
                    background: rate === s ? "var(--accent-cyan)" : "var(--bg-card)",
                    color: rate === s ? "#000" : "var(--text-muted)",
                    border: rate === s ? "1px solid var(--accent-cyan)" : "1px solid var(--border-light)",
                    borderRadius: "8px",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.72rem",
                    fontWeight: rate === s ? 700 : 500,
                    cursor: "pointer"
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Copy Script */}
            <button
              onClick={handleCopy}
              className="locate-btn"
              style={{ padding: "0.45rem 0.75rem", fontSize: "0.75rem" }}
            >
              {copied ? <Check size={14} style={{ color: "var(--accent-green)" }} /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy Script"}</span>
            </button>
          </div>

          {/* Voice Selector Row */}
          {voices.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Voice:</span>
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
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  color: "var(--text-main)",
                  borderRadius: "10px",
                  padding: "0.35rem 0.65rem",
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
