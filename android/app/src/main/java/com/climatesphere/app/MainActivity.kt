package com.climatesphere.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.climatesphere.app.core.theme.ClimateSphereTheme
import com.climatesphere.app.presentation.home.HomeScreen
import com.climatesphere.app.presentation.home.WeatherViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: WeatherViewModel by viewModels {
        val app = application as ClimateSphereApplication
        WeatherViewModel.provideFactory(app.container.weatherRepository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ClimateSphereTheme {
                HomeScreen(viewModel = viewModel)
            }
        }
    }
}
