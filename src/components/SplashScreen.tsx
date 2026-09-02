import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2200,
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Smooth progress bar animation over durationMs
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);
      if (elapsed >= durationMs) {
        clearInterval(interval);
        if (onFinish) onFinish();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [durationMs, onFinish]);

  return (
    <div
      id="sph-splash-screen"
      className="fixed inset-0 z-[9999] flex flex-col justify-between items-center bg-[#0F172A] text-white select-none overflow-hidden antialiased"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 48px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 36px)',
      }}
    >
      {/* Background Multi-Layer Ambient Glowing Radial Auras */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Soft Radial Center Aura */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 via-emerald-500/15 to-transparent blur-[90px] animate-pulse" />
        <div className="absolute w-[340px] h-[340px] rounded-full bg-amber-500/10 blur-[70px]" />
        
        {/* Subtle Tech Grid / Mesh */}
        <div 
          className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" 
        />
      </div>

      {/* Top Subtle Status / Version Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700/60 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">
          SPH APPS • SECURE HUB v2.4
        </span>
      </motion.div>

      {/* Center Main Stage: Shield Logo, Title, Subtitle, Progress */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-6 max-w-md w-full my-auto">
        
        {/* 3D Shield Logo with Breathing Neon Glow */}
        <motion.div
          initial={{ scale: 0.82, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-7 flex items-center justify-center"
        >
          {/* Breathing Glow Halo behind Shield */}
          <div className="absolute -inset-5 rounded-full bg-gradient-to-r from-blue-600/40 via-emerald-500/35 to-amber-500/30 blur-2xl animate-pulse" />

          {/* SPH Official 3D Shield Emblem */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 drop-shadow-[0_12px_32px_rgba(37,99,235,0.45)]">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                {/* Outer Shield Gradient: Vibrant Royal Blue to Deep Emerald */}
                <linearGradient id="splashShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                {/* Accent Gold/Amber Gradient */}
                <linearGradient id="splashGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* Core Inner Gradient */}
                <linearGradient id="splashCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>

                {/* Highlight Sheen */}
                <linearGradient id="splashSheen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Outer Shield Frame with 3D Bevel */}
              <path
                d="M50 7 L85 22 C85 55 70 80 50 93 C30 80 15 55 15 22 L50 7 Z"
                fill="url(#splashShieldGrad)"
                stroke="#60A5FA"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />

              {/* Inner Shield Body */}
              <path
                d="M50 13 L79 26 C79 52 66 74 50 86 C34 74 21 52 21 26 L50 13 Z"
                fill="url(#splashCoreGrad)"
                stroke="#334155"
                strokeWidth="1.2"
              />

              {/* Subtle Top-Left Glass Sheen */}
              <path
                d="M50 13 L79 26 C79 40 70 58 50 65 C34 58 25 40 21 26 L50 13 Z"
                fill="url(#splashSheen)"
              />

              {/* Academic Laurel Crest Arc */}
              <path
                d="M32 46 C32 60 40 70 50 74 C60 70 68 60 68 46"
                stroke="url(#splashShieldGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeDasharray="2 3"
              />

              {/* Open Book Foundation */}
              <path
                d="M36 64 C42 61 46 62 50 65 C54 62 58 61 64 64 L64 67 C58 64 54 65 50 68 C46 65 42 64 36 67 Z"
                fill="url(#splashShieldGrad)"
                opacity="0.95"
              />

              {/* Central Monogram: S P H with high contrast */}
              <text
                x="50"
                y="47.5"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#F8FAFC"
                fontFamily="'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
                fontWeight="900"
                fontSize="18"
                letterSpacing="0.8"
                className="select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              >
                SPH
              </text>

              {/* Top Star Accent */}
              <polygon
                points="50,17 52.2,21.5 56.5,21.5 53,24 54.2,28.5 50,25.5 45.8,28.5 47,24 43.5,21.5 47.8,21.5"
                fill="url(#splashGoldGrad)"
                filter="drop-shadow(0 1px 3px rgba(245,158,11,0.5))"
              />
            </svg>
          </div>
        </motion.div>

        {/* Title: SILENT PREPARATION HUB */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-xl sm:text-2xl font-black tracking-[0.18em] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-display"
        >
          SILENT PREPARATION HUB
        </motion.h1>

        {/* Gold-accented Subtitle: SSC • Railway • Police • Defence */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="flex items-center justify-center gap-1.5 mt-2 flex-wrap"
        >
          <span className="text-xs sm:text-sm font-extrabold text-amber-400/95 tracking-wider">
            SSC
          </span>
          <span className="text-amber-500/60 text-xs">•</span>
          <span className="text-xs sm:text-sm font-extrabold text-amber-400/95 tracking-wider">
            Railway
          </span>
          <span className="text-amber-500/60 text-xs">•</span>
          <span className="text-xs sm:text-sm font-extrabold text-amber-400/95 tracking-wider">
            Police
          </span>
          <span className="text-amber-500/60 text-xs">•</span>
          <span className="text-xs sm:text-sm font-extrabold text-amber-400/95 tracking-wider">
            Defence
          </span>
        </motion.div>

        {/* Micro Loading Indicator: Thin Gradient Progress Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-48 sm:w-56 h-1 bg-slate-800/90 rounded-full overflow-hidden mt-6 border border-slate-700/50 shadow-inner"
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(16,185,129,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      </div>

      {/* Bottom Luxury Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
        className="z-10 px-6 text-center"
      >
        <p className="text-xs sm:text-sm font-medium text-slate-400 italic tracking-wide">
          &ldquo;Prepare in Silence, Let Your Success Make The Noise.&rdquo;
        </p>
      </motion.div>
    </div>
  );
};
