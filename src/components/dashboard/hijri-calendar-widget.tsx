'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CalendarDay, getHijriMonthData } from '@/lib/hijri-calendar-service';

export function HijriCalendarWidget() {
  const [monthData, setMonthData] = useState<ReturnType<typeof getHijriMonthData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getHijriMonthData();
    setMonthData(data);
    setLoading(false);
  }, []);

  if (loading || !monthData) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-3 md:p-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-indigo-300">Loading calendar...</p>
        </div>
      </div>
    );
  }

  const { monthName, year, days, today } = monthData;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-3 md:p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
          <h3 className="text-lg md:text-xl font-bold text-white">
            {monthName} {year}
          </h3>
        </div>
        <div className="text-sm md:text-base text-indigo-300 font-mono">
          {today.day} {monthName.substring(0, 3)} {year}
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'].map((day, i) => (
          <div
            key={i}
            className="text-center text-xs md:text-sm text-indigo-300 font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: monthData.firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {days.map((day) => (
          <DayCell
            key={day.day}
            day={day.day}
            isToday={day.isToday}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-indigo-500/20">
        <p className="text-xs md:text-sm text-indigo-300 text-center">
          {monthName} {year} • {days.length} days
        </p>
      </div>
    </motion.div>
  );
}

// Calendar Day Component
interface CalendarDayProps {
  day: number;
  isToday: boolean;
}

function DayCell({ day, isToday }: CalendarDayProps) {
  return (
    <div
      className={`
        aspect-square flex items-center justify-center rounded-lg text-sm md:text-base font-medium
        ${isToday
          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
          : 'text-indigo-200 hover:bg-indigo-500/10 transition-colors'
        }
      `}
    >
      {day}
    </div>
  );
}
