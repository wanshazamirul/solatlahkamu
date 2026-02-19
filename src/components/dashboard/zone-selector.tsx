'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Zone } from '@/types/waktu-solat';
import { cn } from '@/lib/utils';

interface ZoneSelectorProps {
  selectedZone: Zone;
  onZoneChange: (zone: Zone) => void;
  zones: Zone[];
  isLoading?: boolean;
}

export function ZoneSelector({ selectedZone, onZoneChange, zones, isLoading = false }: ZoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Selector Button */}
      <motion.button
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className={cn(
          'w-full flex items-center justify-between gap-4 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300',
          isOpen
            ? 'bg-emerald-500/20 border-emerald-500/50'
            : 'bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/30'
        )}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="p-2 bg-emerald-500/20 rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5 text-emerald-400" />
            )}
          </motion.div>

          <div className="text-left">
            <p className="text-xs text-slate-400">Selected Zone</p>
            <p className="text-lg font-semibold text-white">
              {selectedZone.name}
            </p>
            <p className="text-xs text-emerald-400">
              {selectedZone.code} {isLoading && '(Checking zones...)'}
            </p>
          </div>
        </div>

        {!isLoading && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {!isLoading && isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-10"
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute z-20 w-full mt-2 max-h-96 overflow-y-auto rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl"
            >
              {/* Group zones by state */}
              {Object.entries(
                zones.reduce((acc, zone) => {
                  if (!acc[zone.state]) {
                    acc[zone.state] = [];
                  }
                  acc[zone.state].push(zone);
                  return acc;
                }, {} as Record<string, Zone[]>)
              ).map(([state, zones], stateIndex) => (
                <div key={state}>
                  {/* State Header */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stateIndex * 0.05 }}
                    className="sticky top-0 bg-slate-900/95 backdrop-blur-xl px-4 py-2 border-b border-slate-700/50 z-10"
                  >
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      {state}
                    </p>
                  </motion.div>

                  {/* Zone Options */}
                  {zones.map((zone, zoneIndex) => (
                    <motion.button
                      key={zone.code}
                      onClick={() => {
                        onZoneChange(zone);
                        setIsOpen(false);
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stateIndex * 0.05 + zoneIndex * 0.02 }}
                      whileHover={{ x: 4, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'w-full flex items-center justify-between gap-3 px-4 py-3 transition-all duration-200',
                        selectedZone.code === zone.code
                          ? 'bg-emerald-500/20 border-l-2 border-emerald-500'
                          : 'hover:bg-slate-800/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <div className="text-left">
                          <p
                            className={cn(
                              'text-sm font-medium',
                              selectedZone.code === zone.code
                                ? 'text-emerald-400'
                                : 'text-slate-300'
                            )}
                          >
                            {zone.name}
                          </p>
                          <p className="text-xs text-slate-500">{zone.code}</p>
                        </div>
                      </div>

                      {selectedZone.code === zone.code && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-emerald-500 rounded-full"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
