import React from 'react';

interface LoadingFlowerSpinnerProps {
  message?: string;
  subMessage?: string;
  compact?: boolean;
  darkTheme?: boolean;
}

export const LoadingFlowerSpinner: React.FC<LoadingFlowerSpinnerProps> = ({
  message = 'तैयारी शुरू हो रही है...',
  subMessage = 'Silent Preparation Hub • High-Speed Study Engine',
  compact = false,
  darkTheme = true,
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center select-none text-center hw-accelerate ${
        compact ? 'p-2' : 'p-6 min-h-[190px]'
      }`}
      role="status"
      aria-label="Loading"
    >
      {/* Centered Continuous Rotating Glowing Flower / Petal Spinner */}
      <div className="relative flex items-center justify-center will-change-transform mb-4">
        
        {/* Soft Radial Ambient Glowing Aura (Emerald + Cyan + Amber) */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500/25 via-cyan-500/20 to-amber-500/20 blur-xl animate-pulse pointer-events-none" />

        {/* Master Rotating Flower / Petal Assembly */}
        <div className={`relative ${compact ? 'w-16 h-16' : 'w-20 h-20'} flex items-center justify-center`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_18px_rgba(16,185,129,0.5)]"
          >
            <defs>
              {/* Outer Petal Gradient - Royal Emerald to Vibrant Cyan */}
              <linearGradient id="sphOuterPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>

              {/* Inner Petal Gradient - Luminous Emerald into Warm Radiant Amber/Gold */}
              <linearGradient id="sphInnerPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="45%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Glowing Spine Sheen for High Specular Refraction */}
              <linearGradient id="sphPetalSpine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#A7F3D0" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* Core Pearl Radial Glow */}
              <radialGradient id="sphCorePearl" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#6EE7B7" />
                <stop offset="85%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </radialGradient>
            </defs>

            {/* 1. Outer Tier: 12 Sculpted Glowing Petals with Continuous Smooth Clockwise Rotation */}
            <g className="animate-spin-continuous origin-center">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
                <g key={`outer-${angle}`} transform={`rotate(${angle} 50 50)`}>
                  {/* Petal Silhouette */}
                  <path
                    d="M 50 8 C 43 20 42 36 50 50 C 58 36 57 20 50 8 Z"
                    fill="url(#sphOuterPetalGrad)"
                    opacity={idx % 2 === 0 ? 0.95 : 0.85}
                    stroke="#A7F3D0"
                    strokeWidth="0.5"
                  />
                  {/* Glowing Specular Center Spine */}
                  <path
                    d="M 50 10 L 50 46"
                    stroke="url(#sphPetalSpine)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </g>

            {/* 2. Inner Tier: 8 Nested Emerald & Golden Petals with Continuous Counter-Clockwise Rotation */}
            <g className="animate-spin-reverse-continuous origin-center">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <g key={`inner-${angle}`} transform={`rotate(${angle} 50 50)`}>
                  <path
                    d="M 50 20 C 44 31 44 42 50 50 C 56 42 56 31 50 20 Z"
                    fill="url(#sphInnerPetalGrad)"
                    opacity="0.95"
                    stroke="#FDE68A"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M 50 22 L 50 44"
                    stroke="#FFFFFF"
                    strokeOpacity="0.75"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                </g>
              ))}

              {/* Radiant Stamen: Golden Pollen Filament Beads */}
              {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 50 + 13.5 * Math.sin(rad);
                const cy = 50 - 13.5 * Math.cos(rad);
                return (
                  <circle
                    key={`pollen-${angle}`}
                    cx={cx}
                    cy={cy}
                    r="1.8"
                    fill="#FBBF24"
                    stroke="#F59E0B"
                    strokeWidth="0.4"
                    className="drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]"
                  />
                );
              })}
            </g>

            {/* 3. Center Luminescent Pearl Core with Diamond Radiance */}
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="url(#sphCorePearl)"
              stroke="#ECFDF5"
              strokeWidth="1.2"
              className="drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]"
            />
            {/* Specular Gleam Highlight */}
            <circle
              cx="48.5"
              cy="48.5"
              r="2.2"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* Main Status Message */}
      <h3 className={`text-sm sm:text-base font-extrabold tracking-tight leading-snug ${
        darkTheme ? 'text-white' : 'text-slate-800'
      }`}>
        {message}
      </h3>

      {/* Subtitle / Engine Detail */}
      {subMessage && (
        <p className={`text-[11px] font-semibold mt-1 max-w-xs font-sans tracking-wide ${
          darkTheme ? 'text-emerald-400/90' : 'text-slate-500'
        }`}>
          {subMessage}
        </p>
      )}

      {/* Micro Linear Glowing Progress Indicator */}
      <div className={`w-24 h-1 rounded-full mt-3 overflow-hidden shadow-inner ${
        darkTheme ? 'bg-slate-800/90 border border-slate-700/60' : 'bg-slate-200/80'
      }`}>
        <div className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 w-full animate-progress-indeterminate rounded-full" />
      </div>
    </div>
  );
};
