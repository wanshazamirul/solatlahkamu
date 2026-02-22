/**
 * GPS & Compass Permission Overlay
 * Shows on app launch to request location and compass permissions
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EnableGPSOverlayProps {
  onEnable: (location: { latitude: number; longitude: number }) => void;
  onSkip?: () => void;
}

export function EnableGPSOverlay({ onEnable, onSkip }: EnableGPSOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already granted GPS permission
    const hasEnabled = localStorage.getItem('gpsPermissionGranted');
    if (!hasEnabled) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleEnable = async () => {
    try {
      // Request GPS permission
      if (!navigator.geolocation) {
        alert('GPS is not supported on this device');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Request compass permission (iOS only)
      const isIOS = typeof DeviceOrientationEvent !== 'undefined' &&
        'requestPermission' in DeviceOrientationEvent;

      if (isIOS) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission !== 'granted') {
            console.warn('Compass permission denied');
          }
        } catch (err) {
          console.error('Compass permission error:', err);
        }
      }

      // Mark as enabled
      localStorage.setItem('gpsPermissionGranted', 'true');
      setIsVisible(false);
      onEnable(location);
    } catch (error) {
      console.error('GPS permission error:', error);
      alert('Failed to get location. Please enable location permissions.');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('gpsPermissionGranted', 'true');
    setIsVisible(false);
    onSkip?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-500/30 rounded-2xl p-6 md:p-8 max-w-md w-full text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center"
          >
            <div className="relative">
              <MapPin className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
              <Navigation className="w-4 h-4 md:w-5 md:h-5 text-emerald-300 absolute -bottom-1 -right-1" />
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Enable Location
          </h2>

          {/* Description */}
          <p className="text-slate-300 mb-6 text-sm md:text-base">
            We need access to your location for accurate prayer times and Qibla direction.
          </p>

          {/* Instructions */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-slate-400 mb-2 font-semibold">What we use it for:</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Auto-detect your prayer zone</li>
              <li>• Show accurate Qibla direction</li>
              <li>• Calculate distance to Ka'bah</li>
            </ul>
            <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-700">
              Your location is processed locally and never stored.
            </p>
          </div>

          {/* Enable Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEnable}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all"
          >
            Enable Location
          </motion.button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="mt-3 text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            Skip (I'll enable manually later)
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
