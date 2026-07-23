// Global Climate Data, Baselines, Historical Datasets, and Preset Hotspots

export const CO2_HISTORICAL_DATA = [
  { year: 1958, ppm: 315.7 },
  { year: 1965, ppm: 319.9 },
  { year: 1970, ppm: 325.7 },
  { year: 1975, ppm: 331.1 },
  { year: 1980, ppm: 338.7 },
  { year: 1985, ppm: 346.1 },
  { year: 1990, ppm: 354.4 },
  { year: 1995, ppm: 360.8 },
  { year: 2000, ppm: 369.5 },
  { year: 2005, ppm: 379.8 },
  { year: 2010, ppm: 389.9 },
  { year: 2015, ppm: 400.8 },
  { year: 2020, ppm: 414.2 },
  { year: 2022, ppm: 418.5 },
  { year: 2024, ppm: 424.3 },
  { year: 2025, ppm: 426.1 },
  { year: 2026, ppm: 427.8 }
];

export const TEMP_ANOMALY_DATA = [
  { year: 1880, anomaly: -0.16 },
  { year: 1900, anomaly: -0.09 },
  { year: 1920, anomaly: -0.27 },
  { year: 1940, anomaly: +0.12 },
  { year: 1960, anomaly: -0.03 },
  { year: 1980, anomaly: +0.27 },
  { year: 1990, anomaly: +0.45 },
  { year: 2000, anomaly: +0.54 },
  { year: 2010, anomaly: +0.73 },
  { year: 2015, anomaly: +0.90 },
  { year: 2020, anomaly: +1.02 },
  { year: 2023, anomaly: +1.18 },
  { year: 2024, anomaly: +1.24 },
  { year: 2025, anomaly: +1.27 },
  { year: 2026, anomaly: +1.29 }
];

export const SEA_LEVEL_DATA = [
  { year: 1993, seaLevelMm: 0 },
  { year: 1997, seaLevelMm: 14 },
  { year: 2001, seaLevelMm: 25 },
  { year: 2005, seaLevelMm: 39 },
  { year: 2009, seaLevelMm: 52 },
  { year: 2013, seaLevelMm: 68 },
  { year: 2017, seaLevelMm: 83 },
  { year: 2021, seaLevelMm: 98 },
  { year: 2024, seaLevelMm: 107 },
  { year: 2026, seaLevelMm: 114 }
];

export const ARCTIC_ICE_DATA = [
  { year: 1979, extent: 7.05 },
  { year: 1985, extent: 6.70 },
  { year: 1990, extent: 6.14 },
  { year: 1995, extent: 6.08 },
  { year: 2000, extent: 5.97 },
  { year: 2005, extent: 5.31 },
  { year: 2012, extent: 3.39 },
  { year: 2015, extent: 4.41 },
  { year: 2020, extent: 3.82 },
  { year: 2024, extent: 4.28 },
  { year: 2026, extent: 4.09 }
];

export const CLIMATE_HOTSPOTS = [
  {
    id: "tokyo",
    name: "Tokyo, Japan",
    region: "Asia-Pacific",
    lat: 35.6762,
    lon: 139.6503,
    category: "Urban Heat Island",
    badge: "Megacity Heat",
    description: "Rising summer thermal indices and coastal storm surge risks."
  },
  {
    id: "new-york",
    name: "New York, USA",
    region: "North America",
    lat: 40.7128,
    lon: -74.0060,
    category: "Coastal Vulnerability",
    badge: "Sea Level Risk",
    description: "Frequent coastal flooding and intensifying Atlantic storm systems."
  },
  {
    id: "london",
    name: "London, UK",
    region: "Europe",
    lat: 51.5074,
    lon: -0.1278,
    category: "Jet Stream Shift",
    badge: "Unprecedented Heat",
    description: "Record summer heatwaves reaching over 40°C in recent years."
  },
  {
    id: "svalbard",
    name: "Svalbard, Norway",
    region: "Arctic Circle",
    lat: 78.2232,
    lon: 15.6469,
    category: "Rapid Arctic Warming",
    badge: "4x Global Warming Speed",
    description: "Warming at nearly 4 times the global average rate; permafrost thaw."
  },
  {
    id: "manaus",
    name: "Amazon Rainforest, Brazil",
    region: "South America",
    lat: -3.1019,
    lon: -60.0250,
    category: "Carbon Sink Deforestation",
    badge: "Severe Drought",
    description: "Historic low river levels and deforestation threatening global oxygen cycles."
  },
  {
    id: "male",
    name: "Malé, Maldives",
    region: "Indian Ocean",
    lat: 4.1755,
    lon: 73.5093,
    category: "Submersion Threat",
    badge: "Inundation Danger",
    description: "80% of islands under 1m elevation; threatened by sea level rise."
  },
  {
    id: "cairo",
    name: "Cairo, Egypt",
    region: "North Africa",
    lat: 30.0444,
    lon: 31.2357,
    category: "Extreme Aridity",
    badge: "Water Scarcity",
    description: "Nile basin thermal spikes and expanding desertification."
  },
  {
    id: "delhi",
    name: "New Delhi, India",
    region: "South Asia",
    lat: 28.6139,
    lon: 77.2090,
    category: "Severe Air Quality & Heat",
    badge: "Hazardous AQI",
    description: "Pre-monsoon wet-bulb temperatures and seasonal smog crises."
  },
  {
    id: "sydney",
    name: "Sydney, Australia",
    region: "Oceania",
    lat: -33.8688,
    lon: 151.2093,
    category: "Bushfire & Coral Bleaching",
    badge: "Extreme Heatwaves",
    description: "Increasing marine heatwaves and catastrophic summer wildfire risks."
  }
];

