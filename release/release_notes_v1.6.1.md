# ClimateSphere v1.6.1 - UI Polish and Dual-City Fix

**ClimateSphere v1.6.1** is a UI quality release for the Android app. It fixes the dual-city comparison showing one city's weather under another city's name, removes unverifiable telemetry claims, and tightens readability, number formatting and tap targets across every screen.

---

## Data fix

- The dual-city comparison no longer shows the primary city's readings under the selected city. The primary cache row is now read and written only for the selected city, so London shows London's temperature, condition and AQI.
- A delta of zero now reads "Same as <city>" in neutral grey instead of a coloured "+0" that claimed a direction.
- Numbers use thousands separators (15,190 km, 3,494 kg, $1,331/yr) and counts are pluralized ("1 saved city", "1 cluster").
- Crop yield loss no longer prints a double negative. Heatwave and sea level copy was rewritten to say what the number means.
- Card titles, the hazard index title, EONET timestamps and daily forecast conditions reflow instead of truncating.

## Readability and touch

- Smallest type raised to 10sp, and tertiary text raised to 4.7:1 on the card gradient. Every text role was measured against its surface.
- New lighter red (`#F87171`) and violet (`#A78BFA`) tints for small text; icons, borders and LCD accents keep the saturated semantic hues.
- Flight steppers, watchlist delete, preset city chips and scenario pills now meet the 44dp minimum target.
- Daily forecast rows reflow to two lines on narrow screens, so the condition text is never clipped.
- Overflow menu and popups use the app's own dark surfaces through Material 3 surfaceContainer roles.

## Honesty and states

- Removed the "IPCC AR6", "Orbital Station", "Live Telemetry" and "Telemetry Model" claims. Model figures are labelled estimates, and the hazard and warming scores say they are estimates.
- Wildfire LEDs pulse only while a live feed is loaded. Sample data reads "Sample data, feed offline" and "Illustrative only".
- Home screen loading, offline cache, empty and error states are labelled and actionable.
- Glance widget placeholders show "No data" and "--" instead of invented readings.

## Added

- `DESIGN.md` records the existing instrument-cluster identity, palette, type floor, surface system and change rules, so future UI work stays inside the same look.

## Binary details

- **File**: `ClimateSphere-v1.6.1.apk`
- **Size**: 2.53 MB (2,656,501 bytes)
- **SHA-256**: `A9D0E985B8233849DD0D4A8D7179221DCA6B215510AAD5CB8B64FA43A0FF9422`
- **Version code**: `10`
- **Version name**: `1.6.1`
- **Min SDK**: 26 (Android 8.0) · **Target SDK**: 35 (Android 15)
- **Signing**: same 4096-bit RSA key as v1.6.0, APK Signature Scheme v2 + v3
- **Upgrading**: installs in place over v1.6.0 and keeps saved cities. v1.5.2 and older still need a clean install because of the v1.6.0 key rotation.
