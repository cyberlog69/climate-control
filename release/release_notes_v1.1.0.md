# ClimateSphere v1.1.0 — In-App OTA Updater & Offline Pages Converter Suite

We are excited to release **v1.1.0** of **ClimateSphere**! This release introduces automated Over-The-Air (OTA) in-app updates for the native Android application, ESRI World Dark & Light Gray canvas map tiles, an overhauled responsive layout with landscape support, and a standalone offline Apple `.pages` desktop converter tool suite.

---

## 🤖 Native Android Application Enhancements

### 🚀 Automated In-App OTA Updater
- **GitHub Releases API Integration**: The app automatically queries GitHub Releases in the background on startup to detect newer releases.
- **Semantic Version Evaluator**: Compares the remote tag against installed `BuildConfig.VERSION_NAME`.
- **Background Streaming Downloader**: Streams the latest APK directly to the app cache with a real-time progress bar, percentage readout, and downloaded MB tracker.
- **Seamless Package Installation**: Uses Android's native `FileProvider` (`content://` URI) and launches the system `PackageInstaller` intent directly from the app.
- **Material 3 AMOLED Dark Dialog**: Modern update notification sheet with version transition pill (`v1.0.0 → v1.1.0`), scrollable changelog, and a TopAppBar update badge icon with a pulsing cyan notification dot.

---

## 🍏 Offline Apple `.pages` Desktop Converter Suite

A brand-new standalone utility in `pages-converter/`:
- **100% Offline & Private**: Converts Apple Pages (`.pages`) documents without internet access or cloud services.
- **Multi-Format Support**: Generates pixel-perfect vector PDF, reconstructed Microsoft Word (`.docx`), plain text (`.txt`), and extracts all embedded high-res images and figures.
- **Modern Dark Desktop GUI & CLI**: Includes a sleek dark-themed Tkinter GUI, a command-line interface with recursive directory scanning, and a 1-click Windows batch launcher (`run_gui.bat`).

---

## 🌐 Web & Geospatial Sentinel Updates

- **ESRI World Gray Canvas Tiles**: Replaced unauthenticated third-party map tiles in `InteractiveMap.jsx` with free, unmetered ESRI World Dark & Light Gray Canvas base and reference layers.
- **Multi-Tier Viewport Responsiveness**: Responsive layout across ultrawide, desktop, tablet, and mobile landscape screens.
- **About ClimateSphere Modal**: Direct in-app dialog linking to the live Netlify application, GitHub repository, and Android APK downloads.

---

## 📦 Binary Asset Details

- **File**: `ClimateSphere-v1.1.0.apk`
- **File Size**: 12.11 MB (12,108,108 bytes)
- **Target SDK**: Android 15 (API 35)
- **Min SDK**: Android 8.0 Oreo (API 26)
- **Architecture**: Universal (arm64-v8a, armeabi-v7a, x86_64)
- **SHA-256 Checksum**: `73A313A31D48C60865F50BFE55097634E88C4EBD896C587F70DBAC6B7D7AD2B3`

---

## 📥 Installation

Download the attached `ClimateSphere-v1.1.0.apk` below and install it directly onto any Android device running Android 8.0 or newer. Users on v1.0.0 will also receive an in-app update prompt!
