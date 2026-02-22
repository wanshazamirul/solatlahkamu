'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoneSelector } from '@/components/dashboard/zone-selector';
import { PrayerCard } from '@/components/dashboard/prayer-card';
import { CountdownTimer } from '@/components/dashboard/countdown-timer';
import { LoadingSpinner } from '@/components/dashboard/loading-spinner';
import { KioskToggle } from '@/components/dashboard/kiosk-toggle';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { DailyVerseWidget } from '@/components/dashboard/daily-verse-widget';
import { HadithWidget } from '@/components/dashboard/hadith-widget';
import { HijriCalendarWidget } from '@/components/dashboard/hijri-calendar-widget';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { EnableAudioOverlay } from '@/components/dashboard/enable-audio-overlay';
import { EnableGPSOverlay } from '@/components/enable-gps-overlay';
import { KiblatFinder } from '@/components/kiblat-finder';
import { PrayerSplashscreen } from '@/components/dashboard/prayer-splashscreen';
import {
  fetchPrayerTimes,
  formatTimestamp,
  getNextPrayer,
  getNextPrayerAfter,
} from '@/lib/waktu-solat-service';
import { playAzan, stopAzan } from '@/lib/azan-service';
import { startZoneChecking } from '@/lib/zone-service';
import { DEFAULT_ZONE, Zone, PrayerDisplay } from '@/types/waktu-solat';

const initialZone: Zone = DEFAULT_ZONE;

