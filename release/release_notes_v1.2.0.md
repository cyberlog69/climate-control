# ClimateSphere v1.2.0 — Multi-City Watchlist Pager & Glance AppWidgets

We are thrilled to announce **v1.2.0** of **ClimateSphere**! This milestone release delivers the top-priority (**P0**) Android features: a persistent **Multi-City Watchlist** with a smooth swipeable **HorizontalPager**, multi-location offline caching in Room, and native **Jetpack Compose Glance Home Screen AppWidgets** (2×1 and 4×2).

---

## 🤖 Native Android Application Enhancements

### 📍 Multi-City Watchlist & Horizontal Pager
- **Room Database Storage (`WatchlistEntity` & `WatchlistDao`)**:
  - Added table `watchlist_locations` preserving user-saved cities, coordinates, order index, and timestamps across app restarts.
  - Upgraded `ClimateDatabase` to **Version 2**.
- **Location-Keyed Multi-City Offline Caching**:
  - Upgraded `WeatherDao` and `WeatherRepositoryImpl` to cache weather by coordinates slug (`loc_lat_lon`), ensuring all saved cities remain immediately viewable offline without network delays.
- **Horizontal Pager Navigation**:
  - Implemented `androidx.compose.foundation.pager.HorizontalPager` with `rememberPagerState`.
  - Swipe left and right effortlessly between your current GPS location and all tracked cities.
  - Added animated page indicator pills directly below the TopAppBar.
- **TopAppBar Watchlist Quick Controls**:
  - **Bookmark Button**: 1-tap toggles saving or removing the currently viewed city from your watchlist (cyan filled bookmark when saved, outlined when not).
  - **Watchlist Sheet Button**: 1-tap opens the new Watchlist Manager bottom sheet.
  - **Interactive Title**: Tap on the city name to immediately bring up your saved cities.
- **Watchlist Management Sheet (`WatchlistBottomSheet.kt`)**:
  - Material 3 AMOLED Dark modal sheet listing all tracked locations with active badges.
  - 1-tap to switch directly to any city page.
  - Delete action to remove cities.
  - "Add City" button that triggers the location search autocomplete dialog.

### 🧩 Native Jetpack Compose Glance AppWidgets
- **Compact Widget (2×1)**:
  - Real-time temperature readout, condition description, and color-coded air quality badge (Green/Amber/Red).
- **Expanded Widget (4×2)**:
  - Full weather hero card displaying current temperature, "feels like" metric, condition, AQI score, and wind speed telemetry.
- **Deep Integration**:
  - 1-tap anywhere on the widget instantly opens ClimateSphere (`MainActivity`).
  - Native Android widget configuration with standard metadata (`@xml/climate_widget_info`).

---

## 🌐 Web & Suite Hardening

- **Carbon Footprint Calculator**: Fixed JSX mathematical expression interpolation to ensure seamless stability across all desktop and mobile browsers.
- **Report Generator Modal**: Hardened station telemetry data formatting with comprehensive null guards.
- **Global ErrorBoundary Diagnostics**: Enhanced top-level error boundary with collapsible technical details for immediate runtime diagnostics.

---

## 📦 Binary Asset Details

- **File**: `ClimateSphere-v1.2.0.apk`
- **File Size**: 13.74 MB (13,737,644 bytes)
- **Target SDK**: Android 15 (API 35)
- **Min SDK**: Android 8.0 Oreo (API 26)
- **Version Code**: `3`
- **Version Name**: `1.2.0`
- **Architecture**: Universal (arm64-v8a, armeabi-v7a, x86_64)
- **SHA-256 Checksum**: `A43D650E6EFB7E521AD9C0B51A52B9DC183BBC0D9CA127D5E9C5754179B4E0AE`

---

## 📥 Installation

Download `ClimateSphere-v1.2.0.apk` and install it directly onto any Android device running Android 8.0 or newer. Users on v1.0.0 and v1.1.0 will also automatically receive an in-app OTA update prompt!
