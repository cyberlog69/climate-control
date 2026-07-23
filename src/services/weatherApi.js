// Open-Meteo Real-Time Weather, Air Quality & Geocoding Service

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Fetch real-time current weather, 24-hour hourly forecast, and 7-day extended outlook
 */
export async function fetchWeatherData(lat, lon) {
  try {
    const url = new URL(WEATHER_BASE_URL);
    url.searchParams.append("latitude", lat);
    url.searchParams.append("longitude", lon);
    url.searchParams.append(
      "current",
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m"
    );
    url.searchParams.append(
      "hourly",
      "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,pressure_msl,cloud_cover,wind_speed_10m,uv_index"
    );
    url.searchParams.append(
      "daily",
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max"
    );
    url.searchParams.append("timezone", "auto");

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Weather API HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return processWeatherData(data);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    throw err;
  }
}

/**
 * Fetch real-time air quality & pollutant data
 */
export async function fetchAirQualityData(lat, lon) {
  try {
    const url = new URL(AIR_QUALITY_BASE_URL);
    url.searchParams.append("latitude", lat);
    url.searchParams.append("longitude", lon);
    url.searchParams.append(
      "current",
      "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi,dust,uv_index"
    );
    url.searchParams.append("timezone", "auto");

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Air Quality API HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.current || {};
  } catch (err) {
    console.warn("Error fetching air quality data:", err);
    return null;
  }
}

/**
 * Search locations using Open-Meteo Geocoding API
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = new URL(GEOCODING_BASE_URL);
    url.searchParams.append("name", query.trim());
    url.searchParams.append("count", 8);
    url.searchParams.append("language", "en");
    url.searchParams.append("format", "json");

    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((loc) => ({
      id: `${loc.id}-${loc.latitude}-${loc.longitude}`,
      name: `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ""}, ${loc.country || ""}`,
      cityName: loc.name,
      country: loc.country || "",
      admin: loc.admin1 || "",
      lat: loc.latitude,
      lon: loc.longitude,
      timezone: loc.timezone || "UTC"
    }));
  } catch (err) {
    console.error("Location search error:", err);
    return [];
  }
}

/**
 * Reverse geocode coordinates to get Location Name
 */
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          "User-Agent": "ClimateSphere-Dashboard/1.0"
        }
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || addr.state || "Custom Location";
      const country = addr.country || "";
      return {
        name: country ? `${city}, ${country}` : city,
        cityName: city,
        country: country
      };
    }
  } catch (err) {
    console.warn("Reverse geocoding failed, falling back", err);
  }
  return {
    name: `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°`,
    cityName: "Custom Coordinates",
    country: ""
  };
}

/**
 * Helper to process raw Open-Meteo response into structured UI formats
 */
function processWeatherData(data) {
  const current = data.current || {};
  const currentUnits = data.current_units || {};
  const hourly = data.hourly || {};
  const daily = data.daily || {};

  // Formatted Hourly Forecast (Next 24 Hours)
  const hourlyList = [];
  if (hourly.time) {
    const nowIdx = 0;
    for (let i = nowIdx; i < Math.min(hourly.time.length, nowIdx + 24); i++) {
      const timeStr = hourly.time[i];
      const date = new Date(timeStr);
      hourlyList.push({
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temp: Math.round(hourly.temperature_2m[i]),
        humidity: hourly.relative_humidity_2m[i],
        pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        weatherCode: hourly.weather_code[i],
        uv: hourly.uv_index ? hourly.uv_index[i] : 0,
        wind: Math.round(hourly.wind_speed_10m[i])
      });
    }
  }

  // Formatted Daily Forecast (7 Days)
  const dailyList = [];
  if (daily.time) {
    for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
      const dateStr = daily.time[i];
      const date = new Date(dateStr);
      const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      dailyList.push({
        date: dayName,
        weatherCode: daily.weather_code[i],
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        uvMax: daily.uv_index_max ? daily.uv_index_max[i] : 0,
        precipSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
        windMax: Math.round(daily.wind_speed_10m_max[i]),
        sunrise: daily.sunrise ? new Date(daily.sunrise[i]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
        sunset: daily.sunset ? new Date(daily.sunset[i]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""
      });
    }
  }

  return {
    raw: data,
    timezone: data.timezone,
    current: {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      isDay: Boolean(current.is_day),
      precipitation: current.precipitation,
      weatherCode: current.weather_code,
      cloudCover: current.cloud_cover,
      pressure: Math.round(current.pressure_msl),
      windSpeed: Math.round(current.wind_speed_10m),
      windDir: current.wind_direction_10m,
      windGusts: Math.round(current.wind_gusts_10m || current.wind_speed_10m)
    },
    units: currentUnits,
    hourly: hourlyList,
    daily: dailyList
  };
}
