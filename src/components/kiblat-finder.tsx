/**
 * Kiblat Finder Component
 * Shows Qibla direction using GPS + Compass
 * WORK IN PROGRESS - Compass rotation being improved
 */

'use client';

import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useState } from 'react';

export function KiblatFinder({ initialLocation }: { initialLocation?: { latitude: number; longitude: number } | null }) {
  const [showWIPNotice, setShowWIPNotice] = useState(true);

  // Work in Progress Notice
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-emerald-950 to-slate-950 rounded-2xl p-6 border border-emerald-800/30"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-500/20 rounded-xl">
          <Compass className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Kiblat Finder</h2>
          <p className="text-sm text-emerald-300/70">Qibla direction compass</p>
        </div>
      </div>

      {/* WIP Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center mb-4">
        <div className="flex justify-center mb-3">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
            WORK IN PROGRESS
          </span>
        </div>
        <p className="text-amber-200 text-sm mb-2">
          The compass is still being calibrated and improved.
        </p>
        <p className="text-amber-300/70 text-xs">
          We're working on improving the accuracy and rotation logic. Check back soon for updates!
        </p>
      </div>

      {/* Basic Qibla Info */}
      {initialLocation && (
        <div className="bg-slate-900/50 rounded-lg p-4 text-center mb-4">
          <p className="text-slate-400 text-xs mb-2">Your Location</p>
          <p className="text-white font-mono text-sm">
            {initialLocation.latitude.toFixed(4)}°N, {initialLocation.longitude.toFixed(4)}°E
          </p>
        </div>
      )}

      <button
        onClick={() => setShowWIPNotice(false)}
        className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
      >
        Close
      </button>
    </motion.div>
  );
}
