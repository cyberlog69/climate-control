// Web Audio API Procedural Weather Sound Synthesizer (Zero External Audio Assets)

class WeatherAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentType = "none";
    this.masterGain = null;
    this.rainNodes = null;
    this.windNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return true;
  }

  setVolume(volume) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.2)), this.ctx.currentTime);
    }
  }

  stop() {
    if (!this.ctx) return;
    if (this.rainNodes) {
      try {
        this.rainNodes.source.stop();
        this.rainNodes.source.disconnect();
      } catch (e) {}
      this.rainNodes = null;
    }
    if (this.windNode) {
      try {
        this.windNode.source.stop();
        this.windNode.source.disconnect();
      } catch (e) {}
      this.windNode = null;
    }
    this.isPlaying = false;
    this.currentType = "none";
  }

  playRain() {
    if (!this.init()) return;
    this.stop();

    // White noise generator for procedural rain
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Low-pass filter to sound like soft raindrops
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.masterGain);

    whiteNoise.start();
    this.rainNodes = { source: whiteNoise, filter };
    this.isPlaying = true;
    this.currentType = "rain";
  }

  playWind() {
    if (!this.init()) return;
    this.stop();

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Pink noise formula for wind
      lastOut = output[i];
    }

    const pinkNoise = this.ctx.createBufferSource();
    pinkNoise.buffer = buffer;
    pinkNoise.loop = true;

    // Bandpass filter for howling wind resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    pinkNoise.connect(filter);
    filter.connect(this.masterGain);

    pinkNoise.start();
    this.windNode = { source: pinkNoise, filter };
    this.isPlaying = true;
    this.currentType = "wind";
  }

  playAura() {
    if (!this.init()) return;
    this.stop();

    // Soothing ambient space aura oscillator
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(136.1, this.ctx.currentTime); // Om / Earth frequency

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(this.masterGain);

    osc.start();
    this.windNode = { source: osc, filter };
    this.isPlaying = true;
    this.currentType = "aura";
  }

  playForWeatherCode(code) {
    const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
    const isWindy = [3, 45, 48].includes(code);

    if (isRain) {
      this.playRain();
    } else if (isWindy) {
      this.playWind();
    } else {
      this.playAura();
    }
  }
}

export const audioSynth = new WeatherAudioSynth();
