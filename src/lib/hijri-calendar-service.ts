// Hijri Calendar Service
// Calculates Hijri calendar data for display

export interface CalendarDay {
  day: number;
  isToday: boolean;
}

export interface HijriMonthData {
  monthName: string;
  year: number;
  days: CalendarDay[];
  firstDayOfWeek: number; // 0 = Sunday, 6 = Saturday
  today: {
    day: number;
    month: string;
    year: number;
  };
}

// Hijri month names in Arabic and Malay
const HIJRI_MONTHS = [
  { arabic: 'محرم', malay: 'Muharram' },
  { arabic: 'صفر', malay: 'Safar' },
  { arabic: 'ربيع الأول', malay: 'Rabiulawal' },
  { arabic: 'ربيع الثاني', malay: 'Rabiulakhir' },
  { arabic: 'جمادى الأولى', malay: 'Jamadilawal' },
  { arabic: 'جمادى الثانية', malay: 'Jamadilakhir' },
  { arabic: 'رجب', malay: 'Rejab' },
  { arabic: 'شعبان', malay: 'Syaaban' },
  { arabic: 'رمضان', malay: 'Ramadhan' },
  { arabic: 'شوال', malay: 'Syawal' },
  { arabic: 'ذو القعدة', malay: 'Zulkaedah' },
  { arabic: 'ذو الحجة', malay: 'Zulhijjah' },
];

/**
 * Convert Gregorian date to Hijri
 * Approximate calculation (for display purposes)
 */
function gregorianToHijri(date: Date): {
  day: number;
  month: number;
  year: number;
} {
  // Approximate conversion algorithm
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  let lp = l - 10631 * n + 354;
  const j = Math.floor((10985 - lp) / 5316) * Math.floor((50 * lp) / 17719) + Math.floor(lp / 5670) * Math.floor((43 * lp) / 15238);
  l = lp - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { day, month: month - 1, year };
}

/**
 * Get days in Hijri month (29 or 30 days)
 */
function getDaysInHijriMonth(month: number, year: number): number {
  // Alternate between 29 and 30 days based on month parity
  // Odd months = 30, Even months = 29 (simplified)
  return month % 2 === 0 ? 29 : 30;
}

/**
 * Get Hijri month data for calendar display
 */
export function getHijriMonthData(): HijriMonthData {
  const now = new Date();
  const hijri = gregorianToHijri(now);

  const monthIndex = hijri.month;
  const monthName = HIJRI_MONTHS[monthIndex].malay;
  const year = hijri.year;

  // Calculate first day of month (simplified - assumes starts on random day)
  // In reality, this would need proper astronomical calculation
  const firstDayOfWeek = (now.getDay() - (hijri.day - 1) % 7 + 7) % 7;

  // Generate calendar days
  const daysInMonth = getDaysInHijriMonth(monthIndex, year);
  const days: CalendarDay[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isToday: i === hijri.day
    });
  }

  return {
    monthName,
    year,
    days,
    firstDayOfWeek,
    today: {
      day: hijri.day,
      month: monthName,
      year
    }
  };
}