export const EXTREME_EVENTS_FEED = [
  {
    id: 1,
    title: "Marine Heatwave Alert",
    region: "North Atlantic Ocean",
    severity: "High",
    type: "ocean",
    icon: "waves",
    description: "Sea surface temperatures +2.4°C above baseline, threatening coral ecosystems and marine life.",
    timestamp: "Live - 10 mins ago"
  },
  {
    id: 2,
    title: "Arctic Permafrost Thaw Spike",
    region: "Svalbard & Siberian Tundra",
    severity: "Critical",
    type: "ice",
    icon: "snowflake",
    description: "Accelerated methane outgassing detected as ground temperatures exceed freezing baselines.",
    timestamp: "Live - 25 mins ago"
  },
  {
    id: 3,
    title: "Urban Air Quality Advisory",
    region: "Indo-Gangetic Plain",
    severity: "High",
    type: "aqi",
    icon: "wind",
    description: "PM2.5 concentration index exceeding 180 µg/m³; sensitive populations advised to stay indoors.",
    timestamp: "Live - 1 hour ago"
  },
  {
    id: 4,
    title: "Wildfire Danger Level Elevated",
    region: "Mediterranean & Southern Europe",
    severity: "Moderate",
    type: "fire",
    icon: "flame",
    description: "Relative humidity dropping below 18% with gusty thermal winds creating high ignition potential.",
    timestamp: "Live - 2 hours ago"
  }
];

// WMO Weather Codes mapping to human readable condition & Lucide icon identifier
export const WMO_WEATHER_CODES = {
  0: { label: "Clear Sky", icon: "sun", bg: "sunny" },
  1: { label: "Mainly Clear", icon: "sun-cloud", bg: "partly-cloudy" },
  2: { label: "Partly Cloudy", icon: "cloud-sun", bg: "partly-cloudy" },
  3: { label: "Overcast", icon: "cloud", bg: "cloudy" },
  45: { label: "Foggy", icon: "fog", bg: "foggy" },
  48: { label: "Depositing Rime Fog", icon: "fog", bg: "foggy" },
  51: { label: "Light Drizzle", icon: "cloud-drizzle", bg: "rainy" },
  53: { label: "Moderate Drizzle", icon: "cloud-drizzle", bg: "rainy" },
  55: { label: "Dense Drizzle", icon: "cloud-drizzle", bg: "rainy" },
  61: { label: "Slight Rain", icon: "cloud-rain", bg: "rainy" },
  63: { label: "Moderate Rain", icon: "cloud-rain", bg: "rainy" },
  65: { label: "Heavy Rain", icon: "cloud-rain-heavy", bg: "rainy" },
  71: { label: "Slight Snow", icon: "snowflake", bg: "snowy" },
  73: { label: "Moderate Snow", icon: "snowflake", bg: "snowy" },
  75: { label: "Heavy Snow", icon: "snowflake", bg: "snowy" },
  80: { label: "Rain Showers", icon: "cloud-rain", bg: "rainy" },
  81: { label: "Moderate Rain Showers", icon: "cloud-rain", bg: "rainy" },
  82: { label: "Violent Rain Showers", icon: "cloud-lightning", bg: "stormy" },
  95: { label: "Thunderstorm", icon: "cloud-lightning", bg: "stormy" },
  96: { label: "Thunderstorm with Hail", icon: "cloud-hail", bg: "stormy" },
  99: { label: "Severe Thunderstorm with Hail", icon: "cloud-hail", bg: "stormy" }
};

export const getWmoInfo = (code) => {
  return WMO_WEATHER_CODES[code] || { label: "Unknown Condition", icon: "cloud", bg: "cloudy" };
};

export const getAqiLevel = (usAqi) => {
  if (usAqi == null) return { status: "Unknown", color: "#9ca3af", desc: "No data available." };
  if (usAqi <= 50) return { status: "Good", color: "#10b981", desc: "Air quality is satisfactory and poses little or no risk." };
  if (usAqi <= 100) return { status: "Moderate", color: "#f59e0b", desc: "Air quality is acceptable; moderate health concern for sensitive individuals." };
  if (usAqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "#f97316", desc: "Members of sensitive groups may experience health effects." };
  if (usAqi <= 200) return { status: "Unhealthy", color: "#ef4444", desc: "Everyone may begin to experience health effects." };
  if (usAqi <= 300) return { status: "Very Unhealthy", color: "#a855f7", desc: "Health alert: The risk of health effects is increased for everyone." };
  return { status: "Hazardous", color: "#78350f", desc: "Health warnings of emergency conditions. Entire population is affected." };
};
