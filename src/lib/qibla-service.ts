/**
 * Qibla Finder Service
 * Calculates Qibla direction using Haversine formula
 * Ka'bah coordinates: 21.4225° N, 39.8262° E
 */

export interface QiblaDirection {
  bearing: number; // Degrees from North (0-360)
  cardinal: string; // N, NE, E, SE, S, SW, W, NW
  distance: number; // Distance to Ka'bah in km
}

// Ka'bah coordinates
const KABAH = {
  latitude: 21.4225,
  longitude: 39.8262,
};

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate bearing from point A to point B
 * Using the forward azimuth formula
 */
function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let bearing = toDegrees(Math.atan2(y, x));

  // Normalize to 0-360
  return (bearing + 360) % 360;
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Get cardinal direction from bearing
 */
function getCardinalDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Calculate Qibla direction from given coordinates
 */
export function calculateQiblaDirection(
  latitude: number,
  longitude: number
): QiblaDirection {
  const bearing = calculateBearing(
    latitude,
    longitude,
    KABAH.latitude,
    KABAH.longitude
  );

  const distance = calculateDistance(
    latitude,
    longitude,
    KABAH.latitude,
    KABAH.longitude
  );

  return {
    bearing,
    cardinal: getCardinalDirection(bearing),
    distance,
  };
}

/**
 * Format bearing for display
 */
export function formatBearing(bearing: number): string {
  return `${Math.round(bearing)}°`;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1000) {
    return `${Math.round(km)} km`;
  }
  return `${(km / 1000).toFixed(0)}k km`;
}
