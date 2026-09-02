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
    <div 
      className={`flex flex-col items-center justify-center select-none text-center ${compact ? 'p-3' : 'p-6 min-h-[200px]'}`}
      role="status"
      aria-label="Loading"
    >
      {/* 60fps/120fps Modern Glowing Petal / Flower Loader */}
      <div className="relative flex items-center justify-center will-change-transform mb-4">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600/25 via-emerald-500/20 to-transparent blur-lg animate-pulse" />

        {/* 12-Petal Orbital Flower - Emerald (#10B981) and Indigo (#2563EB) */}
        <div className="relative w-16 h-16 animate-spin-smooth">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const isEmerald = i % 2 === 0;
            const opacity = 0.2 + ((i + 1) / 12) * 0.8;
            return (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-2.5 h-6 rounded-full origin-[0%_100%]"
                style={{
                  transform: `rotate(${deg}deg) translate(-50%, -100%)`,
                  background: isEmerald
                    ? 'linear-gradient(180deg, #10B981, rgba(16, 185, 129, 0.2))'
                    : 'linear-gradient(180deg, #2563EB, rgba(37, 99, 235, 0.2))',
                  opacity,
                  boxShadow: isEmerald
                    ? '0 0 6px rgba(16, 185, 129, 0.45)'
                    : '0 0 6px rgba(37, 99, 235, 0.45)',
                }}
              />
            );
          })}
        </div>

        {/* Inner Counter Petal Ring */}
        <div className="absolute w-9 h-9 animate-spin-reverse-smooth">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div
              key={deg}
              className="absolute top-1/2 left-1/2 w-2 h-4 rounded-full origin-[0%_100%]"
              style={{
                transform: `rotate(${deg}deg) translate(-50%, -100%)`,
                background: i % 2 === 0 ? '#10B981' : '#2563EB',
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        {/* Center Radiant Core Bead */}
        <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(16,185,129,0.8)] border border-emerald-400 flex items-center justify-center z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 animate-ping" />
        </div>
      </div>

      {/* Main Status Text */}
      <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight leading-snug">
        {message}
      </h3>

      {/* Subtitle */}
      {subMessage && (
        <p className="text-[11px] font-semibold text-slate-500 mt-1 max-w-xs font-sans tracking-wide">
          {subMessage}
        </p>
      )}

      {/* Micro Linear Indicator */}
      <div className="w-28 h-0.5 bg-slate-200/80 rounded-full mt-3 overflow-hidden shadow-inner">
        <div className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 w-full animate-progress-indeterminate rounded-full" />
      </div>
    </div>
  );
};
