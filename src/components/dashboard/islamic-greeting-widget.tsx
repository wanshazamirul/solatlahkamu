'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export function IslamicGreetingWidget() {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    // Determine greeting based on prayer times
    if (hour >= 5 && hour < 6) {
      setGreeting('وقت النجاة - Dawn Time');
      setQuote('The best time for tahajud prayer');
    } else if (hour >= 6 && hour < 12) {
      setGreeting('صباح الخير - Good Morning');
      setQuote('Start your day with prayer and gratitude');
    } else if (hour >= 12 && hour < 15) {
      setGreeting('السلام عليكم - Good Afternoon');
      setQuote('Remember Allah in moments of ease');
    } else if (hour >= 15 && hour < 18) {
      setGreeting('مساء الخير - Good Afternoon');
      setQuote('Asr time has approached, remember your prayer');
    } else if (hour >= 18 && hour < 19) {
      setGreeting('مساء الخير - Good Evening');
      setQuote('Maghrib time - break your fast with gratitude');
    } else if (hour >= 19 && hour < 22) {
      setGreeting('مساء الخير - Good Evening');
      setQuote('Isha time - end your day with prayer');
    } else {
      setGreeting('تصبح الله - Good Night');
      setQuote('Rest well, ready for Fajr prayer');
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-4 md:p-6"
    >
      <div className="flex items-center gap-2 md:gap-3">
        <div className="p-2 md:p-3 bg-pink-500/20 rounded-xl flex-shrink-0">
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg md:text-xl font-bold text-white mb-1">
            {greeting}
          </p>
          <p className="text-xs md:text-sm text-pink-200">
            {quote}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
