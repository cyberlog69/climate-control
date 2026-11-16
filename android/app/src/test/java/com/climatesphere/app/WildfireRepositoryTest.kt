package com.climatesphere.app

import com.climatesphere.app.core.util.Resource
import com.climatesphere.app.data.remote.EonetApi
import com.climatesphere.app.data.remote.dto.EonetCategoryDto
import com.climatesphere.app.data.remote.dto.EonetEventDto
import com.climatesphere.app.data.remote.dto.EonetEventsResponseDto
import com.climatesphere.app.data.remote.dto.EonetGeometryDto
import com.climatesphere.app.data.remote.dto.EonetSourceDto
import com.climatesphere.app.data.repository.WildfireRepositoryImpl
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class WildfireRepositoryTest {

    private val json = Json

    private fun geometry(type: String, coordinatesJson: String, date: String = "2026-08-01T00:00:00Z") =
        EonetGeometryDto(
            date = date,
            type = type,
            coordinates = json.parseToJsonElement(coordinatesJson)
        )

    @Test
    fun pointAndPolygonEventsAreMappedToHotspots() = runBlocking {
        val api = object : EonetApi {
            override suspend fun getOpenWildfires(
                status: String,
                category: String,
                limit: Int
            ): EonetEventsResponseDto = EonetEventsResponseDto(
                events = listOf(
                    EonetEventDto(
                        id = "EONET_1001",
                        title = "Point Fire, California",
                        categories = listOf(EonetCategoryDto(id = "wildfires", title = "Wildfires")),
                        sources = listOf(EonetSourceDto(id = "InciWeb")),
                        geometry = listOf(geometry("Point", "[-120.5, 38.2]"))
                    ),
                    EonetEventDto(
                        id = "EONET_1002",
                        title = "Polygon Fire, Portugal",
                        categories = listOf(EonetCategoryDto(id = "wildfires", title = "Wildfires")),
                        sources = listOf(EonetSourceDto(id = "EFFIS")),
                        geometry = listOf(
                            geometry(
                                "Polygon",
                                "[[[-8.0, 40.0], [-7.0, 40.0], [-7.0, 41.0], [-8.0, 41.0], [-8.0, 40.0]]]"
                            )
                        )
                    )
                )
            )
        }

        val result = WildfireRepositoryImpl(api).getOpenWildfires()

        assertTrue(result is Resource.Success<*>)
        val hotspots = result.data!!
        assertEquals(2, hotspots.size)
        // GeoJSON is [longitude, latitude].
        assertEquals(38.2, hotspots[0].latitude, 0.0001)
        assertEquals(-120.5, hotspots[0].longitude, 0.0001)
        // Closed polygon ring is deduplicated before averaging.
        assertEquals(40.5, hotspots[1].latitude, 0.0001)
        assertEquals(-7.5, hotspots[1].longitude, 0.0001)
        assertEquals(0.0, hotspots[0].frp, 0.0001)
        assertEquals("InciWeb", hotspots[0].sensor)
    }

    @Test
    fun emptyFeedReturnsAnError() = runBlocking {
        val api = object : EonetApi {
            override suspend fun getOpenWildfires(
                status: String,
                category: String,
                limit: Int
            ): EonetEventsResponseDto = EonetEventsResponseDto(events = emptyList())
        }

        val result = WildfireRepositoryImpl(api).getOpenWildfires()

        assertTrue(result is Resource.Error<*>)
    }
}
