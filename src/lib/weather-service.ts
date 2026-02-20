// Malaysia Weather API Service (data.gov.my)

const WEATHER_API_BASE = 'https://api.data.gov.my/weather/forecast';
const CACHE_KEY = 'weather-cache';
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours

export interface WeatherLocation {
  location_id: string;
  location_name: string;
}

export interface WeatherData {
  location: WeatherLocation;
  date: string;
  morning_forecast: string;
  afternoon_forecast: string;
  night_forecast: string;
  summary_forecast: string;
  summary_when: string;
  min_temp: number;
  max_temp: number;
}

interface WeatherCache {
  data: WeatherData[];
  timestamp: number;
}

/**
 * Fetch weather forecast for a location (with caching)
 * @param locationName - Location name (e.g., "Kuala Lumpur", "Putrajaya")
 * @returns Weather forecast data or empty array on error
 */
export async function fetchWeatherForecast(locationName?: string): Promise<WeatherData[]> {
  try {
    // Check cache first
    const cacheKey = locationName ? `${CACHE_KEY}-${locationName}` : CACHE_KEY;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const cache: WeatherCache = JSON.parse(cached);
      const cacheAge = Date.now() - cache.timestamp;

      if (cacheAge < CACHE_DURATION) {
        console.log(`[Weather] Using cached data (${(cacheAge / 1000 / 60).toFixed(0)} min old)`);
        return cache.data;
      }
    }

    let url = WEATHER_API_BASE;

    if (locationName) {
      // Filter by location name
      url += `?contains=${locationName}@location__location_name`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('[Weather] API rate limited, using cached data if available');
        // Return cached data even if expired
        if (cached) {
          const cache: WeatherCache = JSON.parse(cached);
          return cache.data;
        }
      }
      throw new Error(`Weather API Error: ${response.status}`);
    }

    const data = await response.json();

    // The API returns an array
    if (!Array.isArray(data)) {
      throw new Error('Invalid weather API response format');
    }

    // Cache the result
    const cacheData: WeatherCache = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));

    return data;
  } catch (error) {
    console.error('[Weather] Error fetching weather:', error);

    // Try to return cached data on error
    const cacheKey = locationName ? `${CACHE_KEY}-${locationName}` : CACHE_KEY;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      console.log('[Weather] Using cached data due to error');
      const cache: WeatherCache = JSON.parse(cached);
      return cache.data;
    }

    // Return empty array on error (widget will show error state)
    return [];
  }
}

/**
 * Map prayer zones to weather location IDs
 * Based on Malaysian state codes
 */
export function mapZoneToWeatherLocation(zoneCode: string): string | null {
  // The weather API uses location_name filtering instead of location_id
  // We'll filter by location name instead

  // Mapping of zone codes to location names for the API
  const zoneMapping: Record<string, string> = {
    'WLY01': 'Kuala Lumpur',
    'WLY02': 'Putrajaya',
    'SGR01': 'Gombak',
    'SGR02': 'Shah Alam',
    'SGR03': 'Klang',
    'SGR04': 'Hulu Langat',
    'SGR05': 'Sepang',
    'SGR06': 'Kuala Selangor',
    'SGR07': 'Hulu Selangor',
    'SGR08': 'Petaling',
    'KTN01': 'Kota Setar',
    'KTN02': 'Kuala Muda',
    'KTN03': 'Kubang Pasu',
    'PHG01': 'Seberang Perai',
    'PHG02': 'Timur Laut',
    'PHG03': 'Barat Daya',
    'PLS01': 'Kinta',
    'PLS02': 'Larut Matang',
    'MLK01': 'Alor Gajah',
    'MLK02': 'Melaka Tengah',
    'JHR01': 'Johor Bahru',
    'JHR02': 'Batu Pahat',
    'KEL01': 'Kota Bharu',
    'TRG01': 'Kuala Terengganu',
    'PHT01': 'Kuantan',
  };

  return zoneMapping[zoneCode] || null; // Return null instead of defaulting to Kuala Lumpur
}

/**
 * Get current time-based forecast
 * @param weatherData - Weather forecast object
 * @returns Appropriate forecast based on current time
 */
export function getCurrentForecast(weatherData: WeatherData): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return weatherData.morning_forecast;
  } else if (hour < 18) {
    return weatherData.afternoon_forecast;
  } else {
    return weatherData.night_forecast;
  }
}
