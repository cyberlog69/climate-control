// GitHub Releases Service for ClimateSphere Android APK & Web App Versions
// Queries official GitHub API to dynamically retrieve the latest release tag,
// direct APK asset download URL, and binary file size with localStorage caching.

const GITHUB_REPO_OWNER = "cyberlog69";
const GITHUB_REPO_NAME = "climate-control";
const GITHUB_RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
const CACHE_KEY = "climatesphere_latest_github_release";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache to respect GitHub API rate limits

// Known baseline fallback if GitHub API is unreachable or rate-limited
export const FALLBACK_RELEASE_INFO = {
  version: "v1.2.0",
  fileName: "ClimateSphere-v1.2.0.apk",
  downloadUrl: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/download/v1.2.0/ClimateSphere-v1.2.0.apk`,
  sizeFormatted: "13.7 MB",
  releaseUrl: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`,
  releaseTitle: "ClimateSphere v1.2.0 — Multi-City Watchlist Pager & Glance AppWidgets",
  publishedAt: "2026-09-11"
};

/**
 * Format raw byte size into human readable string (e.g. "13.7 MB")
 * @param {number} bytes 
 * @returns {string}
 */
export function formatByteSize(bytes) {
  if (!bytes || isNaN(bytes) || bytes <= 0) return "13.7 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

/**
 * Fetches the latest published release info from GitHub with fallback and caching.
 * @returns {Promise<typeof FALLBACK_RELEASE_INFO>}
 */
export async function getLatestReleaseInfo() {
  // 1. Check localStorage cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_TTL_MS) && parsed.data) {
        return parsed.data;
      }
    }
  } catch (err) {
    console.warn("[githubReleaseApi] Cache read error:", err);
  }

  // 2. Fetch fresh data from GitHub API
  try {
    const response = await fetch(GITHUB_RELEASES_API, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const data = await response.json();
    const tag = data.tag_name || FALLBACK_RELEASE_INFO.version;
    const releaseUrl = data.html_url || `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
    const releaseTitle = data.name || `ClimateSphere ${tag}`;
    const publishedAt = data.published_at || "";

    // Locate the Android APK asset
    let apkAsset = null;
    if (Array.isArray(data.assets)) {
      apkAsset = data.assets.find(
        (asset) =>
          asset.name &&
          asset.name.toLowerCase().endsWith(".apk") &&
          !asset.name.toLowerCase().includes("-unaligned")
      );
    }

    let downloadUrl = "";
    let fileName = "";
    let sizeFormatted = "";

    if (apkAsset) {
      fileName = apkAsset.name;
      downloadUrl = apkAsset.browser_download_url;
      sizeFormatted = formatByteSize(apkAsset.size);
    } else {
      // Fallback: If no explicit APK asset listed, construct standard named asset download URL
      const cleanTag = tag.startsWith("v") ? tag : `v${tag}`;
      fileName = `ClimateSphere-${cleanTag}.apk`;
      downloadUrl = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/download/${cleanTag}/${fileName}`;
      sizeFormatted = FALLBACK_RELEASE_INFO.sizeFormatted;
    }

    const result = {
      version: tag,
      fileName,
      downloadUrl,
      sizeFormatted,
      releaseUrl,
      releaseTitle,
      publishedAt
    };

    // Save to cache
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: result
        })
      );
    } catch {
      // ignore storage quota errors
    }

    return result;
  } catch (err) {
    console.warn("[githubReleaseApi] Could not fetch latest release from GitHub, using fallback:", err);
    // Return stale cache if present, otherwise baseline fallback
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.data) {
          return parsed.data;
        }
      }
    } catch {
      // ignore
    }
    return FALLBACK_RELEASE_INFO;
  }
}
