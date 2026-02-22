/**
 * GPS-based Zone Detection Service
 * Uses waktusolat.app API to detect zone by coordinates
 */

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

export interface ZoneInfo {
  zone: string;
  state: string;
  district: string;
}

export interface ZoneDetectionResult {
  success: boolean;
  zone?: string;
  zoneInfo?: ZoneInfo;
  error?: string;
}

const API_BASE = 'https://api.waktusolat.app';

/**
 * Get zone by GPS coordinates
 */
export async function getZoneByCoordinates(
  lat: number,
  long: number
): Promise<ZoneDetectionResult> {
  try {
    const response = await fetch(`${API_BASE}/zones/${lat}/${long}`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data: ZoneInfo = await response.json();

    return {
      success: true,
      zone: data.zone,
      zoneInfo: data,
    };
  } catch (error) {
    console.error('[GPS Zone Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to detect zone',
    };
  }
}

/**
 * Get user's current GPS position
 */
export function getCurrentPosition(): Promise<GPSCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('GPS permission denied'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('GPS location unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('GPS request timed out'));
            break;
          default:
            reject(new Error('Unknown GPS error'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
}

/**
 * Auto-detect zone by GPS
 * Combines getting position + API call
 */
export async function autoDetectZone(): Promise<ZoneDetectionResult> {
  try {
    // Step 1: Get GPS coordinates
    const coords = await getCurrentPosition();

    // Step 2: Call API to get zone
    const result = await getZoneByCoordinates(coords.latitude, coords.longitude);

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to auto-detect zone',
    };
  }
}

/**
 * Check if GPS is available
 */
export function isGPSSupported(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}
