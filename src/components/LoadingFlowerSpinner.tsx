import React from 'react';

interface LoadingFlowerSpinnerProps {
  message?: string;
  subMessage?: string;
  compact?: boolean;
}

export const LoadingFlowerSpinner: React.FC<LoadingFlowerSpinnerProps> = ({
  message = 'तैयारी शुरू हो रही है...',
  subMessage = 'Silent Preparation Hub • High-Speed Study Engine',
  compact = false,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none text-center ${compact ? 'p-4' : 'p-8 min-h-[220px]'}`}>
      {/* 60fps/120fps Hardware-Accelerated Glowing Floral / Orbital Spinner */}
      <div className="relative flex items-center justify-center will-change-transform mb-5">
        {/* Outer Glow Halo */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500/20 via-emerald-500/15 to-transparent blur-xl animate-pulse" />

        {/* Outer Rotating Floral Petals Ring */}
        <div className="relative w-20 h-20 animate-spin-smooth">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <div
              key={deg}
              className="absolute top-1/2 left-1/2 w-3.5 h-7 rounded-full origin-[0%_100%] transition-transform duration-300"
              style={{
                transform: `rotate(${deg}deg) translate(-50%, -100%)`,
                background: i % 2 === 0 
                  ? 'linear-gradient(to top, rgba(37, 99, 235, 0.9), rgba(59, 130, 246, 0.4))'
                  : 'linear-gradient(to top, rgba(16, 185, 129, 0.9), rgba(52, 211, 153, 0.4))',
                opacity: (i + 1) / 12 * 0.9 + 0.1,
                boxShadow: i % 2 === 0 ? '0 0 8px rgba(37,99,235,0.4)' : '0 0 8px rgba(16,185,129,0.4)',
              }}
            />
          ))}
        </div>

        {/* Middle Counter-Rotating Petal Ring */}
        <div className="absolute w-12 h-12 animate-spin-reverse-smooth">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div
              key={deg}
              className="absolute top-1/2 left-1/2 w-2.5 h-5 rounded-full origin-[0%_100%]"
              style={{
                transform: `rotate(${deg}deg) translate(-50%, -100%)`,
                background: i % 2 === 0 
                  ? 'linear-gradient(to top, #2563EB, #60A5FA)'
                  : 'linear-gradient(to top, #10B981, #34D399)',
                opacity: 0.85,
              }}
            />
          ))}
        </div>

        {/* Center Glowing Core Orb */}
        <div className="absolute w-6 h-6 rounded-full bg-white shadow-[0_0_12px_rgba(37,99,235,0.6)] border-2 border-blue-500 flex items-center justify-center z-10 animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500" />
        </div>
      </div>

      {/* Main Hindi Motivational Status Text */}
      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
        {message}
      </h3>

      {/* Subtitle */}
      {subMessage && (
        <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs font-sans tracking-wide">
          {subMessage}
        </p>
      )}

      {/* Edge Linear Glow Bar */}
      <div className="w-36 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden shadow-inner">
        <div className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 w-full animate-progress-indeterminate rounded-full" />
      </div>
    </div>
  );
};
