'use client';

import { motion } from 'framer-motion';

interface PlaceholderCardProps {
  className?: string;
}

export function PlaceholderCard({ className = '' }: PlaceholderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className={`bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6 flex-1 flex items-center justify-center ${className}`}
    >
      <div className="text-center">
        <div className="text-3xl md:text-4xl mb-2 opacity-30">✨</div>
        <p className="text-xs md:text-sm text-slate-500 opacity-50">Coming Soon</p>
      </div>
    </motion.div>
  );
}
