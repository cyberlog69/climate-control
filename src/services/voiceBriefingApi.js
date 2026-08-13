// Web Speech Synthesis & Natural Language Climate Briefing Engine
// Generates contextual planetary intelligence scripts and controls browser voice audio

/**
 * Generates an executive daily climate intelligence briefing script
 */
export function generateClimateBriefingScript({
  locationName,
  weatherData,
  airQualityData,
  unit = "C"
}) {
  const cityName = locationName ? locationName.split(",")[0] : "your location";
  const current = weatherData?.current || {};
  const temp =
    current.temp != null
      ? `${Math.round(current.temp)} degrees ${unit === "F" ? "Fahrenheit" : "Celsius"}`
      : "moderate temperatures";
  const condition = current.weatherDescription || "clear conditions";
  const humidity = current.humidity != null ? `${current.humidity} percent` : "normal levels";
  const windSpeed = current.windSpeed != null ? `${current.windSpeed} kilometers per hour` : "gentle breezes";

  const aqiVal = airQualityData?.current?.aqi ?? 45;
  const aqiLevel = airQualityData?.current?.level ?? "Good";

  // Time of day greeting
  const hour = new Date().getHours();
  let greeting = "Good day";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  const paragraphs = [
    `${greeting}. Here is your ClimateSphere Planetary Intelligence Briefing for ${cityName}.`,
    `Current atmospheric conditions report ${condition}, with ambient temperature at ${temp}, relative humidity at ${humidity}, and wind speeds measuring ${windSpeed}.`,
    `Air quality is currently indexed at ${aqiVal}, categorized as ${aqiLevel}. ${
      aqiVal > 100
        ? "Sensitive demographic groups are advised to limit prolonged outdoor exertion."
        : "Atmospheric particulate levels remain well within international safety baselines."
    }`,
    `On the global sentinel radar: atmospheric carbon dioxide holds at 428.4 parts per million, with planetary warming anomalies trending at plus 1.29 degrees above pre-industrial baselines.`,
    `Thank you for monitoring Earth's vital signs with ClimateSphere. Have a productive and climate-conscious day.`
  ];

  return {
    fullScript: paragraphs.join(" "),
    paragraphs
  };
}

/**
 * High-tech broadcast intro chime using Web Audio API
 */
export function playBroadcastChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(587.33, now, 0.18); // D5
    playTone(880.00, now + 0.12, 0.28); // A5
    playTone(1174.66, now + 0.24, 0.45); // D6

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1200);
  } catch (e) {
    // Ignore audio context errors
  }
}

/**
 * Web Speech Synthesis Controller
 */
export class SpeechController {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.keepAliveTimer = null;
  }

  isSupported() {
    return Boolean(this.synth && typeof window.SpeechSynthesisUtterance !== "undefined");
  }

  getAvailableVoices() {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    return Array.isArray(voices) ? voices : [];
  }

  speak(text, { voice = null, rate = 1.0, pitch = 1.0, onStart, onEnd, onError, onBoundary } = {}) {
    if (!this.isSupported()) {
      if (onError) onError("Speech Synthesis is not supported in this browser.");
      return;
    }

    // Play high-tech broadcast chime
    playBroadcastChime();

    // Cancel existing audio
    this.stop();

    // Chromium paused state fix
    if (this.synth.paused) {
      this.synth.resume();
    }

    // Small timeout to allow synth.cancel() to finalize
    setTimeout(() => {
      try {
        const utterance = new window.SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance;

        if (voice) {
          utterance.voice = voice;
        }
        utterance.rate = Math.max(0.5, Math.min(2.0, rate));
        utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));
        utterance.lang = voice?.lang || "en-US";

        utterance.onstart = () => {
          if (onStart) onStart();
        };

        utterance.onend = () => {
          this.cleanup();
          if (onEnd) onEnd();
        };

        utterance.onerror = (e) => {
          this.cleanup();
          // "interrupted" or "canceled" errors happen on user stop/re-trigger
          if (e.error === "interrupted" || e.error === "canceled") {
            return;
          }
          console.warn("SpeechSynthesis error:", e);
          if (onError) onError(e);
        };

        if (onBoundary) {
          utterance.onboundary = onBoundary;
        }

        // Double check resume before speaking
        if (this.synth.paused) {
          this.synth.resume();
        }

        this.synth.speak(utterance);

        // Keep-alive timer for Chromium speech synthesis stalling bug
        if (this.keepAliveTimer) clearInterval(this.keepAliveTimer);
        this.keepAliveTimer = setInterval(() => {
          if (this.synth && this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            this.synth.resume();
          } else {
            this.cleanup();
          }
        }, 10000);
      } catch (err) {
        console.error("Failed to execute speech utterance:", err);
        if (onError) onError(err);
      }
    }, 80);
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  stop() {
    this.cleanup();
    if (this.synth) {
      this.synth.cancel();
    }
  }

  cleanup() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  isSpeaking() {
    return Boolean(this.synth && this.synth.speaking && !this.synth.paused);
  }
}

export const speechController = new SpeechController();
