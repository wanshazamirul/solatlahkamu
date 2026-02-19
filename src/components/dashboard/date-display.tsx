'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface DateDisplayProps {
  hijriDate: string;
  zoneName: string;
  gregorianDate?: Date;
}

export function DateDisplay({
  hijriDate,
  zoneName,
  gregorianDate = new Date(),
}: DateDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-4 md:p-6"
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Gregorian Date */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-emerald-500/20 rounded-lg">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">
                Gregorian Calendar
              </p>
              <p className="text-base md:text-2xl font-bold text-white">
                {format(gregorianDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent my-3 md:my-4" />

        {/* Hijri Date & Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-teal-500/20 rounded-lg">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">
                Location
              </p>
              <p className="text-sm md:text-lg font-semibold text-white">{zoneName}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">
              Hijri Calendar
            </p>
            <p className="text-base md:text-2xl font-bold text-teal-400">{hijriDate}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
