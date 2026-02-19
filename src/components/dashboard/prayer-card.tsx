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
      whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative overflow-hidden rounded-lg md:rounded-xl p-2 md:p-3 backdrop-blur-sm border',
        isNext
          ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
          : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-slate-600/50'
      )}
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Icon & Name */}
        <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
          <div
            className={cn(
              'p-1 md:p-1.5 rounded-md md:rounded-lg text-sm md:text-base',
              isNext
                ? 'bg-emerald-500/20'
                : 'bg-slate-700/50'
            )}
          >
            {prayer.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[11px] md:text-xs font-medium text-slate-400 truncate">
              {prayer.name}
            </h3>
            {prayer.nameArabic && (
              <p className="text-[9px] md:text-[10px] text-slate-500 truncate">{prayer.nameArabic}</p>
            )}
          </div>

          {isNext && (
            <div className="px-1.5 md:px-2 py-0.5 md:py-1 text-[9px] md:text-[10px] font-semibold bg-emerald-500 text-white rounded-full flex-shrink-0">
              NEXT
            </div>
          )}
        </div>

        {/* Time Display */}
        <div className="flex items-center justify-between gap-1.5 md:gap-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Clock className={cn('w-3 h-3 md:w-4 md:h-4 flex-shrink-0', isNext ? 'text-emerald-400' : 'text-slate-500')} />
            <span
              className={cn(
                'text-lg md:text-2xl font-bold font-mono tabular-nums',
                isNext ? 'text-emerald-400' : 'text-slate-200'
              )}
            >
              {prayer.time}
            </span>
          </div>

          {/* Debug Azan Button */}
          {onTestAzan && (
            <button
              onClick={() => onTestAzan(prayer.name, prayer.nameArabic)}
              className="p-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition-colors"
              title="Test azan for this prayer"
            >
              <Play className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
