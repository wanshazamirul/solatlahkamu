'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CurrentTimeWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) {
      return 'Selamat Pagi';
    } else if (hour >= 12 && hour < 15) {
      return 'Selamat Tengahari';
    } else if (hour >= 15 && hour < 19) {
      return 'Selamat Petang';
    } else {
      return 'Selamat Malam';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 md:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 bg-purple-500/20 rounded-xl">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-purple-300/80 font-medium">Current Time</p>
            <p className="text-sm md:text-base text-purple-200">{getGreeting()}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl md:text-4xl font-bold text-white font-mono tabular-nums">
            {formatTime(time)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
