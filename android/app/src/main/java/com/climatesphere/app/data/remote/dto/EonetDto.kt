package com.climatesphere.app.data.remote.dto

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull

@Serializable
data class EonetEventsResponseDto(
    val events: List<EonetEventDto> = emptyList()
)

@Serializable
data class EonetEventDto(
    val id: String,
    val title: String = "",
    val link: String? = null,
    val categories: List<EonetCategoryDto> = emptyList(),
    val sources: List<EonetSourceDto> = emptyList(),
    val geometry: List<EonetGeometryDto> = emptyList()
)

@Serializable
data class EonetCategoryDto(
    val id: String = "",
    val title: String = ""
)

@Serializable
data class EonetSourceDto(
    val id: String? = null,
    val url: String? = null
)

@Serializable
data class EonetGeometryDto(
    val date: String? = null,
    val type: String = "",
    // GeoJSON coordinates are polymorphic: Point [lon, lat] or Polygon [[lon, lat], ...].
    val coordinates: JsonElement = JsonNull
)
