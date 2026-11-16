package com.climatesphere.app.data.remote

import com.climatesphere.app.data.remote.dto.EonetEventsResponseDto
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * NASA EONET (Earth Observatory Natural Event Tracker) v3 API.
 * Keyless and public; returns currently open natural events.
 */
interface EonetApi {

    @GET("api/v3/events")
    suspend fun getOpenWildfires(
        @Query("status") status: String = "open",
        @Query("category") category: String = "wildfires",
        @Query("limit") limit: Int = 12
    ): EonetEventsResponseDto
}
