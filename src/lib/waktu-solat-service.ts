import { WaktuSolatResponse, PrayerTime } from '@/types/waktu-solat';

const API_BASE = 'https://api.waktusolat.app';

/**
 * Fetch prayer times for a specific zone
 * @param zoneCode - Zone code (e.g., 'SGR02', 'WLY01')
 * @param year - Year (optional, defaults to current year)
 * @param month - Month number 1-12 (optional, defaults to current month)
 * @returns Promise with prayer time data
 */
export async function fetchPrayerTimes(
  zoneCode: string,
  year?: number,
  month?: number
): Promise<WaktuSolatResponse> {
  const currentDate = new Date();
  const targetYear = year || currentDate.getFullYear();
  const targetMonth = month || currentDate.getMonth() + 1;

  const url = `${API_BASE}/v2/solat/${zoneCode}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: WaktuSolatResponse = await response.json();

    // Validate response
    if (!data.prayers || !Array.isArray(data.prayers)) {
      throw new Error('Invalid API response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

/**
 * Get prayer times for today
 * @param zoneCode - Zone code
 * @returns Today's prayer times
 */
export async function getTodayPrayerTimes(zoneCode: string) {
  const data = await fetchPrayerTimes(zoneCode);
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  const todayPrayer = data.prayers.find((p) => p.day === currentDay);

  if (!todayPrayer) {
    throw new Error('Prayer times for today not found');
  }

  return todayPrayer;
}

/**
 * Convert Unix timestamp to formatted time string
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted time (e.g., "5:45 AM")
 */
export function formatTimestamp(timestamp: number): string {
  // Convert seconds to milliseconds
  const date = new Date(timestamp * 1000);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get the next prayer time
 * @param prayers - Prayer time object or plain object
 * @returns Next prayer object
 */
export function getNextPrayer(prayers: { [key: string]: number } | PrayerTime) {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  const prayerOrder: Array<{ key: string; name: string }> = [
    { key: 'fajr', name: 'Fajr' },
    { key: 'syuruk', name: 'Syuruk' },
    { key: 'dhuhr', name: 'Dhuhr' },
    { key: 'asr', name: 'Asr' },
    { key: 'maghrib', name: 'Maghrib' },
    { key: 'isha', name: 'Isha' },
  ];

  for (const prayer of prayerOrder) {
    const prayerTime = (prayers as { [key: string]: number })[prayer.key];
    if (prayerTime && prayerTime > now) {
      return {
        name: prayer.name,
        time: prayerTime,
        key: prayer.key,
      };
    }
  }

  // If all prayers have passed, return first prayer of next day (tomorrow's Fajr)
  // Add 24 hours (86400 seconds) to today's Fajr time
  return {
    name: 'Fajr',
    time: prayers.fajr + 86400, // Next day's Fajr
    key: 'fajr',
  };
}

/**
 * Get the next prayer in sequence after a specific prayer
 * @param prayers - Prayer time object
 * @param currentPrayerKey - The prayer that just completed (e.g., 'fajr', 'dhuhr')
 * @returns Next prayer object in sequence
 */
export function getNextPrayerAfter(
  prayers: { [key: string]: number } | PrayerTime,
  currentPrayerKey: string
) {
  const prayerOrder: Array<{ key: string; name: string }> = [
    { key: 'fajr', name: 'Fajr' },
    { key: 'syuruk', name: 'Syuruk' },
    { key: 'dhuhr', name: 'Dhuhr' },
    { key: 'asr', name: 'Asr' },
    { key: 'maghrib', name: 'Maghrib' },
    { key: 'isha', name: 'Isha' },
  ];

  // Find the index of the current prayer
  const currentIndex = prayerOrder.findIndex(p => p.key === currentPrayerKey);

  if (currentIndex === -1) {
    // If current prayer not found, return next prayer based on time
    return getNextPrayer(prayers);
  }

  // Get the next prayer in sequence
  const nextIndex = (currentIndex + 1) % prayerOrder.length;
  const nextPrayer = prayerOrder[nextIndex];
  const prayerTime = (prayers as { [key: string]: number })[nextPrayer.key];

  return {
    name: nextPrayer.name,
    time: prayerTime,
    key: nextPrayer.key,
  };
}

/**
 * Calculate time remaining until next prayer
 * @param timestamp - Unix timestamp in seconds
 * @returns Object with hours, minutes, seconds
 */
export function getTimeRemaining(timestamp: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = timestamp - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return { hours, minutes, seconds };
}
