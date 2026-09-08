package com.climatesphere.app.data.remote

import com.climatesphere.app.data.remote.dto.GitHubReleaseDto
import retrofit2.http.GET

interface GitHubApiService {

    @GET("repos/cyberlog69/climate-control/releases/latest")
    suspend fun getLatestRelease(): GitHubReleaseDto
}
