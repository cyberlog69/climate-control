package com.climatesphere.app

import android.app.Application
import com.climatesphere.app.core.di.AppContainer

class ClimateSphereApplication : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}
