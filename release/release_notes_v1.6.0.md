# ClimateSphere v1.6.0 — Release Key Rotation & Live Wildfire Feed

**ClimateSphere v1.6.0** is a security and data-accuracy release. It rotates the Android release signing key after the previous key was exposed in the repository history, and replaces the static wildfire sample feed with live NASA EONET events.

---

## 🔐 Security: signing key rotation

- The previous release keystore and its password were exposed in git history. They have been removed from the current tree and purged from all reachable commits; **treat the old key as compromised**.
- v1.6.0 is signed with a new **4096-bit RSA keystore** using APK Signature Scheme v2 and v3. v1 signing is disabled because `minSdk` is 26.
- **Upgrading from v1.5.2 or older:** Android will not install this APK over an older build because the signing certificate changed. Uninstall the old app first, then install v1.6.0. Saved cities and local settings will be lost.
- Signing credentials are no longer committed. They are read from `android/keystore.properties` or the `CLIMATESPHERE_*` environment variables.

## 🛰️ Live wildfire events

- Web and Android now load open wildfire events from **NASA EONET** (keyless public API) instead of presenting a static dataset as live satellite telemetry.
- The bundled sample dataset remains as an offline fallback and is labelled "sample data" in both clients.
- Fire Radiative Power and brightness-temperature values are shown only for the sample dataset, because EONET does not publish them.

## 🛠️ Reliability and build hygiene

- Web: the last location and watchlist persist safely with rounded coordinates, invalid legacy entries are repaired, and location requests are guarded against out-of-order responses.
- Web: Three.js is lazy-loaded, and a Content-Security-Policy is injected at build time and shipped through the host headers.
- Android: R8 code and resource shrinking are enabled, reducing the APK from ~13.4 MB to ~2.5 MB.
- CI runs lint, Node tests, the production build, CSP checks, and Android unit tests on every push.

## 📦 Binary details

- **File**: `ClimateSphere-v1.6.0.apk`
- **Size**: 2.52 MB (2,640,121 bytes)
- **SHA-256**: `8D74BC4C10CE0147F582970EA70A61FD34923A76A10DAD85E7AEA62272FD9DE8`
- **Version code**: `9`
- **Version name**: `1.6.0`
- **Min SDK**: 26 (Android 8.0) · **Target SDK**: 35 (Android 15)
- **Signing**: new 4096-bit RSA key, APK Signature Scheme v2 + v3
