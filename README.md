# 🌍 ClimateSphere | Global Realtime Climate & Weather Sentinel

[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-06B6D4?style=flat)](https://open-meteo.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**ClimateSphere** is a high-performance, dark glassmorphism interactive web application and planetary control room dashboard designed to monitor real-time global weather, atmospheric greenhouse gas metrics, sea level rise, temperature anomalies, air quality indexes, and severe climate alerts worldwide.

---

## 🌟 Key Features

### 1. 🌐 Full-Screen Planetary Control Room
- **Split-Pane Layout**: Full-height interactive Leaflet map on the left (60%) combined with a floating command panel on the right (40%).
- **Dynamic Weather Particles**: Custom HTML5 Canvas engine rendering real-time rain, snowfall, or floating climate dust particles matching active weather conditions.
- **Glassmorphism Aesthetic**: Dark space backdrop (`#05070d`), frosted glass cards (`backdrop-filter: blur(20px)`), glowing neon indicators, and high-contrast typography.

### 2. 🗺️ Interactive Global Map & Hotspot Radar
- **CartoDB Dark Matter Tiles**: High-contrast dark basemap optimized for environmental data visualization.
- **Toggleable Map Layers**: Thermal heatmaps, Air Quality (AQI) markers, Wind vectors, and Cloud cover overlays.
- **Preset Climate Hotspots**: 1-click jump to critical climate zones:
  - 🧊 **Svalbard, Norway**: Rapid Arctic warming (4x global rate).
  - 🌳 **Amazon Rainforest, Brazil**: Carbon sink deforestation & drought risk.
  - 🏝️ **Malé, Maldives**: Coastal inundation & submersion danger.
  - 🏙️ **Megacities**: Tokyo, New York, London, Cairo, New Delhi, and Sydney.
- **Click-Anywhere Geolocation**: Click any point on the world map to inspect real-time weather and environmental parameters.

### 3. 📈 Earth's Vital Signs & Climate Indicators
- **Atmospheric CO₂ Level**: Live Keeling Curve ticker (~427.8 ppm) with historical trend chart modals (1958–Present).
- **Global Surface Temperature Anomaly**: +1.29°C warming index relative to the 1880–1910 pre-industrial baseline.
- **Global Sea Level Rise**: +114 mm satellite altimetry tracking (+3.4 mm/year).
- **Arctic Sea Ice Extent**: September minimum coverage metrics (4.09 M km²).

### 4. 🌤️ Live Weather & Air Quality Terminal
- **Real-Time Weather Feeds**: Live temperature, "Feels Like", humidity, wind speed & direction, atmospheric pressure, cloud cover, UV index, and sunrise/sunset.
- **US Air Quality Index (AQI)**: Color-coded health advisory gauge with pollutant breakdown for **PM2.5, PM10, Nitrogen Dioxide (NO₂), Ground Ozone (O₃), SO₂**, and **CO**.
- **Global Location Search**: Debounced city search with instant geocoding.
- **Temperature Unit Switcher**: Toggle seamlessly between **°C** and **°F**.

### 5. 📊 Forecasts & Historical Warming Trajectories
- **24-Hour Hourly Forecast**: Interactive Recharts area chart for temperature curves and precipitation probability.
- **7-Day Extended Outlook**: Daily weather condition cards, min/max thermal ranges, and rain accumulation totals.
- **Regional Climate Trajectory**: Visualizes location-specific thermal shifts from 1950 baselines to 2026.
- **Global Climate Anomaly Radar**: Real-time alert feed tracking marine heatwaves, permafrost thaws, urban smog advisories, and wildfire ignition risks.

---

## 🛠️ Technology Stack

| Component | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev) + [Vite 8](https://vite.dev) |
| **Styling** | Vanilla CSS (Design Tokens, Glassmorphism, Responsive Grid) |
| **Interactive Mapping** | [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org) + [CartoDB Dark Tiles](https://carto.com) |
| **Data Visualizations** | [Recharts](https://recharts.org) (Area & Bar Charts) |
| **Iconography** | [Lucide React](https://lucide.dev) |
| **Weather & Air Quality API** | [Open-Meteo API](https://open-meteo.com) (Free, no API key required) |
| **Geocoding** | Open-Meteo Geocoding & Nominatim Reverse Geocoding |
| **Climate Baselines** | NASA GISS, NOAA, Mauna Loa Keeling Curve Datasets |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18.0 or higher)
- `npm` or `yarn`

### Installation & Local Setup

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
   Generates optimized code-split vendor bundles in `dist/`.

---

## ⚡ Performance & Code-Splitting

The application is optimized with Vite vendor code-splitting to ensure fast page loads:
- **`vendor-react`**: React & React-DOM core
- **`vendor-leaflet`**: Leaflet & React-Leaflet mapping engine
- **`vendor-recharts`**: Recharts charting library
- **`vendor-icons`**: Lucide iconography
- **`index`**: Application components & logic (~47 kB)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
