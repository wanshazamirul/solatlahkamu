// Zone Management Service
// Fetches and validates zones from JAKIM e-Solat API

import { Zone } from '@/types/waktu-solat';

const ZONE_CACHE_KEY = 'waktu-solat-working-zones';
const ZONE_CACHE_TIME_KEY = 'waktu-solat-zones-last-check';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
const CHECK_INTERVAL = 6 * 60 * 60 * 1000; // Re-check every 6 hours

// All possible zones from JAKIM e-Solat API
const ALL_ZONES: Zone[] = [
  // Wilayah Persekutuan
  { code: 'WLY01', name: 'Kuala Lumpur', state: 'Wilayah Persekutuan' },
  { code: 'WLY02', name: 'Putrajaya', state: 'Wilayah Persekutuan' },

  // Selangor
  { code: 'SGR01', name: 'Shah Alam', state: 'Selangor' },
  { code: 'SGR02', name: 'Klang', state: 'Selangor' },
  { code: 'SGR03', name: 'Petaling', state: 'Selangor' },
  { code: 'SGR04', name: 'Hulu Langat', state: 'Selangor' },
  { code: 'SGR05', name: 'Hulu Selangor', state: 'Selangor' },
  { code: 'SGR06', name: 'Kuala Langat', state: 'Selangor' },
  { code: 'SGR07', name: 'Sabak Bernam', state: 'Selangor' },
  { code: 'SGR08', name: 'Sepang', state: 'Selangor' },
  { code: 'SGR09', name: 'Kuala Selangor', state: 'Selangor' },

  // Johor
  { code: 'JHR01', name: 'Johor Bahru', state: 'Johor' },
  { code: 'JHR02', name: 'Batu Pahat', state: 'Johor' },
  { code: 'JHR03', name: 'Kluang', state: 'Johor' },
  { code: 'JHR04', name: 'Kota Tinggi', state: 'Johor' },
  { code: 'JHR05', name: 'Mersing', state: 'Johor' },
  { code: 'JHR06', name: 'Muar', state: 'Johor' },
  { code: 'JHR07', name: 'Pontian', state: 'Johor' },
  { code: 'JHR08', name: 'Segamat', state: 'Johor' },

  // Kedah
  { code: 'KDH01', name: 'Alor Setar', state: 'Kedah' },
  { code: 'KDH02', name: 'Baling', state: 'Kedah' },
  { code: 'KDH03', name: 'Kuala Muda', state: 'Kedah' },
  { code: 'KDH04', name: 'Kubang Pasu', state: 'Kedah' },
  { code: 'KDH05', name: 'Kulim', state: 'Kedah' },
  { code: 'KDH06', name: 'Langkawi', state: 'Kedah' },
  { code: 'KDH07', name: 'Pendang', state: 'Kedah' },
  { code: 'KDH08', name: 'Pokok Sena', state: 'Kedah' },
  { code: 'KDH09', name: 'Sik', state: 'Kedah' },
  { code: 'KDH10', name: 'Yan', state: 'Kedah' },

  // Kelantan
  { code: 'KEL01', name: 'Kota Bharu', state: 'Kelantan' },
  { code: 'KEL02', name: 'Bachok', state: 'Kelantan' },
  { code: 'KEL03', name: 'Gua Musang', state: 'Kelantan' },
  { code: 'KEL04', name: 'Jeli', state: 'Kelantan' },
  { code: 'KEL05', name: 'Kuala Krai', state: 'Kelantan' },
  { code: 'KEL06', name: 'Machang', state: 'Kelantan' },
  { code: 'KEL07', name: 'Pasir Mas', state: 'Kelantan' },
  { code: 'KEL08', name: 'Tanah Merah', state: 'Kelantan' },
  { code: 'KEL09', name: 'Tumpat', state: 'Kelantan' },

  // Melaka
  { code: 'MLK01', name: 'Melaka', state: 'Melaka' },
  { code: 'MLK02', name: 'Alor Gajah', state: 'Melaka' },
  { code: 'MLK03', name: 'Jasin', state: 'Melaka' },
  { code: 'MLK04', name: 'Merlimau', state: 'Melaka' },

  // Negeri Sembilan
  { code: 'NSN01', name: 'Seremban', state: 'Negeri Sembilan' },
  { code: 'NSN02', name: 'Jelebu', state: 'Negeri Sembilan' },
  { code: 'NSN03', name: 'Jempol', state: 'Negeri Sembilan' },
  { code: 'NSN04', name: 'Kuala Pilah', state: 'Negeri Sembilan' },
  { code: 'NSN05', name: 'Port Dickson', state: 'Negeri Sembilan' },
  { code: 'NSN06', name: 'Rembau', state: 'Negeri Sembilan' },
  { code: 'NSN07', name: 'Tampin', state: 'Negeri Sembilan' },
  { code: 'NSN08', name: 'Titi', state: 'Negeri Sembilan' },

  // Pahang
  { code: 'PHT01', name: 'Kuantan', state: 'Pahang' },
  { code: 'PHT02', name: 'Bentong', state: 'Pahang' },
  { code: 'PHT03', name: 'Jerantut', state: 'Pahang' },
  { code: 'PHT04', name: 'Kuala Lipis', state: 'Pahang' },
  { code: 'PHT05', name: 'Maran', state: 'Pahang' },
  { code: 'PHT06', name: 'Pekan', state: 'Pahang' },
  { code: 'PHT07', name: 'Raub', state: 'Pahang' },
  { code: 'PHT08', name: 'Temerloh', state: 'Pahang' },

  // Pulau Pinang
  { code: 'PHG01', name: 'Pulau Pinang', state: 'Pulau Pinang' },
  { code: 'PHG02', name: 'Seberang Perai', state: 'Pulau Pinang' },
  { code: 'PHG03', name: 'Timur Laut', state: 'Pulau Pinang' },
  { code: 'PHG04', name: 'Barat Daya', state: 'Pulau Pinang' },

  // Perak
  { code: 'PRK01', name: 'Ipoh', state: 'Perak' },
  { code: 'PRK02', name: 'Hulu Perak', state: 'Perak' },
  { code: 'PRK03', name: 'Kampar', state: 'Perak' },
  { code: 'PRK04', name: 'Kinta', state: 'Perak' },
  { code: 'PRK05', name: 'Kuala Kangsar', state: 'Perak' },
  { code: 'PRK06', name: 'Larut, Matang & Selama', state: 'Perak' },
  { code: 'PRK07', name: 'Manjung', state: 'Perak' },
  { code: 'PRK08', name: 'Perak Tengah', state: 'Perak' },
  { code: 'PRK09', name: 'Selama', state: 'Perak' },
  { code: 'PRK10', name: 'Hilir Perak', state: 'Perak' },

  // Perlis
  { code: 'PLS01', name: 'Kangar', state: 'Perlis' },
  { code: 'PLS02', name: 'Arau', state: 'Perlis' },
  { code: 'PLS03', name: 'Padang Besar', state: 'Perlis' },

  // Selangor (continued)
  { code: 'SGR10', name: 'Gombak', state: 'Selangor' },
  { code: 'SGR11', name: 'Hulu Selangor', state: 'Selangor' },
  { code: 'SGR12', name: 'Kuala Langat', state: 'Selangor' },
  { code: 'SGR13', name: 'Sepang', state: 'Selangor' },

  // Terengganu
  { code: 'TRG01', name: 'Kuala Terengganu', state: 'Terengganu' },
  { code: 'TRG02', name: 'Besut', state: 'Terengganu' },
  { code: 'TRG03', name: 'Dungun', state: 'Terengganu' },
  { code: 'TRG04', name: 'Hulu Terengganu', state: 'Terengganu' },
  { code: 'TRG05', name: 'Kemaman', state: 'Terengganu' },
  { code: 'TRG06', name: 'Kuala Nerus', state: 'Terengganu' },
  { code: 'TRG07', name: 'Marang', state: 'Terengganu' },
  { code: 'TRG08', name: 'Setiu', state: 'Terengganu' },
];

