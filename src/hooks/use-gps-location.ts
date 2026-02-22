/**
 * GPS Location Hook
 * Handles GPS position tracking
 */

'use client';

import { useState, useCallback } from 'react';
import { getCurrentPosition, isGPSSupported, type GPSCoordinates } from '@/lib/gps-zone-service';

export interface UseGPSLocationReturn {
  location: GPSCoordinates | null;
  error: string | null;
  isLoading: boolean;
  isSupported: boolean;
  requestLocation: () => Promise<void>;
  clearError: () => void;
}

export function useGPSLocation(): UseGPSLocationReturn {
  const [location, setLocation] = useState<GPSCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSupported = isGPSSupported();

  const requestLocation = useCallback(async () => {
    if (!isSupported) {
      setError('GPS is not supported on this device');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const coords = await getCurrentPosition();
      setLocation(coords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    location,
    error,
    isLoading,
    isSupported,
    requestLocation,
    clearError,
  };
}
