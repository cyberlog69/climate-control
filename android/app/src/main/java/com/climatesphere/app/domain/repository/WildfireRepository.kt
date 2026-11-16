package com.climatesphere.app.domain.repository

import com.climatesphere.app.core.util.Resource
import com.climatesphere.app.domain.model.WildfireHotspot

interface WildfireRepository {
    suspend fun getOpenWildfires(limit: Int = 12): Resource<List<WildfireHotspot>>
}
