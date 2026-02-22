/**
 * GPS Auto-Zone Component
 * Shows a button to auto-detect zone via GPS
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { autoDetectZone, isGPSSupported } from '@/lib/gps-zone-service';

interface GPSAutoZoneProps {
  onZoneDetected: (zone: string) => void;
  currentZone?: string;
}

export function GPSAutoZone({ onZoneDetected, currentZone }: GPSAutoZoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedZone, setDetectedZone] = useState<string | null>(null);

  const isSupported = isGPSSupported();

  const handleAutoDetect = async () => {
    if (!isSupported) {
      setError('GPS not supported on this device');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await autoDetectZone();

      if (result.success && result.zone) {
        setDetectedZone(result.zone);
        onZoneDetected(result.zone);

        // Auto-hide success after 3 seconds
        setTimeout(() => {
          setDetectedZone(null);
        }, 3000);
      } else {
        setError(result.error || 'Failed to detect zone');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <button
        onClick={handleAutoDetect}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Detecting your zone...
          </>
        ) : detectedZone ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Zone detected: {detectedZone}
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5" />
            Auto-detect my zone
          </>
        )}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
