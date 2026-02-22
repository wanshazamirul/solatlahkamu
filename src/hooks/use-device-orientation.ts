/**
 * Device Orientation Hook
 * Handles compass access, including iOS permission request
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// Extend DeviceOrientationEvent for iOS-specific properties
declare global {
  interface DeviceOrientationEvent {
    webkitCompassHeading?: number;
    webkitCompassAccuracy?: number;
    requestPermission?: () => Promise<PermissionState>;
  }
}

export interface CompassData {
  heading: number | null; // 0-360 degrees, null if unavailable
  accuracy: number | null; // Accuracy in degrees, null if unavailable
  error: string | null;
}

export interface UseCompassReturn {
  compass: CompassData;
  isSupported: boolean;
  isPermissionGranted: boolean | null; // null = not requested yet
  requestPermission: () => Promise<boolean>;
  startWatching: () => void;
  stopWatching: () => void;
}

export function useDeviceOrientation(): UseCompassReturn {
  const [compass, setCompass] = useState<CompassData>({
    heading: null,
    accuracy: null,
    error: null,
  });
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  // Check if device orientation is supported
  const isSupported = typeof window !== 'undefined' &&
    'DeviceOrientationEvent' in window;

  /**
   * Request iOS permission (requires user gesture)
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setCompass(prev => ({ ...prev, error: 'Compass not supported' }));
      return false;
    }

    // iOS 13+ requires permission request
    const isIOS = typeof DeviceOrientationEvent !== 'undefined' &&
      'requestPermission' in DeviceOrientationEvent;

    if (isIOS) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();

        if (permission === 'granted') {
          setIsPermissionGranted(true);
          return true;
        } else {
          setCompass(prev => ({ ...prev, error: 'Compass permission denied' }));
          setIsPermissionGranted(false);
          return false;
        }
      } catch (error) {
        console.error('[Compass] Permission request error:', error);
        setCompass(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Permission request failed'
        }));
        setIsPermissionGranted(false);
        return false;
      }
    }

    // Non-iOS devices don't need permission
    setIsPermissionGranted(true);
    return true;
  }, [isSupported]);

  /**
   * Handle orientation event
   */
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    console.log('[Compass] Device orientation event:', {
      webkitCompassHeading: event.webkitCompassHeading,
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });

    // Use webkitCompassHeading for iOS, alpha for Android
    let heading: number | null = null;

    if (event.webkitCompassHeading !== undefined) {
      // iOS
      heading = event.webkitCompassHeading;
      console.log('[Compass] iOS heading:', heading);
    } else if (event.alpha !== null) {
      // Android (alpha is 0-360, with 0 = North)
      // Note: Android alpha is opposite direction, need to invert
      heading = (360 - event.alpha) % 360;
      console.log('[Compass] Android heading:', heading, 'from alpha:', event.alpha);
    }

    const accuracy = event.webkitCompassAccuracy ?? null;

    setCompass({
      heading,
      accuracy,
      error: null,
    });
  }, []);

  /**
   * Start watching compass changes
   */
  const startWatching = useCallback(() => {
    if (!isSupported) {
      setCompass(prev => ({ ...prev, error: 'Compass not supported' }));
      return;
    }

    if (isPermissionGranted === false) {
      setCompass(prev => ({ ...prev, error: 'Permission not granted' }));
      return;
    }

    console.log('[Compass] Starting to watch device orientation...');
    window.addEventListener('deviceorientation', handleOrientation);
    setIsWatching(true);
  }, [isSupported, isPermissionGranted, handleOrientation]);

  /**
   * Stop watching compass changes
   */
  const stopWatching = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation);
    setIsWatching(false);
  }, [handleOrientation]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (isWatching) {
        stopWatching();
      }
    };
  }, [isWatching, stopWatching]);

  return {
    compass,
    isSupported,
    isPermissionGranted,
    requestPermission,
    startWatching,
    stopWatching,
  };
}
