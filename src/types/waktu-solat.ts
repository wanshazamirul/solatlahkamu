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

// Available zones (verified working zones only)
export const ZONES: Zone[] = [
  // Wilayah Persekutuan
  { code: 'WLY01', name: 'Kuala Lumpur', state: 'Wilayah Persekutuan' },
  { code: 'WLY02', name: 'Putrajaya', state: 'Wilayah Persekutuan' },

  // Selangor
  { code: 'SGR01', name: 'Shah Alam', state: 'Selangor' },
  { code: 'SGR02', name: 'Klang', state: 'Selangor' },
  { code: 'SGR03', name: 'Petaling', state: 'Selangor' },

  // Major cities only
  { code: 'JHR01', name: 'Johor Bahru', state: 'Johor' },
  { code: 'KEL01', name: 'Kota Bharu', state: 'Kelantan' },
  { code: 'MLK01', name: 'Melaka', state: 'Melaka' },
  { code: 'PHG01', name: 'Pulau Pinang', state: 'Pulau Pinang' },
  { code: 'TRG01', name: 'Kuala Terengganu', state: 'Terengganu' },
  { code: 'PHT01', name: 'Kuantan', state: 'Pahang' },
];
