package com.climatesphere.app.core.update

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import com.climatesphere.app.BuildConfig
import com.climatesphere.app.data.remote.GitHubApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.FileOutputStream

data class AppUpdateInfo(
    val latestVersion: String,
    val currentVersion: String,
    val isUpdateAvailable: Boolean,
    val releaseTitle: String,
    val changelog: String,
    val downloadUrl: String,
    val apkSize: Long,
    val htmlUrl: String
)

sealed interface DownloadState {
    data object Idle : DownloadState
    data class Downloading(val progress: Float, val downloadedBytes: Long, val totalBytes: Long) : DownloadState
    data class ReadyToInstall(val apkFile: File) : DownloadState
    data class Error(val message: String) : DownloadState
}

class AppUpdateManager(
    private val context: Context,
    private val api: GitHubApiService,
    private val okHttpClient: OkHttpClient
) {
    private val _downloadState = MutableStateFlow<DownloadState>(DownloadState.Idle)
    val downloadState: StateFlow<DownloadState> = _downloadState.asStateFlow()

    suspend fun checkForUpdates(): Result<AppUpdateInfo> = withContext(Dispatchers.IO) {
        try {
            val release = api.getLatestRelease()
            val currentVersion = BuildConfig.VERSION_NAME
            val remoteTag = release.tagName.trim()

            val isNewer = isNewerVersion(remoteTag, currentVersion)

            // Find APK asset
            val apkAsset = release.assets.firstOrNull {
                it.name.endsWith(".apk", ignoreCase = true)
            }

            val downloadUrl = apkAsset?.browserDownloadUrl ?: release.htmlUrl ?: ""
            val apkSize = apkAsset?.size ?: 0L

            val info = AppUpdateInfo(
                latestVersion = remoteTag,
                currentVersion = currentVersion,
                isUpdateAvailable = isNewer && downloadUrl.isNotEmpty(),
                releaseTitle = release.name ?: remoteTag,
                changelog = release.body?.trim().orEmpty(),
                downloadUrl = downloadUrl,
                apkSize = apkSize,
                htmlUrl = release.htmlUrl ?: "https://github.com/cyberlog69/climate-control/releases"
            )

            Result.success(info)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun downloadApk(downloadUrl: String): Result<File> = withContext(Dispatchers.IO) {
        try {
            _downloadState.value = DownloadState.Downloading(0f, 0L, 0L)

            val updateDir = File(context.cacheDir, "updates").apply { mkdirs() }
            val apkFile = File(updateDir, "ClimateSphere-update.apk")
            if (apkFile.exists()) {
                apkFile.delete()
            }

            val request = Request.Builder().url(downloadUrl).build()
            val response = okHttpClient.newCall(request).execute()

            if (!response.isSuccessful) {
                throw IllegalStateException("Failed to download APK: HTTP ${response.code}")
            }

            val body = response.body ?: throw IllegalStateException("Empty response body from server")
            val totalBytes = body.contentLength()

            body.byteStream().use { input ->
                FileOutputStream(apkFile).use { output ->
                    val buffer = ByteArray(8 * 1024)
                    var bytesRead: Int
                    var totalRead = 0L

                    while (input.read(buffer).also { bytesRead = it } != -1) {
                        output.write(buffer, 0, bytesRead)
                        totalRead += bytesRead

                        val progress = if (totalBytes > 0) totalRead.toFloat() / totalBytes else 0f
                        _downloadState.value = DownloadState.Downloading(progress, totalRead, totalBytes)
                    }
                    output.flush()
                }
            }

            _downloadState.value = DownloadState.ReadyToInstall(apkFile)
            Result.success(apkFile)
        } catch (e: Exception) {
            val err = e.localizedMessage ?: "Download failed"
            _downloadState.value = DownloadState.Error(err)
            Result.failure(e)
        }
    }

    fun installApk(apkFile: File) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (!context.packageManager.canRequestPackageInstalls()) {
                    val settingsIntent = Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES).apply {
                        data = Uri.parse("package:${context.packageName}")
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    context.startActivity(settingsIntent)
                    return
                }
            }

            val contentUri = FileProvider.getUriForFile(
                context,
                "${context.packageName}.fileprovider",
                apkFile
            )

            val installIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(contentUri, "application/vnd.android.package-archive")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            context.startActivity(installIntent)
        } catch (e: Exception) {
            _downloadState.value = DownloadState.Error("Install failed: ${e.localizedMessage}")
        }
    }

    fun resetDownloadState() {
        _downloadState.value = DownloadState.Idle
    }

    companion object {
        fun isNewerVersion(remoteTag: String, localVersion: String): Boolean {
            val cleanRemote = remoteTag.removePrefix("v").removePrefix("V").trim()
            val cleanLocal = localVersion.removePrefix("v").removePrefix("V").trim()

            val remoteParts = cleanRemote.split(".").mapNotNull { it.toIntOrNull() }
            val localParts = cleanLocal.split(".").mapNotNull { it.toIntOrNull() }

            val maxLen = maxOf(remoteParts.size, localParts.size)
            for (i in 0 until maxLen) {
                val r = remoteParts.getOrElse(i) { 0 }
                val l = localParts.getOrElse(i) { 0 }
                if (r > l) return true
                if (r < l) return false
            }
            return false
        }
    }
}
