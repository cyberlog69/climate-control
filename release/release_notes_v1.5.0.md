# ClimateSphere v1.5.0 — Satellite Wildfire Radar, Renewable Yields & Dual-City Comparison (P2 Milestone)

We are thrilled to announce **v1.5.0** of **ClimateSphere**! This release delivers the complete **🚀 P2 Milestone** ("Satellite Radar & Renewable Yields") for the native Android application (`com.climatesphere.app`), achieving full feature parity with the web platform's orbital wildfire telemetry, clean energy potential modeling, IPCC AR6 warming scenario simulation, and real-time dual-city comparison.

---

## 🚀 Key Highlights & New Features

### 1. 🛰️ NASA FIRMS Orbital Wildfire Sentinel & Native Radar
- **NASA Thermal Anomaly Integration**: Direct access to NASA FIRMS (VIIRS-SNPP, MODIS-Aqua, MODIS-Terra, VIIRS-NOAA20) global thermal telemetry.
- **Proximity Hazard Index**: Real-time evaluation of local wildfire risk (Low, Moderate, High, Extreme) factoring in ambient temperature, relative humidity, wind velocity, and distance to the nearest active thermal cluster.
- **Native Radar Canvas Visualizer**: Custom Jetpack Compose Canvas radar with concentric range rings (1,000 km to 12,000 km), rotating sweeping radar beam, and pulsating thermal blips color-coded by Fire Radiative Power (FRP in Megawatts).
- **Cluster Explorer**: Interactive browsing of worldwide active fire complexes (Amazon Basin, Alberta Boreal, Siberia Taiga, California Sierra, Australian Bushlands, Peloponnese Greece, Congo Basin, Borneo Peatlands) with quick "Inspect Weather" navigation.

### 2. ⚡ Renewable Energy Yield Estimator & Diurnal Curves
- **Solar Photovoltaic (PV) Physics Model**:
  - Configurable solar array capacity slider ($1.0\text{ kWp} - 15.0\text{ kWp}$) with real-time annual yield ($\text{MWh/yr}$) and daily generation ($\text{kWh/day}$).
  - Computes coordinate-accurate Peak Sun Hours (PSH in $\text{h/day}$) and Peak Global Horizontal Irradiance (GHI in $\text{W/m}^2$).
  - Evaluates system capacity factor and solar potential ratings (Excellent / Good / Moderate).
- **Wind Kinetic Density Calculator**:
  - Micro-turbine capacity slider ($1.0\text{ kW} - 10.0\text{ kW}$).
  - $50\text{m}$ hub-height wind shear scaling using the power law ($\frac{1}{2}\rho v^3$, $\alpha \approx 0.14$).
  - Wind power density ($\text{W/m}^2$), Wind Power Class ($1 - 7$), and capacity factor modeling.
- **Combined Impact Diagnostics**: Avoided $\text{CO}_2\text{e}$ emissions ($\text{kg/yr}$), mature tree planting offset equivalence, and annual utility electricity bill savings ($\$/\text{yr}$).
- **Custom Diurnal Generation Canvas Chart**: 24-hour diurnal profile rendering daytime solar bell curves against nocturnal wind generation patterns with smooth gradients and time markers.

### 3. ⚔️ Dual-City Comparison Mode
- **Side-by-Side Analysis Sheet**: Search and compare telemetry between your active GPS location and any global city simultaneously.
- **Live Environmental Delta Indicators**:
  - Live Temperature Differential ($\Delta^\circ\text{C}$) with directional Warmer / Cooler badges.
  - Air Quality Gap ($\Delta\text{AQI}$) with Cleaner / More Polluted indicators.
  - Wind Speed Variance ($\Delta\text{km/h}$) and Barometric Pressure Gradient ($\Delta\text{hPa}$).
  - Relative Humidity variance ($\Delta\%$).
- **Detailed Metric Matrix**: Compare feels-like temperature, UV index, PM2.5, PM10, and atmospheric vitals side by side.
- **Global Quick Presets**: One-tap comparison against major world capitals (Tokyo, London, New York, Sydney, Dubai, Paris, Singapore, Cairo).

### 4. 🔮 Climate Impact Scenario Simulator
- **Global Warming Slider ($+1.0^\circ\text{C}$ to $+4.5^\circ\text{C}$)**: Interactive warming trajectory slider with Paris Accord ($+1.5^\circ\text{C}$), Critical Threshold ($+2.0^\circ\text{C}$), Severe Trajectory ($+3.0^\circ\text{C}$), and Catastrophic Risk ($+4.0^\circ\text{C}$) presets.
- **4-Metric IPCC AR6 Projections**:
  - 🌊 **Sea Level Inundation**: Projected surge in meters ($+\text{X.XX m}$) with regional coastal vulnerability detection.
  - 🌡️ **Extreme Heatwave Days**: Additional annual days exceeding the critical $>35^\circ\text{C}$ threshold.
  - 🏜️ **Agricultural Drought Stress**: Soil moisture deficit and groundwater stress risk percentage.
  - 🌾 **Crop Yield Loss**: Staple grain caloric yield reduction modeling.

---

## 📦 Binary Asset Details

- **File**: `ClimateSphere-v1.5.0.apk`
- **File Size**: 13.98 MB (13,983,691 bytes)
- **Target SDK**: Android 15 (API 35)
- **Min SDK**: Android 8.0 Oreo (API 26)
- **Version Code**: `6`
- **Version Name**: `1.5.0`
- **Architecture**: Universal (arm64-v8a, armeabi-v7a, x86_64)
- **SHA-256 Checksum**: `7FB3384010CCE2DBBF6AA10B89252F53B37AC71FF49CD856A23E0464BE3DF217`

---

## 📥 Installation

Download `ClimateSphere-v1.5.0.apk` directly onto any Android device running Android 8.0 or newer. Existing users running v1.0.0 through v1.4.0 will also automatically receive an in-app OTA update prompt!