/**
 * Check if a zone is working by fetching its prayer times
 * @param zone - Zone to check
 * @returns Promise<boolean> - true if zone works, false otherwise
 */
async function checkZone(zone: Zone): Promise<boolean> {
  try {
    const response = await fetch(`https://api.waktusolat.app/v2/prayer/${zone.code}`);

    if (!response.ok) {
      console.log(`[Zone Check] ✗ ${zone.name} (${zone.code}): HTTP ${response.status}`);
      return false;
    }

    const data = await response.json();

    // Verify response has prayer data
    if (!data.prayers || !Array.isArray(data.prayers) || data.prayers.length === 0) {
      console.log(`[Zone Check] ✗ ${zone.name} (${zone.code}): No prayer data`);
      return false;
    }

    console.log(`[Zone Check] ✓ ${zone.name} (${zone.code}): Working`);
    return true;
  } catch (error) {
    console.log(`[Zone Check] ✗ ${zone.name} (${zone.code}):`, error);
    return false;
  }
}

/**
 * Get working zones (from cache or check all zones)
 * @param forceCheck - Force re-check all zones even if cache exists
 * @returns Promise<Zone[]> - Array of working zones
 */
export async function getWorkingZones(forceCheck = false): Promise<Zone[]> {
  const now = Date.now();
  const lastCheck = localStorage.getItem(ZONE_CACHE_TIME_KEY);
  const cachedZones = localStorage.getItem(ZONE_CACHE_KEY);

  // Return cached zones if still valid
  if (!forceCheck && cachedZones && lastCheck) {
    const lastCheckTime = parseInt(lastCheck, 10);
    const cacheAge = now - lastCheckTime;

    if (cacheAge < CACHE_DURATION) {
      const zones = JSON.parse(cachedZones);
      console.log(`[Zone Service] Using cached zones (${zones.length} zones, ${(cacheAge / 1000 / 60).toFixed(0)} min old)`);
      return zones;
    }
  }

  // Need to check zones
  console.log('[Zone Service] Checking all zones...');
  const workingZones: Zone[] = [];

  // Check zones in batches to avoid overwhelming the API
  const batchSize = 10;

  for (let i = 0; i < ALL_ZONES.length; i += batchSize) {
    const batch = ALL_ZONES.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (zone) => ({
        zone,
        working: await checkZone(zone),
      }))
    );

    // Add working zones to list
    batchResults
      .filter(result => result.working)
      .forEach(result => workingZones.push(result.zone));
  }

  console.log(`[Zone Service] ✓ Found ${workingZones.length} working zones out of ${ALL_ZONES.length} total`);

  // Cache the results
  localStorage.setItem(ZONE_CACHE_KEY, JSON.stringify(workingZones));
  localStorage.setItem(ZONE_CACHE_TIME_KEY, now.toString());

  return workingZones;
}

/**
 * Start periodic zone checking
 * @param callback - Function to call when zones are updated
 * @returns Cleanup function
 */
export function startZoneChecking(callback: (zones: Zone[]) => void): () => void {
  console.log(`[Zone Service] Loading zones and validating...`);

  // First, immediately show all zones (for instant UI)
  callback(ALL_ZONES);

  // Then validate zones and update the list
  getWorkingZones(false)
    .then(validZones => {
      console.log(`[Zone Service] Updating with ${validZones.length} validated zones`);
      callback(validZones);
    })
    .catch(error => {
      console.error('[Zone Service] Error validating zones:', error);
      // Keep all zones on error (fallback)
    });

  // Return cleanup function
  return () => {
    console.log('[Zone Service] Stopped zone checking');
  };
}
