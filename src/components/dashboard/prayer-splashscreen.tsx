'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface PrayerSplashscreenProps {
  isVisible: boolean;
  prayerName: string;
  prayerNameArabic: string;
  isPlaying: boolean;
  onClose?: () => void;
}

export function PrayerSplashscreen({
  isVisible,
  prayerName,
  prayerNameArabic,
  isPlaying,
  onClose,
}: PrayerSplashscreenProps) {
  const handleClick = () => {
    console.log('[Splashscreen] Clicked! Calling onClose...');
    if (onClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 cursor-pointer"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-emerald-500/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -200, 0],
                  x: [0, Math.random() * 100 - 50, 0],
                  opacity: [0, 0.8, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-8 py-12">
            {/* Prayer time label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-emerald-400 text-lg md:text-2xl font-medium mb-4"
            >
              Prayer Time has arrived
            </motion.p>

            {/* Prayer name in Arabic */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-white mb-4"
            >
              {prayerNameArabic}
            </motion.h1>

            {/* Prayer name in English */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-emerald-300 mb-8"
            >
              {prayerName}
            </motion.h2>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="w-64 md:w-96 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-8"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
