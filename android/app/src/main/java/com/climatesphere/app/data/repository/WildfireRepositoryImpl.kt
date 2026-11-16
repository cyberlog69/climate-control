package com.climatesphere.app.data.repository

import com.climatesphere.app.core.util.Resource
import com.climatesphere.app.data.remote.EonetApi
import com.climatesphere.app.data.remote.dto.EonetEventDto
import com.climatesphere.app.data.remote.dto.EonetGeometryDto
import com.climatesphere.app.domain.model.WildfireHotspot
import com.climatesphere.app.domain.repository.WildfireRepository
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.doubleOrNull
import java.time.Duration
import java.time.Instant
import java.time.format.DateTimeParseException

class WildfireRepositoryImpl(
    private val api: EonetApi
) : WildfireRepository {

    override suspend fun getOpenWildfires(limit: Int): Resource<List<WildfireHotspot>> {
        return try {
            val hotspots = api.getOpenWildfires(limit = limit)
                .events
                .mapNotNull { it.toHotspot() }
                .take(limit)

            if (hotspots.isEmpty()) {
                Resource.Error("NASA EONET returned no open wildfire events")
            } else {
                Resource.Success(hotspots)
            }
        } catch (cancellation: kotlinx.coroutines.CancellationException) {
            throw cancellation
        } catch (error: Exception) {
            Resource.Error(error.message ?: "NASA EONET feed unavailable")
        }
    }

    private fun EonetEventDto.toHotspot(): WildfireHotspot? {
        val latest = geometry.lastOrNull { it.centroid() != null } ?: return null
        val (longitude, latitude) = latest.centroid() ?: return null
        val category = categories.firstOrNull()?.title?.ifBlank { "Wildfire" } ?: "Wildfire"

        return WildfireHotspot(
            id = id,
            name = title.ifBlank { "Wildfire event" },
            region = category,
            latitude = latitude,
            longitude = longitude,
            sensor = sources.firstOrNull()?.id?.ifBlank { "NASA EONET" } ?: "NASA EONET",
            // EONET reports event locations; it does not publish FRP, brightness or confidence.
            frp = 0.0,
            brightnessTempC = 0.0,
            confidence = 0,
            activeClusters = 1,
            status = "Active",
            biome = "Wildfire event",
            detectedAgo = latest.date?.let(::relativeTime) ?: "date unavailable"
        )
    }

    private fun EonetGeometryDto.centroid(): Pair<Double, Double>? {
        val points = mutableListOf<Pair<Double, Double>>()
        collectPoints(coordinates, points)
        if (points.isEmpty()) return null

        // GeoJSON polygons repeat the first vertex at the end.
        val uniquePoints = if (points.size > 1 && points.first() == points.last()) {
            points.dropLast(1)
        } else {
            points
        }
        if (uniquePoints.isEmpty()) return null

        val longitude = uniquePoints.sumOf { it.first } / uniquePoints.size
        val latitude = uniquePoints.sumOf { it.second } / uniquePoints.size
        return longitude to latitude
    }

    private fun collectPoints(element: JsonElement, output: MutableList<Pair<Double, Double>>) {
        val array = element as? JsonArray ?: return
        val longitude = (array.getOrNull(0) as? JsonPrimitive)?.doubleOrNull
        val latitude = (array.getOrNull(1) as? JsonPrimitive)?.doubleOrNull
        if (longitude != null && latitude != null) {
            output.add(longitude to latitude)
            return
        }
        array.forEach { child -> collectPoints(child, output) }
    }

    private fun relativeTime(isoDate: String): String {
        return try {
            val minutes = Duration.between(Instant.parse(isoDate), Instant.now())
                .toMinutes()
                .coerceAtLeast(0)
            when {
                minutes < 60 -> "${minutes}m ago"
                minutes < 24 * 60 -> "${minutes / 60}h ago"
                else -> "${minutes / (24 * 60)}d ago"
            }
        } catch (error: DateTimeParseException) {
            "date unavailable"
        }
    }
}
