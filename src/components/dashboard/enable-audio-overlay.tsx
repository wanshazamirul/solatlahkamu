'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EnableAudioOverlayProps {
  onEnable: () => void;
}

export function EnableAudioOverlay({ onEnable }: EnableAudioOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already enabled audio
    const hasEnabled = localStorage.getItem('azanAudioEnabled');
    if (!hasEnabled) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleEnable = () => {
    // Unlock audio by playing a silent sound
    const silentAudio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
    silentAudio.play().then(() => {
      // Mark as enabled in localStorage
      localStorage.setItem('azanAudioEnabled', 'true');
      setIsVisible(false);
      onEnable();
    }).catch((err) => {
      console.error('Failed to unlock audio:', err);
      // Still close overlay even if unlock fails
      localStorage.setItem('azanAudioEnabled', 'true');
      setIsVisible(false);
      onEnable();
    });
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
            <Volume2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
          </motion.div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Enable Azan Audio
          </h2>

          {/* Description */}
          <p className="text-slate-300 mb-6 text-sm md:text-base">
            To automatically play azan at prayer times, we need your permission to enable audio.
          </p>

          {/* Instructions */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-slate-400 mb-2 font-semibold">What happens:</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Azan will play automatically at each prayer time</li>
              <li>• A splashscreen will appear during azan</li>
              <li>• Countdown will auto-advance to next prayer</li>
            </ul>
          </div>

          {/* Enable Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEnable}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all"
          >
            Enable Azan Audio
          </motion.button>

          {/* Skip Button */}
          <button
            onClick={() => {
              localStorage.setItem('azanAudioEnabled', 'true');
              setIsVisible(false);
              onEnable();
            }}
            className="mt-3 text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            Skip (audio will be blocked by browser)
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
