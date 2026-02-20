// Quran API Service (quranapi.pages.dev)
// Free API, no authentication required

const QURAN_API_BASE = 'https://quranapi.pages.dev/api';

export interface QuranVerse {
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
  surahNo: number;
  ayahNo: number;
  english: string;
  arabic1: string;
  arabic2: string;
}

/**
 * Fetch a specific verse from the Quran
 * @param surahNumber - Chapter number (1-114)
 * @param ayahNumber - Verse number
 * @returns Quran verse with Arabic and English translation
 */
export async function fetchVerse(surahNumber: number, ayahNumber: number): Promise<QuranVerse> {
  try {
    const url = `${QURAN_API_BASE}/${surahNumber}/${ayahNumber}.json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Quran API Error: ${response.status} ${response.statusText}`);
    }

    const data: QuranVerse = await response.json();

    if (!data.surahName) {
      throw new Error('Invalid Quran API response');
    }

    return data;
  } catch (error) {
    console.error('Error fetching Quran verse:', error);
    throw error;
  }
}

/**
 * Get random verse from daily selection
 * Selects a random verse on page refresh, cached for the day
 * @returns Quran verse
 */
export async function getDailyVerse(): Promise<QuranVerse> {
  const CACHE_KEY = 'daily-verse-cache';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Check cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const cache = JSON.parse(cached);
    const cacheAge = Date.now() - cache.timestamp;

    if (cacheAge < CACHE_DURATION) {
      console.log(`[Quran] Using cached verse (${(cacheAge / 1000 / 60 / 60).toFixed(1)}h old)`);
      return cache.data;
    }
  }

  // Pre-selected verses for random selection
  const dailyVerses = [
    { surah: 1, ayah: 1 },    // Al-Fatihah 1:1
    { surah: 2, ayah: 153 },  // Al-Baqarah 2:153
    { surah: 2, ayah: 255 },  // Al-Baqarah 2:255 (Ayat Kursi)
    { surah: 2, ayah: 286 },  // Al-Baqarah 2:286
    { surah: 3, ayah: 190 },  // Ali Imran 3:190
    { surah: 4, ayah: 103 },  // An-Nisa 4:103
    { surah: 6, ayah: 162 },  // Al-Anam 6:162
    { surah: 13, ayah: 28 },  // Ar-Ra'd 13:28
    { surah: 20, ayah: 5 },   // Ta-Ha 20:5
    { surah: 20, ayah: 14 },  // Ta-Ha 20:14
    { surah: 24, ayah: 35 },  // An-Nur 24:35
    { surah: 27, ayah: 62 },  // An-Naml 27:62
    { surah: 28, ayah: 77 },  // Al-Qasas 28:77
    { surah: 29, ayah: 69 },  // Al-Ankabut 29:69
    { surah: 30, ayah: 21 },  // Ar-Rum 30:21
    { surah: 31, ayah: 14 },  // Luqman 31:14
    { surah: 33, ayah: 35 },  // Al-Ahzab 33:35
    { surah: 35, ayah: 3 },   // Fatir 35:3
    { surah: 39, ayah: 53 },  // Az-Zumar 39:53
    { surah: 40, ayah: 60 },  // Ghafir 40:60
    { surah: 41, ayah: 30 },  // Fussilat 41:30
    { surah: 42, ayah: 36 },  // Ash-Shuraa 42:36
    { surah: 46, ayah: 15 },  // Al-Ahqaf 46:15
    { surah: 48, ayah: 4 },   // Al-Fath 48:4
    { surah: 49, ayah: 13 },  // Al-Hujurat 49:13
    { surah: 57, ayah: 4 },   // Al-Hadid 57:4
    { surah: 57, ayah: 20 },  // Al-Hadid 57:20
    { surah: 58, ayah: 11 },  // Al-Mujadila 58:11
    { surah: 59, ayah: 23 },  // Al-Hashr 59:23
    { surah: 62, ayah: 9 },   // Al-Jumu'ah 62:9
    { surah: 64, ayah: 16 },  // At-Taghabun 64:16
    { surah: 65, ayah: 2-3 }, // At-Talaq 65:2-3
    { surah: 67, ayah: 2 },   // Al-Mulk 67:2
    { surah: 70, ayah: 19 },  // Al-Ma'arij 70:19
    { surah: 73, ayah: 8 },   // Al-Muzzammil 73:8
    { surah: 76, ayah: 8 },   // Al-Insan 76:8
    { surah: 87, ayah: 7 },   // Al-A'la 87:7
    { surah: 93, ayah: 11 },  // Ad-Duhaa 93:11
    { surah: 94, ayah: 5 },   // Ash-Sharh 94:5
    { surah: 94, ayah: 6 },   // Ash-Sharh 94:6
    { surah: 95, ayah: 5 },   // At-Tin 95:5
    { surah: 103, ayah: 2 },  // Al-Asr 103:2
    { surah: 108, ayah: 2 },  // Al-Kausar 108:2
    { surah: 112, ayah: 1 },  // Al-Ikhlas 112:1
    { surah: 113, ayah: 1 },  // Al-Falaq 113:1
    { surah: 114, ayah: 1 },  // An-Nas 114:1
  ];

  // Select random verse
  const randomIndex = Math.floor(Math.random() * dailyVerses.length);
  const selectedVerse = dailyVerses[randomIndex];

  console.log(`[Quran] Selected verse ${selectedVerse.surah}:${selectedVerse.ayah} (index ${randomIndex})`);

  const verse = await fetchVerse(selectedVerse.surah, selectedVerse.ayah);

  // Cache for 24 hours
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: verse,
    timestamp: Date.now(),
  }));

  return verse;
}

/**
 * Format verse reference for display
 * @param verse - Quran verse object
 * @returns Formatted reference string (e.g., "Al-Fatihah 1:1")
 */
export function formatVerseReference(verse: QuranVerse): string {
  return `${verse.surahName} ${verse.surahNo}:${verse.ayahNo}`;
}
