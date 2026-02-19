// Malaysia Weather API Service (data.gov.my)

const WEATHER_API_BASE = 'https://api.data.gov.my/weather/forecast';

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

/**
 * Fetch weather forecast for a location
 * @param locationName - Location name (e.g., "Kuala Lumpur", "Putrajaya")
 * @returns Weather forecast data
 */
export async function fetchWeatherForecast(locationName?: string): Promise<WeatherData[]> {
  try {
    let url = WEATHER_API_BASE;

    if (locationName) {
      // Filter by location name
      url += `?contains=${locationName}@location__location_name`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // The API returns an array
    if (!Array.isArray(data)) {
      throw new Error('Invalid weather API response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

/**
 * Map prayer zones to weather location IDs
 * Based on Malaysian state codes
 */
export function mapZoneToWeatherLocation(zoneCode: string): string {
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

  return zoneMapping[zoneCode] || 'Kuala Lumpur';
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
