package com.climatesphere.app.core.di

import android.content.Context
import com.climatesphere.app.data.local.ClimateDatabase
import com.climatesphere.app.data.remote.OpenMeteoApi
import com.climatesphere.app.data.repository.WeatherRepositoryImpl
import com.climatesphere.app.domain.repository.WeatherRepository
import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import java.util.concurrent.TimeUnit

class AppContainer(private val context: Context) {

    private val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    private val okHttpClient: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        }
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()
    }

    private val retrofit: Retrofit by lazy {
        val contentType = "application/json".toMediaType()
        Retrofit.Builder()
            .baseUrl("https://api.open-meteo.com/")
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory(contentType))
            .build()
    }

    val openMeteoApi: OpenMeteoApi by lazy {
        retrofit.create(OpenMeteoApi::class.java)
    }

    val database: ClimateDatabase by lazy {
        ClimateDatabase.getDatabase(context)
    }

    val weatherRepository: WeatherRepository by lazy {
        WeatherRepositoryImpl(
            context = context,
            api = openMeteoApi,
            dao = database.weatherDao()
        )
    }

    private val gitHubRetrofit: Retrofit by lazy {
        val contentType = "application/json".toMediaType()
        Retrofit.Builder()
            .baseUrl("https://api.github.com/")
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory(contentType))
            .build()
    }

    val gitHubApiService: com.climatesphere.app.data.remote.GitHubApiService by lazy {
        gitHubRetrofit.create(com.climatesphere.app.data.remote.GitHubApiService::class.java)
    }

    val appUpdateManager: com.climatesphere.app.core.update.AppUpdateManager by lazy {
        com.climatesphere.app.core.update.AppUpdateManager(
            context = context,
            api = gitHubApiService,
            okHttpClient = okHttpClient
        )
    }
}
