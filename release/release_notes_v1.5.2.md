# ClimateSphere v1.5.2 — Play Protect Hardening & Production Keystore Signing

**ClimateSphere v1.5.2** is a critical security and installation hardening patch release designed to resolve Google Play Protect heuristic flags ("harmful app / may be harmful") and ensure seamless sideloading and installations on all Android devices.

---

## 🛡️ Security & Play Protect Hardening

### 1. 🚫 Removed `REQUEST_INSTALL_PACKAGES` (Eliminated Dropper Heuristic)
- Completely removed `android.permission.REQUEST_INSTALL_PACKAGES` from `AndroidManifest.xml`.
- Replaced the in-app byte-streaming APK downloader with a clean browser-delegated download workflow:
  - Users tap **"Download APK via Browser"** in the update dialog, which safely launches the GitHub release download URL directly in their preferred web browser (`Intent.ACTION_VIEW`).
  - Sideloaded package-archive (`application/vnd.android.package-archive`) execution intents and FileProvider exposure have been removed.
  - Eliminates the heuristic pattern that Google Play Protect flags as a "Trojan Dropper".

### 2. 🔑 Production Release Keystore Signing
- Migrated away from Android's default debug keystore (`CN=Android Debug`).
- Releases are now signed with a dedicated RSA-2048 production certificate (`CN=ClimateSphere, O=ClimateSphere OpenSource`) with SHA384withRSA signature algorithm and dual v1 + v2 APK signing schemes.

### 3. 🎨 Tactical Skeuomorphic Material 3 Visuals Retained
- Preserves all tactile skeuomorphic styling introduced in v1.5.1 across Web and Android:
  - Milled instrument bezels and recessed gauge sockets.
  - Tactile physical switches and depression buttons.
  - Analog barometers and hygrometers with convex lens glare reflections.
  - Phosphor glow telemetry displays.

---

## 📦 Binary Asset Details

- **File**: `ClimateSphere-v1.5.2.apk`
- **File Size**: 13.43 MB (14,079,275 bytes)
- **Target SDK**: Android 15 (API 35)
- **Min SDK**: Android 8.0 Oreo (API 26)
- **Version Code**: `8`
- **Version Name**: `1.5.2`
- **Signing Key**: Production Keystore (`CN=ClimateSphere, O=ClimateSphere OpenSource`)
- **Architecture**: Universal (`arm64-v8a`, `armeabi-v7a`, `x86_64`)
- **SHA-256 Checksum**: `492749F0CF58921098D902ECBE00C6A520E1A0F43A9A30509FB049B1D879F83E`

---

## 📥 Installation

Download `ClimateSphere-v1.5.2.apk` directly to your Android device from GitHub Releases.
