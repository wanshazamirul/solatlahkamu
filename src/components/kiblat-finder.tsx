/**
 * Kiblat Finder Component
 * Shows Qibla direction using GPS + Compass
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, Navigation, AlertCircle } from 'lucide-react';
import { useGPSLocation } from '@/hooks/use-gps-location';
import { useDeviceOrientation } from '@/hooks/use-device-orientation';
import { calculateQiblaDirection, formatBearing, formatDistance } from '@/lib/qibla-service';
import { useState, useEffect, useMemo } from 'react';

export function KiblatFinder({ initialLocation }: { initialLocation?: { latitude: number; longitude: number } | null }) {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const gps = useGPSLocation();
  const compass = useDeviceOrientation();

  // Use initial location if available
  const location = gps.location || initialLocation;

  // Check if we already have GPS permission from overlay
  useEffect(() => {
    const gpsGranted = localStorage.getItem('gpsPermissionGranted');
    if (gpsGranted && initialLocation && !compass.isPermissionGranted) {
      // Assume compass is also granted if GPS was granted
      compass.startWatching();
    }
  }, [initialLocation]);

  // Calculate Qibla direction when we have GPS
  const qiblaDirection = useMemo(() => {
    if (location) {
      return calculateQiblaDirection(
        location.latitude,
        location.longitude
      );
    }
    return null;
  }, [location]);

  // Calculate relative direction (compass heading vs Qibla bearing)
  // This is how many degrees from current heading to Qibla
  const relativeDirection = useMemo(() => {
    if (qiblaDirection && compass.compass.heading !== null) {
      const relative = qiblaDirection.bearing - compass.compass.heading;
      return (relative + 360) % 360;
    }
    return null;
  }, [qiblaDirection, compass.compass.heading]);

  /**
   * Handle "Enable Location" button click
   */
  const handleEnableLocation = async () => {
    setShowPermissionModal(false);

    // Request GPS first
    await gps.requestLocation();

    // Then request compass permission (iOS)
    if (compass.isSupported && compass.isPermissionGranted === null) {
      const granted = await compass.requestPermission();
      if (granted) {
        compass.startWatching();
      }
    } else if (compass.isPermissionGranted === true) {
      compass.startWatching();
    }
  };

  /**
   * Handle manual permission retry
   */
  const handleRequestPermissions = async () => {
    if (gps.location) {
      // Request compass permission
      const granted = await compass.requestPermission();
      if (granted) {
        compass.startWatching();
      }
    } else {
      // Request GPS first
      await handleEnableLocation();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-950 to-slate-950 rounded-2xl p-6 border border-emerald-800/30"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <Compass className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Kiblat Finder</h2>
            <p className="text-sm text-emerald-300/70">Qibla direction compass</p>
          </div>
        </div>

        {/* Permission Modal - only show if no location and compass permission not explicitly denied */}
        {!location && compass.isPermissionGranted !== false && (
          <PermissionPrompt
            onEnable={handleEnableLocation}
            gpsError={gps.error}
            compassError={compass.compass.error}
          />
        )}

        {/* Compass Display */}
        <AnimatePresence>
          {location && qiblaDirection && (
            <CompassDisplay
              qiblaDirection={qiblaDirection}
              relativeDirection={relativeDirection}
              compassHeading={compass.compass.heading}
              location={location}
            />
          )}
        </AnimatePresence>

        {/* Error State */}
        {gps.error && (
          <ErrorState
            message={gps.error}
            onRetry={handleRequestPermissions}
          />
        )}

        {compass.compass.error && gps.location && (
          <ErrorState
            message={compass.compass.error}
            onRetry={handleRequestPermissions}
          />
        )}

        {/* Desktop Notice */}
        {!compass.isSupported && gps.location && (
          <DesktopNotice />
        )}
      </motion.div>
    </>
  );
}

/**
 * Permission Prompt
 */
function PermissionPrompt({
  onEnable,
  gpsError,
  compassError,
}: {
  onEnable: () => void;
  gpsError: string | null;
  compassError: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          Enable Location Services
        </h3>
        <p className="text-slate-300 text-sm mb-4">
          We need access to your GPS and compass to show the Qibla direction.
        </p>

        <ul className="text-slate-400 text-xs space-y-1 mb-4">
          <li>• GPS: Auto-detect your location</li>
          <li>• Compass: Show Qibla direction</li>
          <li>• Data is processed locally, never stored</li>
        </ul>

        <button
          onClick={onEnable}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          Enable Location & Compass
        </button>

        {(gpsError || compassError) && (
          <p className="text-red-400 text-xs mt-3 text-center">
            {gpsError || compassError}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Compass Display
 */
function CompassDisplay({
  qiblaDirection,
  relativeDirection,
  compassHeading,
  location,
}: {
  qiblaDirection: { bearing: number; cardinal: string; distance: number };
  relativeDirection: number | null;
  compassHeading: number | null;
  location: { latitude: number; longitude: number };
}) {
  // The compass face rotates opposite to phone heading (so North stays up)
  const compassRotation = compassHeading ?? 0;

  // The Qibla arrow points to the relative direction
  const arrowRotation = relativeDirection ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Compass Visual */}
      <div className="relative w-64 h-64 mx-auto">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30" />

        {/* Compass face - rotates opposite to phone heading */}
        <motion.div
          animate={{ rotate: -compassRotation }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-600/30 flex items-center justify-center"
        >
          {/* Cardinal directions - these rotate with compass face */}
          <div className="absolute inset-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-emerald-400 text-xs font-bold">N</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-slate-400 text-xs font-bold">S</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">W</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">E</div>
          </div>

          {/* Qibla indicator - points to relative direction */}
          <motion.div
            animate={{ rotate: arrowRotation }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="relative"
          >
            <Navigation className="w-12 h-12 text-emerald-400" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Fixed "you are here" indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
        </div>
      </div>

      {/* Direction Info */}
      <div className="text-center space-y-2">
        <div className="text-4xl font-bold text-white">
          {formatBearing(qiblaDirection.bearing)} {qiblaDirection.cardinal}
        </div>
        <div className="text-emerald-300/70 text-sm">
          Distance to Ka'bah: {formatDistance(qiblaDirection.distance)}
        </div>
        {compassHeading !== null && (
          <div className="text-slate-400 text-xs">
            Facing: {Math.round(compassHeading)}°
          </div>
        )}
      </div>

      {/* Location info */}
      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
        <p className="text-slate-400 text-xs">
          📍 {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
        </p>
      </div>

      {/* Calibration tip */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
        <p className="text-amber-300 text-xs text-center">
          💡 Move your device in a figure-8 pattern to calibrate the compass
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Error State
 */
function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
      <p className="text-red-300 text-sm mb-3">{message}</p>
      <button
        onClick={onRetry}
        className="text-red-400 text-sm underline hover:text-red-300"
      >
        Try again
      </button>
    </div>
  );
}

/**
 * Desktop Notice
 */
function DesktopNotice() {
  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
      <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
      <p className="text-blue-300 text-sm">
        Compass works best on mobile devices with GPS sensors
      </p>
    </div>
  );
}
