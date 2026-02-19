'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function KioskToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Check fullscreen state on mount
    setIsFullscreen(!!document.fullscreenElement);

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Listen for 'F' key to toggle
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Auto-enter fullscreen on first visit (with user gesture check)
    const hasSeenFullscreenHint = localStorage.getItem('waktu-solat-fullscreen-hint');
    if (!hasSeenFullscreenHint) {
      // Don't auto-enter, just show hint
      localStorage.setItem('waktu-solat-fullscreen-hint', 'true');
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Don't render button when in fullscreen
  if (isFullscreen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        onClick={toggleFullscreen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group relative flex items-center gap-2 px-4 py-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800/80 transition-all"
        title={`Press 'F' to enter fullscreen, 'ESC' to exit`}
      >
        <span className="text-2xl">⛶</span>
        <span className="text-white font-semibold text-sm">
          Fullscreen Mode
        </span>

        {/* Keyboard shortcut hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute -top-8 right-0 px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-white">F</kbd> to enter
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