export default function DashboardPage() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [availableZones, setAvailableZones] = useState<Zone[]>([]);
  const [isCheckingZones, setIsCheckingZones] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerDisplay[]>([]);
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: number;
    key: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Splashscreen and azan state
  const [showSplashscreen, setShowSplashscreen] = useState(false);
  const [currentSplashPrayer, setCurrentSplashPrayer] = useState<{
    name: string;
    nameArabic: string;
  } | null>(null);
  const [isAzanPlaying, setIsAzanPlaying] = useState(false);
  const azanAudioRef = useRef<HTMLAudioElement | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Ref to store today's prayers for next prayer calculation
  const todayPrayersRef = useRef<any>(null);

  // Track which prayer we've already triggered azan for to prevent re-triggering
  const triggeredPrayerRef = useRef<string | null>(null);

  // Ref to track if we should auto-close
  const shouldAutoCloseRef = useRef(true);

  // On page load: try to get GPS location first, fall back to manual/default
  useEffect(() => {
    const initZone = async () => {
      // Check if audio is already enabled
      const hasEnabled = localStorage.getItem('azanAudioEnabled');
      if (hasEnabled) {
        setAudioEnabled(true);
      }

      // Check if GPS permission was previously granted
      const gpsGranted = localStorage.getItem('gpsPermissionGranted');

      if (gpsGranted && navigator.geolocation) {
        // Try to get fresh GPS location
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              { enableHighAccuracy: true, timeout: 10000 }
            );
          });

          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setGpsLocation(location);
          localStorage.setItem('cachedGPSLocation', JSON.stringify(location));

          // Auto-detect zone from GPS
          if (availableZones.length > 0) {
            try {
              const response = await fetch(`https://api.waktusolat.app/zones/${location.latitude}/${location.longitude}`);
              const data = await response.json();
              const zone = availableZones.find(z => z.code === data.zone);
              if (zone) {
                setSelectedZone(zone);
                localStorage.setItem('cachedZone', data.zone);
                return;
              }
            } catch (err) {
              console.error('Failed to auto-detect zone:', err);
            }
          }
        } catch (err) {
          console.log('GPS fetch failed, using manual/default zone:', err);
        }
      }

      // Fallback: Use cached zone or default
      const cachedZone = localStorage.getItem('cachedZone');
      if (cachedZone && availableZones.length > 0) {
        const zone = availableZones.find(z => z.code === cachedZone);
        if (zone) {
          setSelectedZone(zone);
          return;
        }
      }

      // Final fallback: Default zone
      setSelectedZone(DEFAULT_ZONE);
    };

    initZone();
  }, [availableZones]);

  // Load prayer times when zone is selected
  useEffect(() => {
    if (selectedZone) {
      loadPrayerTimes();
    }
  }, [selectedZone]);

  // Start dynamic zone checking
  useEffect(() => {
    const cleanup = startZoneChecking((zones) => {
      setAvailableZones(zones);
      setIsCheckingZones(false);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Reset triggered prayers at midnight (new day)
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        triggeredPrayerRef.current = null;
        // Reload prayer times for the new day
        loadPrayerTimes();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadPrayerTimes = async () => {
    if (!selectedZone) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPrayerTimes(selectedZone.code);
      const today = new Date().getDate();

      // Get today's prayers
      const todayPrayers = data.prayers.find((p) => p.day === today);

      if (!todayPrayers) {
        throw new Error('Prayer times for today not found');
      }

      // Convert to display format
      const prayers: PrayerDisplay[] = [
        {
          name: 'Fajr',
          nameArabic: 'Subuh',
          time: formatTimestamp(todayPrayers.fajr),
          timestamp: todayPrayers.fajr,
          icon: '🌙',
        },
        {
          name: 'Syuruk',
          nameArabic: 'Sunrise',
          time: formatTimestamp(todayPrayers.syuruk),
          timestamp: todayPrayers.syuruk,
          icon: '🌅',
        },
        {
          name: 'Dhuhr',
          nameArabic: 'Zohor',
          time: formatTimestamp(todayPrayers.dhuhr),
          timestamp: todayPrayers.dhuhr,
          icon: '☀️',
        },
        {
          name: 'Asr',
          nameArabic: 'Asar',
          time: formatTimestamp(todayPrayers.asr),
          timestamp: todayPrayers.asr,
          icon: '🌤️',
        },
        {
          name: 'Maghrib',
          nameArabic: 'Maghrib',
          time: formatTimestamp(todayPrayers.maghrib),
          timestamp: todayPrayers.maghrib,
          icon: '🌅',
        },
        {
          name: 'Isha',
          nameArabic: 'Isyak',
          time: formatTimestamp(todayPrayers.isha),
          timestamp: todayPrayers.isha,
          icon: '🌙',
        },
      ];

      setPrayerTimes(prayers);

      // Store today's prayers for auto-advance after azan
      todayPrayersRef.current = todayPrayers;

      // Reset triggered prayer when loading new prayer times (new day)
      triggeredPrayerRef.current = null;

      // Get next prayer
      const next = getNextPrayer(todayPrayers);
      setNextPrayer(next);

      setLoading(false);
    } catch (err) {
      console.error('Error loading prayer times:', err);

      // Better error message with zone info
      setError(`Zone "${selectedZone?.name || 'Unknown'}" (${selectedZone?.code || 'N/A'}) is not available. Please try another zone.`);
      setLoading(false);
    }
  };

  // Function to trigger azan and splashscreen
  const triggerAzan = (prayerName: string, prayerNameArabic: string, shouldAutoAdvance = true) => {
    // Stop any playing azan first
    if (azanAudioRef.current) {
      stopAzan(azanAudioRef.current);
    }

    // Set splashscreen state
    setCurrentSplashPrayer({ name: prayerName, nameArabic: prayerNameArabic });
    setShowSplashscreen(true);
    setIsAzanPlaying(true);

    // Get the prayer key to use for auto-advance
    const prayerKey = prayerName.toLowerCase();

    // For manual test (shouldAutoAdvance = false), play audio but don't auto-advance
    if (!shouldAutoAdvance) {
      const testAudio = playAzan(prayerName, () => {
        console.log('[Test Azan] Audio finished, closing splashscreen...');
        setIsAzanPlaying(false);
        setShowSplashscreen(false);
      });
      azanAudioRef.current = testAudio;
      return;
    }

    // Play azan for automatic triggers
    const audio = playAzan(prayerName, () => {
      // When azan finishes successfully
      console.log('[Azan] Audio finished, hiding splashscreen in 1 second...');
      setIsAzanPlaying(false);

      setTimeout(() => {
        setShowSplashscreen(false);

        // Auto-advance to next prayer
        if (todayPrayersRef.current) {
          const next = getNextPrayerAfter(todayPrayersRef.current, prayerKey);
          setNextPrayer(next);

          // Clear triggered flag for the next prayer
          triggeredPrayerRef.current = null;
          setForceUpdate(prev => prev + 1);

          console.log('[Azan] Advanced to next prayer:', next);
        }
      }, 1000); // Small delay before hiding splashscreen
    });

    azanAudioRef.current = audio;
  };

  // Monitor current time and trigger azan when it matches prayer time
  useEffect(() => {
    if (!todayPrayersRef.current || showSplashscreen || !audioEnabled) return;

    const now = Math.floor(Date.now() / 1000);
    const currentMinute = Math.floor(now / 60); // Current time in minutes

    // Check each prayer time
    for (const prayer of prayerTimes) {
      const prayerMinute = Math.floor(prayer.timestamp / 60);
      const prayerKey = prayer.name.toLowerCase();

      // Trigger azan if:
      // 1. Current minute matches prayer minute
      // 2. We haven't triggered for this prayer yet
      const minuteMatches = currentMinute === prayerMinute;
      const notYetTriggered = triggeredPrayerRef.current !== prayerKey;

      if (minuteMatches && notYetTriggered) {
        // Mark this prayer as triggered
        triggeredPrayerRef.current = prayerKey;
        triggerAzan(prayer.name, prayer.nameArabic);
        break; // Only trigger one prayer at a time
      }
    }
  }, [currentTime, showSplashscreen, prayerTimes, audioEnabled]);

  // Handle test azan button click
  const handleTestAzan = (prayerName: string, prayerNameArabic: string) => {
    // Reset triggered flag to allow manual testing for any prayer
    triggeredPrayerRef.current = null;
    // Pass false to NOT auto-advance after azan (this is just a test)
    triggerAzan(prayerName, prayerNameArabic, false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-4 md:p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {
            setError(null);
            setSelectedZone(DEFAULT_ZONE);
          }}
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Zone Not Available</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <p className="text-sm text-slate-500">
            Click here or select a different zone from the list above.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-3 md:px-4 py-2 md:py-3 overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-2 md:mb-3 shrink-0"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-2xl md:text-4xl">
              🕌
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white leading-tight">
                Waktu Solat
              </h1>
              <p className="text-xs md:text-sm text-emerald-400">Prayer Times Malaysia</p>
            </div>
          </div>

          {/* Current Time */}
          <div className="text-right">
            <p className="text-xs md:text-sm text-slate-400">Current Time</p>
            <p className="text-base md:text-2xl font-bold text-white font-mono tabular-nums">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        </motion.header>

        {/* Main Content Grid - 3 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-3 flex-1 min-h-0 mb-2 md:mb-3">
          {/* Left Column - Zone, Weather, Kiblat Finder */}
          <div className="lg:col-span-3 flex flex-col gap-2 md:gap-3 shrink-0">
            {/* Zone Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ZoneSelector
                selectedZone={selectedZone || DEFAULT_ZONE}
                onZoneChange={setSelectedZone}
                zones={availableZones}
                isLoading={isCheckingZones}
              />
            </motion.div>

            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WeatherWidget zone={selectedZone || DEFAULT_ZONE} />
            </motion.div>

            {/* Kiblat Finder - Mobile only, show notice on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:hidden"
            >
              <KiblatFinder initialLocation={gpsLocation} />
            </motion.div>

            {/* Desktop Notice for Kiblat Finder */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:block"
            >
              <div className="bg-gradient-to-br from-emerald-950 to-slate-950 rounded-2xl p-6 border border-emerald-800/30 text-center">
                <div className="p-3 bg-emerald-500/20 rounded-xl w-fit mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Kiblat Finder</h3>
                <p className="text-emerald-300/70 text-sm">
                  This feature requires a mobile device with GPS and compass sensors
                </p>
                <p className="text-emerald-300/50 text-xs mt-2">
                  Open on your phone to find Qibla direction
                </p>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Prayer Times (Hero) */}
          <div className="lg:col-span-6 flex flex-col min-h-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 md:p-3 flex-1 flex flex-col min-h-0"
            >
              <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 text-center shrink-0">
                Today's Prayer Times
              </h2>

              <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1 items-center">
                {prayerTimes.map((prayer, index) => (
                  <PrayerCard
                    key={prayer.name}
                    prayer={prayer}
                    index={index}
                    isNext={nextPrayer?.key === prayer.name.toLowerCase()}
                    onTestAzan={handleTestAzan}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Countdown, Hijri Calendar */}
          <div className="lg:col-span-3 flex flex-col gap-2 md:gap-3 shrink-0">
            {/* Countdown Timer */}
            {nextPrayer && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CountdownTimer
                  key={`${nextPrayer.key}-${forceUpdate}`}
                  targetTimestamp={nextPrayer.time}
                  prayerName={nextPrayer.name}
                />
              </motion.div>
            )}

            {/* Hijri Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <HijriCalendarWidget />
            </motion.div>
          </div>
        </div>

        {/* Bottom Row - Hadith & Daily Verse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 shrink-0" style={{ minHeight: '12vh' }}>
          {/* Hadith of the Hour */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <HadithWidget />
          </motion.div>

          {/* Daily Verse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <DailyVerseWidget />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center shrink-0 py-1"
        >
          <p className="text-xs text-slate-500">
            Data from JAKIM e-Solat • API by{' '}
            <a
              href="https://api.waktusolat.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Waktu Solat Project
            </a>
          </p>
        </motion.footer>
      </div>

      {/* Fullscreen Mode Toggle */}
      <KioskToggle />

      {/* Enable Audio Overlay */}
      {!audioEnabled && <EnableAudioOverlay onEnable={() => setAudioEnabled(true)} />}

      {/* Enable GPS Overlay */}
      <EnableGPSOverlay
        onEnable={(location) => {
          setGpsLocation(location);
          // Zone detection will happen in initZone on next render
          // Trigger re-init by setting a flag or just let it flow through
        }}
        onSkip={() => {
          setGpsLocation(null);
          // Use default zone when skipped - initZone will handle this
        }}
      />

      {/* Prayer Splashscreen */}
      {currentSplashPrayer && (
        <PrayerSplashscreen
          isVisible={showSplashscreen}
          prayerName={currentSplashPrayer.name}
          prayerNameArabic={currentSplashPrayer.nameArabic}
          isPlaying={isAzanPlaying}
          onClose={() => {
            setShowSplashscreen(false);
            setIsAzanPlaying(false);
            if (azanAudioRef.current) {
              stopAzan(azanAudioRef.current);
            }
          }}
        />
      )}
    </div>
  );
}
