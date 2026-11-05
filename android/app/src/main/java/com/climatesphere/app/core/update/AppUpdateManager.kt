package com.climatesphere.app.core.update

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.climatesphere.app.BuildConfig
import com.climatesphere.app.data.remote.GitHubApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient

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
}

class AppUpdateManager(
    private val context: Context,
    private val api: GitHubApiService,
    private val okHttpClient: OkHttpClient? = null
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

    fun openUpdateUrl(targetContext: Context? = null, url: String) {
        try {
            val ctx = targetContext ?: context
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            ctx.startActivity(intent)
        } catch (_: Exception) {
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
