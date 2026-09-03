# 🌍 ClimateSphere | Global Realtime Climate & Weather Sentinel

[![Live Demo](https://img.shields.io/badge/Live_Web_App-climate--sphere.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://climate-sphere.netlify.app/)
[![Download APK](https://img.shields.io/badge/Download_APK-v1.0.0-06B6D4?style=for-the-badge&logo=android&logoColor=white)](https://github.com/cyberlog69/climate-control/releases/download/v1.0.0/ClimateSphere-v1.0.0.apk)
[![Release](https://img.shields.io/github/v/release/cyberlog69/climate-control?label=Release&color=06B6D4)](https://github.com/cyberlog69/climate-control/releases)
[![Android](https://img.shields.io/badge/Android-SDK_35-3DDC84?style=flat&logo=android&logoColor=white)](https://developer.android.com)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.0-7F52FF?style=flat&logo=kotlin&logoColor=white)](https://kotlinlang.org)
[![Compose](https://img.shields.io/badge/Compose-Material_3-4285F4?style=flat&logo=jetpackcompose&logoColor=white)](https://developer.android.com/jetpack/compose)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-06B6D4?style=flat)](https://open-meteo.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> 🌐 **Live Web Application (Netlify)**: [**https://climate-sphere.netlify.app/**](https://climate-sphere.netlify.app/)  
> 🤖 **Native Android APK (v1.0.0)**: [Download ClimateSphere-v1.0.0.apk](https://github.com/cyberlog69/climate-control/releases/download/v1.0.0/ClimateSphere-v1.0.0.apk)  
> 📂 **GitHub Repository**: [https://github.com/cyberlog69/climate-control](https://github.com/cyberlog69/climate-control)

---

## 📖 About ClimateSphere

**ClimateSphere** is a high-performance, cross-platform environmental intelligence and planetary monitoring system. It unites real-time atmospheric telemetry, satellite remote sensing, interactive 3D WebGL computer graphics, and native Android engineering into an open, telemetry-driven platform designed to monitor global weather, atmospheric carbon trends, wildfire clusters, and climate risks worldwide.

- **🌐 Live Web Application**: Hosted on Netlify with automated continuous deployment from GitHub: [**https://climate-sphere.netlify.app/**](https://climate-sphere.netlify.app/)
- **🤖 Native Android App**: Engineered from scratch with **Kotlin 2.0**, **Jetpack Compose (Material 3)**, and **Room SQLite** for instant 0ms offline sync and Material You dynamic wallpaper tinting.
- **🛰️ Satellite & Open Science**: 100% powered by Open-Meteo and NASA FIRMS (MODIS/VIIRS) with zero commercial API keys required.
- **📱 Responsive & Cross-Device**: Seamlessly adapts across mobile phones, tablets, landscape orientations, and ultrawide desktop control room monitors.

---

## 🌟 Features & Enhancements

### 1. 🌐 3D Interactive WebGL Earth Globe Mode
- **Three.js WebGL Engine**: Photorealistic 3D spinning planetary globe featuring procedural topographical continents, oceans, latitude/longitude coordinate grid rings, and glowing atmospheric cyan aura.
- **Dual Map Toggle**: Seamlessly switch between **3D Earth Globe** and **2D Leaflet Flat Map** views with full state synchronization.
- **Interactive Raycaster**: Click anywhere on the 3D globe surface to reverse-geocode coordinates and inspect live local climate metrics.
- **Dynamic Hotspot Markers & Pulse Rings**: Animated 3D marker pins and expanding pulse waves for active locations and global climate hotspots (Svalbard, Amazon, Great Barrier Reef, etc.).
- **Camera Flight & Orbit Controls**: Smooth spherical flight animation (`flyTo`), mouse/touch orbit drag rotation, zoom in/out controls, and auto-rotation toggle.

### 2. ⏳ Historical Climate "Time Machine" (1950 – 2026)
- **Decade Scrubber & Time-Lapse Player**: Step through 75+ years of climate history (1950 $\rightarrow$ 2026) or click **Play Time-Lapse** to auto-animate climate shifts across decades.
- **Multi-Metric Historical Shift Analysis**: Compares historical mean temperatures, atmospheric $\text{CO}_2$ concentration (311 ppm $\rightarrow$ 428 ppm), extreme heatwave days/year, and precipitation volume.
- **75-Year Trajectory Curve**: Recharts interactive thermal trajectory curve with pinpointed active decade indicators and automated natural language diagnostic comparisons.

### 3. 🛰️ Real-Time NASA Wildfire & Thermal Hotspot Satellite Feeds
- **Orbital Infrared Telemetry**: Near-realtime tracking of global active wildfire clusters and thermal anomalies powered by NASA FIRMS (VIIRS-SNPP, MODIS-Aqua/Terra, VIIRS-NOAA20).
- **Interactive Map & Globe Overlays**: 3D pulsating flame cones on the WebGL globe and thermal density layers on 2D Leaflet maps showing Fire Radiative Power (FRP in Megawatts), brightness temperature (°C), and detection timestamps.
- **Local Proximity Fire Risk Index**: Evaluates regional wildfire danger levels (Low $\rightarrow$ Extreme) and measures exact distance in kilometers to the nearest active fire cluster.

### 4. ⚡ Renewable Energy Yield Estimator (Solar & Wind Potential)
- **Solar PV Production Modeling**: Computes Peak Sun Hours (PSH), Global Horizontal Irradiance (GHI in $\text{W/m}^2$), daily/annual output ($\text{MWh/year}$), and capacity factors based on configurable array size ($1\text{ kWp}$ to $15\text{ kWp}$).
- **Wind Kinetic Energy Density**: Models wind power density ($\text{W/m}^2$), wind shear scaling to $50\text{m}$ hub heights ($\frac{1}{2}\rho v^3$), and micro-turbine annual outputs.
- **24-Hour Diurnal Generation Profile**: Interactive Recharts area chart plotting the daytime solar bell curve vs wind power curves.
- **Ecological & Utility ROI**: Calculates annual $\text{CO}_2$ emissions avoided ($\text{kg CO}_2\text{e/yr}$), tree offset equivalents, and estimated annual utility electricity savings ($/year).

### 5. 📉 Interactive Personal Carbon Footprint & Offset Calculator
- **4-Pillar IPCC Emissions Diagnostic**: Calculates personal greenhouse gas emissions ($t\text{CO}_2\text{e/year}$) across Daily Mobility (vehicles, weekly km), Aviation (short/long-haul flights), Home Energy (kWh/month, renewable grid %), and Diet Profiles (High-Meat $\rightarrow$ Vegan).
- **Paris 2030 Climate Benchmark**: Compares personal footprint against the Paris Agreement $2.0\text{ t}$ threshold, global average ($4.5\text{ t}$), and US average ($14.5\text{ t}$).
- **Actionable Net-Zero Offset Roadmap**: Interactive mitigation milestones checklist (EV transition, green electricity tariffs, plant-rich meals) with real-time emissions reductions and tree planting offset equivalents.

### 6. 🔖 Multi-City Watchlist & Custom Pinboard
- **Multi-City Telemetry Matrix**: Bookmark and pin multiple global cities simultaneously (persisted in `localStorage`) to monitor live temperatures, AQI statuses, wind speeds, and humidity at a glance.
- **1-Click Sentinel Quick-Switch**: Instantly fly the 3D WebGL Earth Globe or 2D Map camera to any pinned city with one click.
- **In-Modal City Search & Pinning**: Integrated global geocoding search to discover and pin unlimited cities worldwide.

### 7. 🎙️ AI Voice Climate Briefing (Browser Speech Synthesis)
- **Natural-Language Daily Intelligence Briefing**: Synthesizes executive planetary weather briefings, AQI advisories, atmospheric pressure changes, and global carbon vitals for any active city using the native **Web Speech Synthesis API** (100% free, zero external API keys).
- **Animated Audio Waveform Visualizer**: 24-channel pulsating frequency equalizer bars synchronized with active voice playback.
- **Dynamic Teleprompter & Playback Controls**: Live script auto-scroller, system voice accent selector (US, UK, etc.), variable playback speeds (`0.8x`, `1.0x`, `1.2x`, `1.5x`), and 1-click script clipboard export.

### 8. 📥 CSV & JSON Raw Climate Data Exporter
- **Multi-Stream Research Datasets**: Export comprehensive planetary telemetry formatted in standard **RFC 4180 CSV** or **Structured GeoJSON / JSON** for data science pipelines (Python / Pandas / R / Google Sheets / Jupyter).
- **Custom Stream Selection**: Toggle individual streams including 24-Hour Hourly Forecasts, 7-Day Synoptic Weather, Air Quality & Particulates ($\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{O}_3$), 75-Year Historical Trajectories (1950–2026), Solar/Wind Renewable Yields, and Active NASA Wildfire Hotspots.
- **Live Monospace Preview Terminal**: Real-time syntax preview of the output payload with dynamic byte size and row count calculations before downloading.

### 9. 🔮 AI Climate Impact Scenario Simulator
- **Warming Scenario Slider**: Model future environmental impacts at **+1.5°C**, **+2.0°C**, **+3.0°C**, and **+4.0°C** global warming scenarios.
- **Local Stress Projections**: Calculates coordinate-specific projections for:
  - 🌊 **Sea Level Rise Inundation**: Projected coastal surge in meters.
  - 💥 **Annual Heatwave Days**: Extra days per year exceeding $35^\circ\text{C}$.
  - 💧 **Drought Deficit**: Percentage surge in regional water stress.
  - 🌾 **Agricultural Impact**: Predicted staple crop yield reduction.

### 10. ⚔️ Dual-City Climate Comparison Mode
- **Side-by-Side Analysis**: Compare any two global cities (e.g. *Tokyo vs. London* or *New York vs. Svalbard*) in real time.
- **Thermal & Environmental Delta**: Displays live temperature differences, AQI index comparisons, wind speeds, and atmospheric pressure gaps.

### 11. 🔊 Procedural Ambient Weather Audio Synthesizer
- **Web Audio API Engine**: Synthesizes soothing procedural raindrops, atmospheric wind howls, or space aura frequencies matching active weather conditions with zero external audio assets.

### 12. 📄 1-Click Diagnostic Health Report Export
- **PDF & Print Snapshot**: Generate formatted Environmental Health Diagnostic Reports with coordinates, AQI scores, 7-day weather tables, and safety advisories for instant printing or PDF saving.

### 13. 🚨 Live Climate Emergency Alert System
- **Real-Time Hazard Evaluator**: Detects extreme heatwaves ($\ge 38^\circ\text{C}$), gale winds ($\ge 50\text{ km/h}$), hazardous AQI ($>150$), and severe thunderstorms.
- **Synthesized Audio Ping**: Web Audio chime alerts when critical warnings fire.
- **Alert Hub Drawer**: Modal drawer to review, filter, and dismiss active environmental advisories.

### 14. 👆 Touch Swipe Gestures & Mobile Bottom Sheet
- **Touch Swipe Navigation**: Swipe left or right on mobile devices to switch between command terminal tabs.
- **Mobile Bottom Sheet Drawer**: On small viewports, the command panel becomes a slideable bottom sheet with touch handles and min 44px hit targets.

### 15. 🌗 Dark / Light Mode Theme Toggle
- **Persistent Preferences**: Theme state (`dark` or `light`) saved to `localStorage`.
- **Dynamic Leaflet Tiles**: Automatically switches between **ESRI World Dark Gray Canvas** and **ESRI World Light Gray Canvas** base layers with transparent reference boundary overlays (100% free, unmetered, zero API key watermarks).

---

## 🚀 Deployment Guide & Platform Comparison

Since **ClimateSphere** is a modern Single Page Application (SPA) built with React 18 and Vite, it can be deployed seamlessly across a wide variety of free and enterprise cloud platforms.

### 🟢 FREE & GENEROUS FREE-TIER PLATFORMS

#### 1. [Netlify](https://climate-sphere.netlify.app/) — *Currently Live in Production* 🟢
- **Live URL**: [**https://climate-sphere.netlify.app/**](https://climate-sphere.netlify.app/)
- **Configuration**: Fully automated continuous deployment configured via [`netlify.toml`](./netlify.toml) and [`public/_redirects`](./public/_redirects) for instant Git push builds, client-side SPA routing (`/* -> /index.html 200`), and edge asset caching.

#### 2. [Vercel](https://vercel.com) (Free Tier)
- **Overview**: Native creator of Next.js and premier platform for frontend web apps. Provides instant global CDN deployment, continuous integration on `git push`, and automatic SSL.
- **Deployment Steps**:
  1. Import your GitHub repository (`cyberlog69/climate-control`) on [vercel.com/new](https://vercel.com/new).
  2. Framework Preset: **Vite**.
  3. Build Command: `npm run build`.
  4. Output Directory: `dist`.
  5. Click **Deploy**.

#### 3. [GitHub Pages](https://pages.github.com) (100% Free)
- **Overview**: Host directly from your existing GitHub repository using GitHub Actions.
- **Deployment Steps**:
  1. In your GitHub repository, go to **Settings** $\rightarrow$ **Pages**.
  2. Under **Source**, select **GitHub Actions**.
  3. Use the standard static site GitHub Action workflow targeting `npm run build` and publishing `dist/`.

#### 4. [Cloudflare Pages](https://pages.cloudflare.com) (Free Tier - Unlimited Bandwidth)
- **Overview**: Powered by Cloudflare's ultra-fast global edge network spanning 300+ cities. Offers unlimited free bandwidth.
- **Deployment Steps**:
  1. Connect GitHub repository in Cloudflare Pages dashboard.
  2. Build command: `npm run build`.
  3. Build output directory: `dist`.

#### 5. [Render](https://render.com) (Free Tier)
- **Overview**: Modern cloud provider supporting free static sites with fully managed TLS certificates and instant previews.
- **Deployment Steps**:
  1. Create a **New Static Site** on Render.
  2. Connect GitHub repository $\rightarrow$ Build command: `npm run build` $\rightarrow$ Publish directory: `dist`.

---

### 🔵 PAID & ENTERPRISE CLOUD PLATFORMS

#### 6. Amazon Web Services (AWS - S3 + CloudFront)
- **Overview**: Enterprise-grade infrastructure. Store compiled static assets in Amazon S3 and distribute worldwide via Amazon CloudFront CDN with Route 53 DNS.
- **Cost Structure**: Pay-as-you-go (approx. $0.50 – $5/month depending on traffic).
- **Deployment Steps**:
  1. Create an S3 Bucket enabled for static website hosting.
  2. Run `npm run build` and upload the contents of `dist/` to the S3 bucket using AWS CLI:
     ```bash
     aws s3 sync dist/ s3://your-climate-bucket --delete
     ```
  3. Create a CloudFront Distribution pointing to the S3 bucket origin and enable custom SSL certificate via AWS Certificate Manager.

#### 7. Google Cloud Platform (GCP - Cloud Storage + Cloud CDN / Firebase Hosting)
- **Overview**: Google's global infrastructure offering high availability and fast edge caching.
- **Options**:
  - **Firebase Hosting** (Free tier available, then $0.15/GB): Run `firebase deploy`.
  - **GCP Cloud Storage + Cloud CDN**: Upload `dist/` to a public GCP Cloud Storage bucket behind HTTPS Load Balancer.

#### 8. Microsoft Azure (Azure Static Web Apps)
- **Overview**: Tailored for enterprise frontend applications with native GitHub Actions CI/CD pipeline integration and SLA guarantees.
- **Cost Structure**: Free plan available; Standard plan starting at $9/app/month for enterprise SLA & custom routing.
- **Deployment Steps**:
  1. Create an Azure Static Web App resource in the Azure Portal.
  2. Connect GitHub repo; Azure automatically commits a `.github/workflows/azure-static-web-apps.yml` pipeline.

#### 9. DigitalOcean (App Platform)
- **Overview**: Developer-centric cloud hosting with automated builds from GitHub.
- **Cost Structure**: $0 Starter tier (3 static sites free), or $5/month Basic tier.
- **Deployment Steps**:
  1. Create a new App on DigitalOcean App Platform.
  2. Select GitHub repo `cyberlog69/climate-control` $\rightarrow$ Set build command `npm run build` and output dir `dist`.

---

### 🌐 Web & PWA Stack
| Component | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev) + [Vite 8](https://vite.dev) |
| **PWA & Offline** | Web App Manifest + Service Worker Cache-First Engine |
| **3D Planetary WebGL** | [Three.js](https://threejs.org) (Procedural Earth Globe, Atmosphere Shaders, Orbit Controls) |
| **Styling** | Vanilla CSS (Design Tokens, Glassmorphism, Responsive Grid) |
| **Interactive Mapping** | [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org) + [CartoDB Dark/Light Tiles](https://carto.com) |
| **Data Visualizations** | [Recharts](https://recharts.org) (Area & Bar Charts) |
| **Voice & Audio** | Native Web Speech Synthesis API & Web Audio Synthesizer |
| **Iconography** | [Lucide React](https://lucide.dev) |
| **Weather & Air Quality API** | [Open-Meteo API](https://open-meteo.com) (Free, no API key required) |

### 🤖 Native Android Stack
| Component | Technology / Library |
| :--- | :--- |
| **Language & Tooling** | [Kotlin 2.0](https://kotlinlang.org) + Gradle 8.11 Version Catalog (`libs.versions.toml`) |
| **UI Toolkit** | [Jetpack Compose 2024](https://developer.android.com/jetpack/compose) + Material 3 Dark Palette |
| **Local Database & Cache** | [Room 2.6](https://developer.android.com/training/data-storage/room) + SQLite + Google KSP |
| **Networking & Parsing** | [Retrofit 2.11](https://square.github.io/retrofit/) + OkHttp + `kotlinx.serialization` |
| **Location Telemetry** | Google Play Services `FusedLocationProviderClient` + Native Android `Geocoder` |
| **Design System** | Adaptive App Icon with **Material You Themed Icons** (`<monochrome>`) |

---

## 🤖 Native Android App (Kotlin & Jetpack Compose)

[![Download APK](https://img.shields.io/badge/Download_APK-v1.0.0-06B6D4?style=for-the-badge&logo=android&logoColor=white)](https://github.com/cyberlog69/climate-control/releases/download/v1.0.0/ClimateSphere-v1.0.0.apk)

ClimateSphere features a 100% native Android application built with modern Android standards in [`android/`](./android):

### 🌟 Key Highlights & Architecture:
- **⚡ 0ms Cold Startup & Offline Cache**: Powered by a Room SQLite database acting as the Single Source of Truth. Cached weather is emitted instantly on launch, followed by silent background synchronization with Open-Meteo.
- **📍 Smart Auto-Locate & Dual Reverse-Geocoding**:
  - Automatically queries Google Play Services `FusedLocationProviderClient` on startup.
  - Native `android.location.Geocoder` resolves coordinates into your real city, state, and country names, with an automatic fallback client to ensure location resolution always succeeds.
- **🎨 Material You Dynamic Themed App Icon (Android 13+)**:
  - Full adaptive icon support with `<monochrome>` layer that dynamically tints with your phone's wallpaper palette.
- **🖤 AMOLED Pure Black Theme**: Deep `#000000` background and `#06B6D4` cyan accents designed to maximize battery efficiency on mobile OLED displays.
- **📊 Synoptic Dashboard**:
  - Prominent temperature hero card with feels-like, humidity, wind, and surface pressure.
  - 24-hour horizontal forecast scroll with rain probabilities and WMO condition emojis.
  - Color-coded EPA Air Quality Index with PM2.5, PM10, Carbon Monoxide, and Ozone breakdown.
  - 7-day extended outlook with min/max thermal bars.
- **🔍 Debounced Global City Search**: Instant location autocompletion dialog powered by Open-Meteo Geocoding.

### 📦 Download Pre-Built APK:
- **Direct Download**: Get the latest signed [ClimateSphere-v1.0.0.apk](https://github.com/cyberlog69/climate-control/releases/download/v1.0.0/ClimateSphere-v1.0.0.apk) from the [Releases](https://github.com/cyberlog69/climate-control/releases) page.
- **Local Copy**: Also packaged in `release/ClimateSphere-v1.0.0.apk`.

### 🛠️ Building the Android App from Source:
```bash
cd android

# Compile and package Release APK (Optimized, ~12 MB)
./gradlew assembleRelease       # Linux / macOS
.\gradlew.bat assembleRelease   # Windows

# Output APK path:
# android/app/build/outputs/apk/release/ClimateSphere-v1.0.0-release.apk
```
Or open the `android/` folder directly in **Android Studio Ladybug / Meerkat** and click **Run ▶**.

---

## 📱 PWA Installation Guide

ClimateSphere also runs as a modern, responsive **Progressive Web App (PWA)**:

1. Open [**climate-sphere.netlify.app**](https://climate-sphere.netlify.app/) in **Google Chrome / Edge / Safari / Firefox Mobile** on any device.
2. Tap the browser menu and select **"Add to Home Screen"** or **"Install ClimateSphere"**.
3. ClimateSphere installs as a standalone web app with offline caching support.

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

4. **Build for Web Production**
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
