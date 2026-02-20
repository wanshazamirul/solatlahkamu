'use client';

import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudDrizzle, CloudLightning, Thermometer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchWeatherForecast, getCurrentForecast, mapZoneToWeatherLocation } from '@/lib/weather-service';
import { Zone } from '@/types/waktu-solat';

interface WeatherWidgetProps {
  zone: Zone;
}

export function WeatherWidget({ zone }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<{
    forecast: string;
    minTemp: number;
    maxTemp: number;
    location: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeather();
  }, [zone]);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const locationName = mapZoneToWeatherLocation(zone.code);

      // If no location mapping exists, show "No info"
      if (!locationName) {
        setError('No weather information for this zone');
        setLoading(false);
        return;
      }

      const data = await fetchWeatherForecast(locationName);

      if (data && data.length > 0) {
        // Find the exact matching location
        const exactMatch = data.find(w =>
          w.location.location_name.toLowerCase() === locationName.toLowerCase()
        );

        const todayWeather = exactMatch || data[0];
        setWeather({
          forecast: getCurrentForecast(todayWeather),
          minTemp: todayWeather.min_temp,
          maxTemp: todayWeather.max_temp,
          location: todayWeather.location.location_name,
        });
      } else {
        setError('No weather data available');
      }
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Weather data unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (forecast: string) => {
    const lowerForecast = forecast.toLowerCase();

    if (lowerForecast.includes('ribut') || lowerForecast.includes('petir') || lowerForecast.includes('thunder')) {
      return CloudLightning;
    }
    if (lowerForecast.includes('hujan') || lowerForecast.includes('rain')) {
      return CloudRain;
    }
    if (lowerForecast.includes('cerah') || lowerForecast.includes('sun') || lowerForecast.includes('panas')) {
      return Sun;
    }
    if (lowerForecast.includes('berawan') || lowerForecast.includes('cloud')) {
      return Cloud;
    }

    return CloudDrizzle; // Default
  };

  if (loading) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-700/30 rounded-xl animate-pulse">
            <Cloud className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <div className="h-4 w-32 bg-slate-700/30 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-24 bg-slate-700/30 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Cloud className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-blue-300/80 font-medium">Weather Forecast</p>
            <p className="text-sm text-slate-400">No weather information available</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.forecast);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <WeatherIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-blue-300/80 font-medium">Weather Forecast</p>
            <p className="text-lg font-semibold text-white">{weather.location}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-slate-300">{weather.forecast}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-400">
              {weather.minTemp}°C - {weather.maxTemp}°C
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
