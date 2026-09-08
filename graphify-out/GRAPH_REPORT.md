# Graph Report - climate-control  (2026-09-08)

## Corpus Check
- Corpus is ~48,634 words - fits in a single context window. You may not need a graph.

## Summary
- 417 nodes · 796 edges · 23 communities (15 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.9)
- Token cost: 1,250 input · 850 output

## Community Hubs (Navigation)
- React Dashboard & UI Shell
- Android OTA Update System
- Android Repository & Domain State
- Apple Pages Converter CLI & GUI
- Web Dependencies & Packaging
- Android Jetpack Compose Screens
- Android Application & DI Container
- Telemetry & Satellite Analysis Modals
- 3D WebGL Earth Globe & Leaflet Map
- Audio Synthesis & Planetary Alerts
- Voice Briefing & Speech Synthesis
- Planetary Intelligence & Architecture
- GitHub Releases Network Service
- Linter Configuration & Rules
- React Error Boundary
- Gradle Wrapper Tooling
- Geocoding Data Transfer Objects
- Pages Converter Tool Specifications
- PWA Offline Service Worker

## God Nodes (most connected - your core abstractions)
1. `react` - 26 edges
2. `lucide-react` - 23 edges
3. `WeatherViewModel` - 22 edges
4. `LocationModel` - 19 edges
5. `PagesConverter` - 19 edges
6. `DarkPagesConverterGUI` - 13 edges
7. `AppContainer` - 12 edges
8. `AppUpdateManager` - 12 edges
9. `HomeScreen()` - 11 edges
10. `speechController` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ClimateSphere Brand Logo Vector` --conceptually_related_to--> `ClimateSphere Platform`  [INFERRED]
  public/favicon.svg → README.md
- `Planetary Atmosphere Hero Visual` --conceptually_related_to--> `ClimateSphere Platform`  [INFERRED]
  src/assets/hero.png → README.md
- `PWA Web Application Shell` --implements--> `ClimateSphere Platform`  [EXTRACTED]
  index.html → README.md
- `Release Distribution Hub` --references--> `ClimateSphere Platform`  [EXTRACTED]
  release/README.md → README.md
- `AppContainer` --calls--> `AppUpdateManager`  [EXTRACTED]
  android/app/src/main/java/com/climatesphere/app/core/di/AppContainer.kt → android/app/src/main/java/com/climatesphere/app/core/update/AppUpdateManager.kt

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Planetary Intelligence & Climate Systems** — readme_climatesphere_system, readme_threejs_earth_globe, readme_historical_time_machine, readme_nasa_wildfire_tracking, readme_renewable_energy_yield, readme_carbon_footprint_calculator [EXTRACTED 0.95]

## Communities (23 total, 4 thin omitted)

### Community 0 - "React Dashboard & UI Shell"
Cohesion: 0.08
Nodes (42): lucide-react, react, recharts, App(), AboutModal(), AirQualityCard(), CarbonFootprintCalculator(), ClimateComparisonModal() (+34 more)

### Community 1 - "Android OTA Update System"
Cohesion: 0.07
Nodes (31): AppUpdateInfo, AppUpdateManager, Downloading, DownloadState, Error, Idle, StateFlow, ReadyToInstall (+23 more)

### Community 2 - "Android Repository & Domain State"
Cohesion: 0.08
Nodes (31): Error, T, Loading, Resource, Success, getWeatherDescription(), mapAirQuality(), mapDailyForecast() (+23 more)

### Community 3 - "Apple Pages Converter CLI & GUI"
Cohesion: 0.06
Nodes (26): collect_pages_files(), Colors, main(), print_banner(), Command-Line Interface for Offline Apple .pages Converter Usage: python cli.py…, PagesConverter, Path, Offline Apple Pages (.pages) Conversion Engine Converts Apple Pages documents… (+18 more)

### Community 4 - "Web Dependencies & Packaging"
Cohesion: 0.06
Nodes (31): dependencies, clsx, leaflet, lucide-react, react, react-dom, react-leaflet, recharts (+23 more)

### Community 5 - "Android Jetpack Compose Screens"
Cohesion: 0.10
Nodes (12): ClimateSphereTheme(), MainActivity, HomeUiState, StateFlow, T, WeatherViewModel, Factory, Bundle (+4 more)

### Community 6 - "Android Application & DI Container"
Cohesion: 0.14
Nodes (12): ClimateSphereApplication, AppContainer, com, ClimateDatabase, WeatherEntity, Flow, WeatherDao, Application (+4 more)

### Community 7 - "Telemetry & Satellite Analysis Modals"
Cohesion: 0.17
Nodes (16): RFC-4180, DataExportModal(), HistoricalTimeMachine(), WildfireSatelliteCard(), buildClimateExportData(), convertToCSV(), triggerFileDownload(), DECADE_YEARS (+8 more)

### Community 8 - "3D WebGL Earth Globe & Leaflet Map"
Cohesion: 0.16
Nodes (13): leaflet, react-leaflet, three, createCloudTexture(), createEarthCanvasTexture(), EarthGlobe3D(), latLonToVector3(), vector3ToLatLon() (+5 more)

### Community 9 - "Audio Synthesis & Planetary Alerts"
Cohesion: 0.23
Nodes (5): ClimateAlertSystem(), getAlertAudioCtx(), Navbar(), audioSynth, WeatherAudioSynth

### Community 10 - "Voice Briefing & Speech Synthesis"
Cohesion: 0.22
Nodes (4): VoiceBriefingModal(), generateClimateBriefingScript(), playBroadcastChime(), speechController

### Community 11 - "Planetary Intelligence & Architecture"
Cohesion: 0.18
Nodes (11): PWA Web Application Shell, ClimateSphere Brand Logo Vector, IPCC Carbon Footprint Diagnostic, ClimateSphere Platform, Historical Climate Time Machine, NASA FIRMS Wildfire Sentinel, Renewable Solar & Wind Potential Estimator, 3D WebGL Earth Globe (+3 more)

### Community 12 - "GitHub Releases Network Service"
Cohesion: 0.40
Nodes (3): GitHubAssetDto, GitHubReleaseDto, GitHubApiService

### Community 13 - "Linter Configuration & Rules"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 15 - "Gradle Wrapper Tooling"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

## Knowledge Gaps
- **55 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `Idle` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 122 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `React Dashboard & UI Shell` to `Web Dependencies & Packaging`, `Telemetry & Satellite Analysis Modals`, `3D WebGL Earth Globe & Leaflet Map`, `Audio Synthesis & Planetary Alerts`, `Voice Briefing & Speech Synthesis`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `React Dashboard & UI Shell` to `Web Dependencies & Packaging`, `Telemetry & Satellite Analysis Modals`, `3D WebGL Earth Globe & Leaflet Map`, `Audio Synthesis & Planetary Alerts`, `Voice Briefing & Speech Synthesis`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `LocationModel` connect `Android Repository & Domain State` to `Android OTA Update System`, `Android Jetpack Compose Screens`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Dashboard & UI Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.08482142857142858 - nodes in this community are weakly interconnected._
- **Should `Android OTA Update System` be split into smaller, more focused modules?**
  _Cohesion score 0.06636500754147813 - nodes in this community are weakly interconnected._
- **Should `Android Repository & Domain State` be split into smaller, more focused modules?**
  _Cohesion score 0.0815686274509804 - nodes in this community are weakly interconnected._