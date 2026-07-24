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

## 🚀 Deployment Guide & Platform Comparison

Since **ClimateSphere** is a modern Single Page Application (SPA) built with React 18 and Vite, it can be deployed seamlessly across a wide variety of free and enterprise cloud platforms.

### 🟢 FREE & GENEROUS FREE-TIER PLATFORMS

#### 1. [Vercel](https://vercel.com) (Recommended - Free Tier)
- **Overview**: Native creator of Next.js and premier platform for frontend web apps. Provides instant global CDN deployment, continuous integration on `git push`, and automatic SSL.
- **Deployment Steps**:
  1. Import your GitHub repository (`cyberlog69/climate-control`) on [vercel.com/new](https://vercel.com/new).
  2. Framework Preset: **Vite**.
  3. Build Command: `npm run build`.
  4. Output Directory: `dist`.
  5. Click **Deploy**.

#### 2. [Netlify](https://netlify.com) (Free Tier)
- **Overview**: High-performance global CDN with automated Git workflows, branch previews, and custom domain HTTPS.
- **Deployment Steps**:
  1. Go to Netlify Dashboard $\rightarrow$ **Add new site** $\rightarrow$ **Import from GitHub**.
  2. Build command: `npm run build`.
  3. Publish directory: `dist`.
  4. Click **Deploy Site**.

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
