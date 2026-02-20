'use client';

import { motion } from 'framer-motion';
import { Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PrayerDisplay } from '@/types/waktu-solat';

interface PrayerCardProps {
  prayer: PrayerDisplay;
  index: number;
  isNext: boolean;
  onTestAzan?: (prayerName: string, prayerNameArabic: string) => void;
}

export function PrayerCard({ prayer, index, isNext, onTestAzan }: PrayerCardProps) {
  // Check if this is Syuruk (sunrise) - not a prayer time with azan
  const isSyuruk = prayer.name.toLowerCase() === 'syuruk';

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ scale: isSyuruk ? 1 : 1.02, y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative overflow-hidden rounded-lg md:rounded-xl p-2 md:p-3 backdrop-blur-sm border h-full flex flex-col',
        isNext && !isSyuruk
          ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
          : isSyuruk
            ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30'
            : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-slate-600/50'
      )}
    >
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {/* Icon & Name */}
        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
          <div
            className={cn(
              'p-1.5 md:p-2 rounded-lg text-lg md:text-xl',
              (isNext && !isSyuruk)
                ? 'bg-emerald-500/20'
                : isSyuruk
                  ? 'bg-amber-500/20'
                  : 'bg-slate-700/50'
            )}
          >
            {prayer.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-xs md:text-lg font-medium truncate",
              isSyuruk ? "text-amber-300" : "text-slate-400"
            )}>
              {prayer.name}
            </h3>
            {prayer.nameArabic && (
              <p className={cn(
                "text-[10px] md:text-base truncate",
                isSyuruk ? "text-amber-400/70" : "text-slate-500"
              )}>{prayer.nameArabic}</p>
            )}
          </div>

          {/* Test Azan Button - Top Right */}
          {onTestAzan && !isSyuruk && (
            <button
              onClick={() => onTestAzan(prayer.name, prayer.nameArabic)}
              className="p-1 md:p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition-colors flex-shrink-0"
              title="Test azan for this prayer"
            >
              <Play className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          )}

          {!isSyuruk && isNext && (
            <div className="px-1.5 md:px-2.5 py-0.5 md:py-1 text-[9px] md:text-sm font-semibold bg-emerald-500 text-white rounded-full flex-shrink-0">
              NEXT
            </div>
          )}
        </div>

        {/* Time Display */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <Clock className={cn(
            'w-4 h-4 md:w-7 md:h-7 flex-shrink-0',
            isSyuruk
              ? 'text-amber-400'
              : isNext
                ? 'text-emerald-400'
                : 'text-slate-500'
          )} />
          <span
            className={cn(
              'text-2xl md:text-6xl font-bold font-mono tabular-nums leading-none',
              isSyuruk
                ? 'text-amber-300'
                : isNext
                  ? 'text-emerald-400'
                  : 'text-slate-200'
            )}
          >
            {prayer.time}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
