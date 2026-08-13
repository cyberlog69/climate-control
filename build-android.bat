@echo off
setlocal

echo ===================================================
echo   ClimateSphere Android APK Build System
echo ===================================================

:: Check for JDK 21 LTS in user .jdks or Android Studio JBR
if "%JAVA_HOME%"=="" (
    if exist "%USERPROFILE%\.jdks\jbr-21.0.11\bin\java.exe" (
        set "JAVA_HOME=%USERPROFILE%\.jdks\jbr-21.0.11"
        echo [INFO] Located JDK 21 LTS at: %JAVA_HOME%
    ) else if exist "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
        echo [INFO] Located Android Studio Java at: %JAVA_HOME%
    )
)

:: Set ANDROID_HOME if not already set
if "%ANDROID_HOME%"=="" (
    if exist "%LOCALAPPDATA%\Android\Sdk" (
        set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
        echo [INFO] Located Android SDK at: %ANDROID_HOME%
    )
)

if not "%JAVA_HOME%"=="" (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

echo [1/3] Building Web Production Assets (Vite)...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Web build failed!
    exit /b %ERRORLEVEL%
)

echo [2/3] Syncing Capacitor Android Container...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Capacitor sync failed!
    exit /b %ERRORLEVEL%
)

echo [3/3] Compiling Native Android Debug APK (Gradle)...
cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Gradle build failed!
    cd ..
    exit /b %ERRORLEVEL%
)
cd ..

echo ===================================================
echo [SUCCESS] Android APK built successfully!
echo Location: android\app\build\outputs\apk\debug\app-debug.apk
echo ===================================================
pause
