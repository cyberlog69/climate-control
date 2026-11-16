# 📦 ClimateSphere Android Releases

Pre-compiled and signed binaries for ClimateSphere.

## Latest Release: `v1.6.0`

- **Binary**: `ClimateSphere-v1.6.0.apk`
- **File Size**: 2.52 MB (2,640,121 bytes)
- **Min SDK**: Android 8.0 (API 26)
- **Target SDK**: Android 15 (API 35)
- **Architecture**: Universal (`arm64-v8a`, `armeabi-v7a`, `x86_64`)
- **Signature**: new 4096-bit RSA release key, APK Signature Scheme v2 + v3
- **SHA-256**: `8D74BC4C10CE0147F582970EA70A61FD34923A76A10DAD85E7AEA62272FD9DE8`

### Download

- Direct download from GitHub: [ClimateSphere-v1.6.0.apk](https://github.com/cyberlog69/climate-control/releases/download/v1.6.0/ClimateSphere-v1.6.0.apk)
- Or install a local build on your Android device via USB / adb:
  ```bash
  adb install android/app/build/outputs/apk/release/ClimateSphere-v1.6.0-release.apk
  ```

### Upgrade note

The Android signing key was rotated after the previous key was exposed in the repository history. Android will not install v1.6.0 over v1.5.2 or older because the signing certificate changed. Uninstall the old app first, then install v1.6.0. Saved cities and local settings will be lost. The v1.5.2 APK was signed with the compromised key and is no longer distributed.
