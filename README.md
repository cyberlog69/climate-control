# 🌍 ClimateSphere | Global Realtime Climate & Weather Sentinel

[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-06B6D4?style=flat)](https://open-meteo.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**ClimateSphere** is a high-performance, dark/light glassmorphism interactive web application and planetary control room dashboard designed to monitor real-time global weather, atmospheric greenhouse gas metrics, sea level rise, temperature anomalies, air quality indexes, and severe climate alerts worldwide.

---

## 🌟 Features & Enhancements

### 1. 🔮 AI Climate Impact Scenario Simulator
- **Warming Scenario Slider**: Model future environmental impacts at **+1.5°C**, **+2.0°C**, **+3.0°C**, and **+4.0°C** global warming scenarios.
- **Local Stress Projections**: Calculates coordinate-specific projections for:
  - 🌊 **Sea Level Rise Inundation**: Projected coastal surge in meters.
  - 💥 **Annual Heatwave Days**: Extra days per year exceeding $35^\circ\text{C}$.
  - 💧 **Drought Deficit**: Percentage surge in regional water stress.
  - 🌾 **Agricultural Impact**: Predicted staple crop yield reduction.

### 2. ⚔️ Dual-City Climate Comparison Mode
- **Side-by-Side Analysis**: Compare any two global cities (e.g. *Tokyo vs. London* or *New York vs. Svalbard*) in real time.
- **Thermal & Environmental Delta**: Displays live temperature differences, AQI index comparisons, wind speeds, and atmospheric pressure gaps.

### 3. 🔊 Procedural Ambient Weather Audio Synthesizer
- **Web Audio API Engine**: Synthesizes soothing procedural raindrops, atmospheric wind howls, or space aura frequencies matching active weather conditions with zero external audio assets.

### 4. 📄 1-Click Diagnostic Health Report Export
- **PDF & Print Snapshot**: Generate formatted Environmental Health Diagnostic Reports with coordinates, AQI scores, 7-day weather tables, and safety advisories for instant printing or PDF saving.

### 5. 🚨 Live Climate Emergency Alert System
- **Real-Time Hazard Evaluator**: Detects extreme heatwaves ($\ge 38^\circ\text{C}$), gale winds ($\ge 50\text{ km/h}$), hazardous AQI ($>150$), and severe thunderstorms.
- **Synthesized Audio Ping**: Web Audio chime alerts when critical warnings fire.
- **Alert Hub Drawer**: Modal drawer to review, filter, and dismiss active environmental advisories.

### 6. 👆 Touch Swipe Gestures & Mobile Bottom Sheet
- **Touch Swipe Navigation**: Swipe left or right on mobile devices to switch between command terminal tabs.
- **Mobile Bottom Sheet Drawer**: On small viewports, the command panel becomes a slideable bottom sheet with touch handles and min 44px hit targets.

### 7. 🌗 Dark / Light Mode Theme Toggle
- **Persistent Preferences**: Theme state (`dark` or `light`) saved to `localStorage`.
- **Dynamic Leaflet Tiles**: Automatically switches between **CartoDB Dark Matter** and **CartoDB Positron** map tiles.

---

## 🛠️ Technology Stack

| Component | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev) + [Vite 8](https://vite.dev) |
| **Styling** | Vanilla CSS (Design Tokens, Glassmorphism, Responsive Grid) |
| **Interactive Mapping** | [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org) + [CartoDB Dark/Light Tiles](https://carto.com) |
| **Data Visualizations** | [Recharts](https://recharts.org) (Area & Bar Charts) |
| **Audio Engine** | Web Audio API Procedural Synthesizer |
| **Iconography** | [Lucide React](https://lucide.dev) |
| **Weather & Air Quality API** | [Open-Meteo API](https://open-meteo.com) (Free, no API key required) |

---

## 🚀 Getting Started

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/cyberlog69/climate-control.git
   cd climate-control
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
