'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getHourlyHadith } from '@/lib/hadith-service';

export function HadithWidget() {
  const [hadith, setHadith] = useState<{
    arabic: string;
    malay: string;
    source: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hour, setHour] = useState<number>(0);
  const [total, setTotal] = useState<number>(24);

  useEffect(() => {
    loadHadith();

    // Update every minute to check for new hour
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour !== hour) {
        console.log('[Hadith] New hour detected, refreshing...');
        loadHadith();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [hour]);

  const loadHadith = async () => {
    setLoading(true);
    try {
      const data = await getHourlyHadith();
      setHadith(data.hadith);
      setHour(data.hour);
      setTotal(data.total);
    } catch (err) {
      console.error('Error loading hadith:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-cyan-300">Loading hadith...</p>
        </div>
      </div>
    );
  }

  if (!hadith) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-4 md:p-6"
      >
        <div className="flex items-start gap-2 md:gap-3">
          <div className="p-2 md:p-3 bg-cyan-500/20 rounded-xl flex-shrink-0">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-cyan-300/80 font-medium mb-2">Hadith of the Hour</p>
            <p className="text-sm md:text-base text-slate-300 italic">
              "Knowledge is light."
            </p>
            <p className="text-xs md:text-sm text-cyan-400 mt-2 font-medium">
              — Unable to load
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-2 md:p-4 h-full flex"
    >
      <div className="flex items-start gap-2 md:gap-3 w-full">
        <div className="p-2 md:p-3 bg-cyan-500/20 rounded-xl flex-shrink-0">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm md:text-base text-cyan-300/80 font-medium">
              Hadith of the Hour
            </p>
            <div className="flex items-center gap-1 text-xs md:text-sm text-cyan-400/60">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span>{hour}:00</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {/* Arabic Text */}
            <p className="text-lg md:text-xl text-cyan-100 text-right leading-relaxed mb-2 font-arabic" dir="rtl">
              {hadith.arabic}
            </p>

            {/* Malay Translation */}
            <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-2">
              "{hadith.malay}"
            </p>

            {/* Source */}
            <p className="text-xs md:text-sm text-cyan-400 font-medium">
              — {hadith.source}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
