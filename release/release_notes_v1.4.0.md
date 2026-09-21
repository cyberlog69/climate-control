# ClimateSphere v1.4.0 — Carbon Footprint Engine, WorkManager Sync & Hardware Barometer

We are thrilled to announce **v1.4.0** of **ClimateSphere**! This release delivers the complete **🟡 P1** product and engineering milestone for the native Android application (`com.climatesphere.app`), achieving feature parity with the web platform's carbon engine, background hazard notifications via WorkManager, and real-time storm detection using on-device hardware pressure sensors.

---

## 🚀 Key Highlights & New Features

### 1. 🌿 Native Carbon Footprint Engine (Room Persistent)
- **IPCC & GHG Protocol Compliant Calculations**: Full personal emissions engine modeling transport, aviation (short/long haul), home electricity grid mix, diet profiles, and consumption habits.
- **Actionable Mitigation Milestones**: Interactive reduction milestones (EV transition, 100% renewable grid, plant-rich diet, flight avoidance, circular consumption) with real-time deduction counters.
- **Paris Climate Accord Benchmark**: Live visual progress comparing your footprint against the Paris $2.0\text{ tCO}_2\text{e}$ target limit, offset tree equivalents ($1\text{ tree} \approx 21.8\text{ kg CO}_2/\text{yr}$), and category breakdown tags.
- **Room SQLite Persistence**: Saves your lifestyle inputs and footprint history across sessions in the `carbon_profiles` table (`CarbonDao`, Database v3).

### 2. ⚡ WorkManager Periodic Weather Sync & Severe Weather Alerts
- **Low-Power Background Worker (`WeatherSyncWorker`)**: Periodic background sync (3–6 hours) with `NetworkType.CONNECTED` and `BatteryNotLow` constraints.
- **Background Room Synchronization**: Keeps cached telemetry and Glance AppWidgets up-to-date even when the app is closed.
- **Automated Severe Weather Hazard Detection**:
  - 🌡️ **Extreme Heatwave Warning**: Temperature $\ge 38^\circ\text{C}$ ($100.4^\circ\text{F}$).
  - ❄️ **Freezing Advisory**: Temperature $\le 0^\circ\text{C}$ ($32^\circ\text{F}$).
  - 💨 **High Wind Advisory**: Wind gusts $\ge 50\text{ km/h}$.
  - ☣️ **Hazardous Air Quality Alert**: US AQI $\ge 150$ or $\text{PM}_{2.5} \ge 55\ \mu\text{g/m}^3$.
- **Notification Channel (`weather_alerts_channel`)**: Native Android high-priority notifications with Android 13+ `POST_NOTIFICATIONS` runtime support.

### 3. ⏱️ Hardware Barometer & Rapid Drop Storm Detection
- **Native `Sensor.TYPE_PRESSURE` Integration**: Directly samples device atmospheric pressure in $\text{hPa}$ via `SensorManager`.
- **Barometric Tendency Analysis**: Real-time evaluation of pressure delta ($\Delta\text{hPa}$) categorizing trends into Rising ↗, Steady →, Falling ↘, and Rapid Drop ⚠️.
- **Impending Storm Warning**: Instant warning banner triggered if pressure drops by $\ge 2.5\text{ hPa}$ within the tracking window, warning of approaching storm fronts even offline without internet.
- **Graceful Station Fallback**: Automatically falls back to Open-Meteo station surface pressure if the device lacks a physical hardware barometer.

---

## 📦 Binary Asset Details

- **File**: `ClimateSphere-v1.4.0.apk`
- **File Size**: 13.88 MB (13,885,387 bytes)
- **Target SDK**: Android 15 (API 35)
- **Min SDK**: Android 8.0 Oreo (API 26)
- **Version Code**: `5`
- **Version Name**: `1.4.0`
- **Architecture**: Universal (arm64-v8a, armeabi-v7a, x86_64)
- **SHA-256 Checksum**: `C660EDDC4D53A2804D6B5758BCCDE3BCF18602419F873684B50B88A9FEEC7C67`

---

## 📥 Installation

Download `ClimateSphere-v1.4.0.apk` directly onto any Android device running Android 8.0 or newer. Existing users running v1.0.0, v1.1.0, v1.2.0, or v1.3.0 will also automatically receive an in-app OTA update prompt!
