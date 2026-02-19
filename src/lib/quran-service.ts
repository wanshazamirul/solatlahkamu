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
 * Selects a verse based on the day of month
 * @returns Quran verse
 */
export async function getDailyVerse(): Promise<QuranVerse> {
  // Pre-selected verses for each day (up to 31 days in a month)
  const dailyVerses = [
    { surah: 1, ayah: 1 },    // Al-Fatihah 1:1
    { surah: 2, ayah: 153 },  // Al-Baqarah 2:153
    { surah: 2, ayah: 255 },  // Al-Baqarah 2:255
    { surah: 3, ayah: 190 },  // Ali Imran 3:190
    { surah: 4, ayah: 103 },  // An-Nisa 4:103
    { surah: 6, ayah: 162 },  // Al-Anam 6:162
    { surah: 20, ayah: 5 },   // Ta-Ha 20:5
    { surah: 33, ayah: 35 },  // Al-Ahzab 33:35
    { surah: 39, ayah: 53 },  // Az-Zumar 39:53
    { surah: 57, ayah: 4 },   // Al-Hadid 57:4
    { surah: 94, ayah: 5 },   // Ash-Sharh 94:5
    { surah: 94, ayah: 6 },   // Ash-Sharh 94:6
    { surah: 112, ayah: 1 },  // Al-Ikhlas 112:1
    { surah: 113, ayah: 1 },  // Al-Falaq 113:1
    { surah: 114, ayah: 1 },  // An-Nas 114:1
  ];

  const dayOfMonth = new Date().getDate();
  const index = dayOfMonth % dailyVerses.length;
  const selectedVerse = dailyVerses[index];

  return fetchVerse(selectedVerse.surah, selectedVerse.ayah);
}

/**
 * Format verse reference for display
 * @param verse - Quran verse object
 * @returns Formatted reference string (e.g., "Al-Fatihah 1:1")
 */
export function formatVerseReference(verse: QuranVerse): string {
  return `${verse.surahName} ${verse.surahNo}:${verse.ayahNo}`;
}
