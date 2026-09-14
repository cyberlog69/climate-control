# ClimateSphere v1.3.0 — Automatic User Location & Planetary Telemetry

We are proud to announce **v1.3.0** of **ClimateSphere**! This release completely eliminates hardcoded/predefined startup locations across both the Web and Android apps, replacing them with a high-accuracy, zero-prompt automatic geolocation engine, instant offline Room cache restoration, and hardware GPS integration.

---

## 📍 Automatic Real-Time User Geolocation

### 🌐 Web Application (`src/`)
- **Multi-Tier Geolocation Pipeline**:
  1. **HTML5 High-Accuracy GPS**: Automatically prompts and polls browser geolocation with a 4.5-second timeout and 5-minute cache.
  2. **Zero-Prompt IP-Based Fallback**: If browser GPS is denied, pending, or slow, instantly resolves the user's city and country coordinates via `geojs.io` (~50ms latency, free, zero prompts).
  3. **Local Storage Cache**: Persists `climatesphere_last_location` for instantaneous 0ms loading on subsequent visits.
- **Dynamic Startup State**: Completely removed "Tokyo, Japan" fallback. Initial state displays a clean "Detecting Location..." placeholder until coordinates resolve.

### 🤖 Native Android Application (`com.climatesphere.app`)
- **Instant Room Database Cache**: On cold launch, `WeatherViewModel` immediately retrieves the user's last-known location from SQLite Room cache (`WeatherDao.getPrimaryWeatherSync()`) for instant 0ms startup without white/blank screens.
- **Fast IP Geolocation Retrofit Endpoint**: Added `@GET suspend fun getIpLocation()` to `OpenMeteoApi` to fetch user coordinates via IP fallback in parallel with hardware GPS.
- **Hardware GPS Optimization**: Native `HomeScreen.kt` queries `FusedLocationProviderClient.lastLocation` (instant hardware cache) alongside `getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY)` for pinpoint coordinate accuracy.
- **Safe Coordinate Guarding**: Telemetry feeds are only requested once valid coordinates are obtained, preventing redundant or erroneous Atlantic Ocean `(0, 0)` network calls.

---

## 📦 Binary Asset Details

- **File**: `ClimateSphere-v1.3.0.apk`
- **File Size**: 13.75 MB (13,754,028 bytes)
- **Target SDK**: Android 15 (API 35)
- **Min SDK**: Android 8.0 Oreo (API 26)
- **Version Code**: `4`
- **Version Name**: `1.3.0`
- **Architecture**: Universal (arm64-v8a, armeabi-v7a, x86_64)
- **SHA-256 Checksum**: `605973BFF1AC40D2122D156CE00891B1ED47850A62DADA4A5F774FDBFD24BF1D`

---

## 📥 Installation

Download `ClimateSphere-v1.3.0.apk` directly onto any Android device running Android 8.0 or newer. Existing users running v1.0.0, v1.1.0, or v1.2.0 will also automatically receive an in-app OTA update prompt!
