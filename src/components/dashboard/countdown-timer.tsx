'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetTimestamp: number;
  prayerName: string;
}

export function CountdownTimer({ targetTimestamp, prayerName }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      };
    };

    setTimeRemaining(calculateTime());
    const interval = setInterval(() => {
      setTimeRemaining(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const { hours, minutes, seconds } = timeRemaining;

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/50 backdrop-blur-sm border border-emerald-500/30 p-3 md:p-5 shadow-xl shadow-emerald-500/20"
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 bg-emerald-500/20 rounded-lg">
              <Timer className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-emerald-300/80 font-medium">Next Prayer</p>
              <h2 className="text-base md:text-xl font-bold text-white">
                {prayerName}
              </h2>
            </div>
          </div>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-3 gap-1.5 md:gap-3">
          {[
            { label: 'Hrs', value: hours },
            { label: 'Min', value: minutes },
            { label: 'Sec', value: seconds },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative"
            >
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3 border border-emerald-500/20">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl md:text-3xl lg:text-4xl font-bold text-white block text-center font-mono tabular-nums leading-none"
                  >
                    {formatTime(item.value)}
                  </motion.span>
                </AnimatePresence>
                <p className="text-[9px] md:text-[10px] text-emerald-300/70 text-center mt-1 uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
