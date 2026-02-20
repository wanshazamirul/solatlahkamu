'use client';

import { motion } from 'framer-motion';
import { BookOpen, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDailyVerse, formatVerseReference } from '@/lib/quran-service';

export function DailyVerseWidget() {
  const [verse, setVerse] = useState<{
    arabic: string;
    translation: string;
    reference: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadVerse();
  }, []);

  const loadVerse = async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getDailyVerse();

      setVerse({
        arabic: data.arabic2,
        translation: data.english,
        reference: formatVerseReference(data),
      });
    } catch (err) {
      console.error('Error loading verse:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-amber-400 animate-spin" />
          <p className="text-sm text-amber-300">Loading verse...</p>
        </div>
      </div>
    );
  }

  if (error || !verse) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 md:p-6"
      >
        <div className="flex items-start gap-2 md:gap-3">
          <div className="p-2 md:p-3 bg-amber-500/20 rounded-xl flex-shrink-0">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-amber-300/80 font-medium mb-2">Verse of the Day</p>
            <p className="text-sm md:text-base text-slate-300 italic">
              "Indeed, with hardship comes ease."
            </p>
            <p className="text-xs md:text-sm text-amber-400 mt-2 font-medium">
              — QS. Ash-Sharh: 6
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Unable to load from API
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
      className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-2 md:p-4 h-full flex"
    >
      <div className="flex items-start gap-2 md:gap-3 w-full">
        <div className="p-2 md:p-3 bg-amber-500/20 rounded-xl flex-shrink-0">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-sm md:text-base text-amber-300/80 font-medium mb-2">Verse of the Day</p>

          <div className="flex-1 flex flex-col justify-center">
            {/* Arabic Text */}
            <p className="text-lg md:text-xl text-amber-100 text-right leading-relaxed mb-2" dir="rtl">
              {verse.arabic}
            </p>

            {/* Translation */}
            <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-2">
              "{verse.translation}"
            </p>

            {/* Reference */}
            <p className="text-xs md:text-sm text-amber-400 font-medium">
              — {verse.reference}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
