// Waktu Solat API Types

export interface PrayerTime {
  day: number;
  hijri: string;
  fajr: number;      // Unix timestamp in seconds
  syuruk: number;   // Sunrise (Unix timestamp in seconds)
  dhuhr: number;    // Unix timestamp in seconds
  asr: number;      // Unix timestamp in seconds
  maghrib: number;  // Unix timestamp in seconds
  isha: number;     // Unix timestamp in seconds
}

export interface WaktuSolatResponse {
  zone: string;
  year: number;
  month: string;
  month_number: number;
  last_updated: string | null;
  prayers: PrayerTime[];
}

export type PrayerName = 'fajr' | 'syuruk' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerDisplay {
  name: string;
  nameArabic: string;
  time: string;
  timestamp: number;
  icon: string;
}

// Zone types
export interface Zone {
  code: string;
  name: string;
  state: string;
}

// Zone types
export interface Zone {
  code: string;
  name: string;
  state: string;
}

// Default zone for initial load before zone checking completes
export const DEFAULT_ZONE: Zone = {
  code: 'WLY01',
  name: 'Kuala Lumpur',
  state: 'Wilayah Persekutuan',
};
