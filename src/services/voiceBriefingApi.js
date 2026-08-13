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
  const temp = current.temp != null ? `${current.temp} degrees ${unit === "F" ? "Fahrenheit" : "Celsius"}` : "moderate temperatures";
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

  const scriptParts = [
    `${greeting}. Here is your ClimateSphere Planetary Intelligence Briefing for ${cityName}.`,
    `Current atmospheric conditions report ${condition}, with ambient temperature at ${temp}, humidity at ${humidity}, and wind speeds clocking ${windSpeed}.`,
    `Air quality is currently indexed at ${aqiVal}, categorized as ${aqiLevel}. ${
      aqiVal > 100
        ? "Sensitive groups are advised to limit prolonged outdoor exertion."
        : "Atmospheric particulate levels remain well within international safety baselines."
    }`,
    `On the global sentinel radar: atmospheric carbon dioxide is currently holding at 428.4 parts per million, with planetary warming anomalies trending at plus 1.29 degrees above mid-century baselines.`,
    `Thank you for monitoring Earth's vital signs with ClimateSphere. Have a productive and climate-conscious day.`
  ];

  return {
    fullScript: scriptParts.join(" "),
    paragraphs: scriptParts
  };
}

/**
 * Web Speech Synthesis Controller
 */
export class SpeechController {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.currentUtterance = null;
  }

  isSupported() {
    return Boolean(this.synth && typeof window.SpeechSynthesisUtterance !== "undefined");
  }

  getAvailableVoices() {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  speak(text, { voice = null, rate = 1.0, pitch = 1.0, onStart, onEnd, onError, onBoundary } = {}) {
    if (!this.isSupported()) {
      if (onError) onError("Speech Synthesis is not supported in this browser.");
      return;
    }

    this.stop();

    const utterance = new window.SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => onStart && onStart();
    utterance.onend = () => onEnd && onEnd();
    utterance.onerror = (e) => onError && onError(e);
    utterance.onboundary = (e) => onBoundary && onBoundary(e);

    // Chrome bug workaround: resume if paused
    if (this.synth.paused) {
      this.synth.resume();
    }

    this.synth.speak(utterance);
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
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSpeaking() {
    return Boolean(this.synth && this.synth.speaking && !this.synth.paused);
  }
}

export const speechController = new SpeechController();
