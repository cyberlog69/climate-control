# 🛡️ Security Policy — ClimateSphere

The **ClimateSphere** project takes user security, cryptographic authenticity, device safety, and data privacy very seriously. This policy outlines our security practices, supported versions, and the process for responsibly reporting potential vulnerabilities across the **ClimateSphere Web Application** and **ClimateSphere Native Android Application** (`com.climatesphere.app`).

---

## 📋 Supported Versions

We actively provide security patches, dependency updates, and bug fixes for the current major and minor release line.

| Version Line | Status | Support Level |
|---|---|---|
| **v1.5.x** (Latest: `v1.5.2`) | :white_check_mark: Supported | Active security updates, patch releases, and maintenance |
| **v1.4.x** | :warning: Limited | Critical security patches only; upgrade to latest recommended |
| **v1.0.x – v1.3.x** | :x: End of Life | Unsupported; users should upgrade immediately |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or security-related defect in ClimateSphere, **please do NOT report it in public GitHub issues, discussions, or pull requests.**

### Preferred Reporting Channel: Private GitHub Advisory
1. Navigate to the [**ClimateSphere Security Advisories**](https://github.com/cyberlog69/climate-control/security/advisories/new) page.
2. Click **"Report a vulnerability"** to submit a private draft advisory directly to repository maintainers.
3. If the GitHub Security Advisory form is unavailable, contact the project maintainer directly via GitHub profile: [**@cyberlog69**](https://github.com/cyberlog69).

### Information to Include in Your Report
To help us triage and resolve the issue quickly, please provide:
- **Type of Issue**: (e.g., Remote Code Execution, Privilege Escalation, Information Disclosure, Insecure Deserialization, CSRF, Insecure Storage).
- **Impacted Component**:
  - Web Application (`climate-control.loggy69.workers.dev`)
  - Android Application (`com.climatesphere.app`)
  - Build Pipeline & Release Artifacts
- **Reproduction Steps / Proof of Concept (PoC)**: Clear, minimal steps or scripts demonstrating how the vulnerability can be reproduced.
- **Impact Assessment**: What an attacker could achieve if this vulnerability is exploited.
- **Proposed Fix**: Any suggested mitigations or patches (if available).

### Response SLA & Disclosure Process
- **Initial Acknowledgement**: Within **48 hours** of report receipt.
- **Triage & Status Assessment**: Within **5 business days** with a preliminary severity rating (CVSS).
- **Remediation & Patch**: A fix will be developed in a private branch, verified, and backported as appropriate.
- **Coordinated Disclosure**: We adhere to a standard **90-day coordinated disclosure timeline** (or mutually agreed earlier date once a fix has been published and released).
- **Attribution**: If you wish, we will gladly credit you in the release notes and security advisory for your responsible disclosure!

---

## 🔒 Security Architecture & Hardening

ClimateSphere implements defense-in-depth principles across both its web client and native mobile app:

### 1. Native Android Application (`com.climatesphere.app`)
- **Zero Sideload Dropper Permissions**:
  - `android.permission.REQUEST_INSTALL_PACKAGES` is **strictly forbidden**.
  - In-app OTA updates delegate download execution to the device's system browser (`Intent.ACTION_VIEW`), ensuring users maintain explicit control over file verification and installation.
- **Cryptographic Release Signing**:
  - All official release APKs are signed using a dedicated **2048-bit RSA production keystore** (`CN=ClimateSphere, O=ClimateSphere OpenSource`) with `SHA384withRSA`.
  - Both **APK Signature Scheme v1** (JAR signature) and **v2** (full binary payload digest) are enforced to protect against binary tampering.
- **Modern Target SDK & Runtime Permissions**:
  - Targets **Android 15 (API 35)** with minSdk 26 (Android 8.0 Oreo).
  - Fine/coarse location permissions (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`) are requested exclusively at runtime with clear justification and can be revoked at any time without crashing the application.
  - Background location tracking is never requested or performed.
- **Network Security & TLS Enforcement**:
  - Cleartext HTTP traffic is disabled by default. All outbound requests (Open-Meteo, NASA FIRMS, GitHub Release API) are enforced over **TLS 1.3 / HTTPS**.
- **Data Persistence Safety**:
  - Local caching is managed using Android Room ORM with SQLite parameterized queries, preventing SQL injection vulnerabilities.

### 2. Web Application (`climate-control.loggy69.workers.dev`)
- **Edge Security**: Hosted on Cloudflare Workers / Pages edge infrastructure, providing automated DDoS mitigation, TLS 1.3 encryption, and global CDN caching.
- **Client-Side Isolation**:
  - No user passwords or banking information are collected.
  - No secret keys are stored in client-side code; all external APIs consumed are public, rate-limited scientific telemetry endpoints (Open-Meteo, NASA FIRMS).
- **Modern Frontend Stack**: Built with React 19 and Vite with strict module encapsulation and tree shaking, eliminating obsolete vulnerable dependencies.

### 3. User Privacy & Zero Telemetry Harvesting
- **No Analytics / Ad Trackers**: ClimateSphere does not embed Google Analytics, Facebook Pixel, tracking beacons, advertising SDKs, or data broker telemetry.
- **100% Client-Side Calculations**:
  - Carbon footprint profiling (`CarbonCalculator.kt` / `carbonFootprintApi.js`)
  - Renewable solar & wind yield simulations (`RenewableEnergyCalculator.kt` / `renewableEnergyApi.js`)
  - IPCC AR6 climate impact models (`ClimateImpactCalculator.kt` / `climateData.js`)
  All calculations run entirely in memory on your local CPU.
- **Transient Location Processing**: Geolocation coordinates are used solely to query public weather models and are never persisted to a remote server or database.

---

## 🏆 Bug Bounty & Recognition

ClimateSphere is an open-source, community-driven project. While we do not operate a commercial cash bounty program at this time, we deeply value and respect the cybersecurity research community. Any researcher who responsibly identifies and discloses a verified vulnerability will receive:
- Public attribution in the release notes and GitHub Security Advisory (unless anonymity is requested).
- Direct collaboration with project maintainers during triage and patch development.

Thank you for helping keep ClimateSphere and our global user community secure!
