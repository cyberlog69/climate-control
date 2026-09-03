package com.climatesphere.app.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class ReverseGeocodeDto(
    val city: String? = null,
    val locality: String? = null,
    val principalSubdivision: String? = null,
    val countryName: String? = null,
    val countryCode: String? = null
)
