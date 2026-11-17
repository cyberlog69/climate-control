# 📦 ClimateSphere Android Releases

Pre-compiled and signed binaries for ClimateSphere.

## Latest Release: `v1.6.1`

- **Binary**: `ClimateSphere-v1.6.1.apk`
- **File Size**: 2.53 MB (2,656,501 bytes)
- **Min SDK**: Android 8.0 (API 26)
- **Target SDK**: Android 15 (API 35)
- **Architecture**: Universal (`arm64-v8a`, `armeabi-v7a`, `x86_64`)
- **Signature**: 4096-bit RSA release key (same key as v1.6.0), APK Signature Scheme v2 + v3
- **SHA-256**: `A9D0E985B8233849DD0D4A8D7179221DCA6B215510AAD5CB8B64FA43A0FF9422`

### Download

- Direct download from GitHub: [ClimateSphere-v1.6.1.apk](https://github.com/cyberlog69/climate-control/releases/download/v1.6.1/ClimateSphere-v1.6.1.apk)
- Or install a local build on your Android device via USB / adb:
  ```bash
  adb install android/app/build/outputs/apk/release/ClimateSphere-v1.6.1-release.apk
  ```

### Upgrade note

v1.6.1 installs in place over v1.6.0 and keeps saved cities. Android will not install it over v1.5.2 or older because the release certificate changed in v1.6.0. Uninstall the old app first in that case. Saved cities and local settings will be lost. The v1.5.2 APK was signed with the compromised key and is no longer distributed.

### What changed

See [release_notes_v1.6.1.md](./release_notes_v1.6.1.md) for the full list of UI, data and honesty fixes.
