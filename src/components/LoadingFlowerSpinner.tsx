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
      className={`flex flex-col items-center justify-center select-none text-center ${compact ? 'p-2' : 'p-6 min-h-[190px]'}`}
      role="status"
      aria-label="Loading"
    >
      {/* Exquisite Dynamic Blooming Lotus (Non-irritating, organic breathing motion) */}
      <div className="relative flex items-center justify-center will-change-transform mb-4">
        
        {/* Soft Multi-color Ambient Radial Aura */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600/20 via-emerald-500/25 to-amber-500/15 blur-xl animate-flower-aura pointer-events-none" />

        {/* Master Breathing Flower Container */}
        <div className={`relative ${compact ? 'w-16 h-16' : 'w-20 h-20'} animate-flower-breathe flex items-center justify-center`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_8px_20px_rgba(16,185,129,0.35)]"
          >
            <defs>
              {/* Outer Petal Gradient - Royal Emerald to Deep Cyan Sapphire */}
              <linearGradient id="sphOuterPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>

              {/* Inner Petal Gradient - Luminous Emerald into Warm Radiant Amber */}
              <linearGradient id="sphInnerPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="45%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Petal Glass Spine Sheen */}
              <linearGradient id="sphPetalSpine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.15" />
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

            {/* 1. Outer Tier: 8 Sculpted Blooming Lotus Petals with dynamic breathing wave */}
            <g className="animate-flower-petal origin-center">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                <g key={`outer-${angle}`} transform={`rotate(${angle} 50 50)`}>
                  {/* Petal Silhouette */}
                  <path
                    d="M 50 8 C 42 22 41 38 50 50 C 59 38 58 22 50 8 Z"
                    fill="url(#sphOuterPetalGrad)"
                    opacity={idx % 2 === 0 ? 0.95 : 0.85}
                    stroke="#A7F3D0"
                    strokeWidth="0.6"
                  />
                  {/* Subtle Translucent Petal Spine */}
                  <path
                    d="M 50 10 L 50 46"
                    stroke="url(#sphPetalSpine)"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </g>

            {/* 2. Inner Tier: 8 Graceful Nested Lotus Petals (Offset by 22.5 deg) */}
            <g className="animate-flower-inner origin-center">
              {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
                <g key={`inner-${angle}`} transform={`rotate(${angle} 50 50)`}>
                  <path
                    d="M 50 20 C 44 32 44 42 50 50 C 56 42 56 32 50 20 Z"
                    fill="url(#sphInnerPetalGrad)"
                    opacity="0.92"
                    stroke="#FDE68A"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 50 22 L 50 44"
                    stroke="#FFFFFF"
                    strokeOpacity="0.6"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </g>

            {/* 3. Radiant Stamen Ring: Golden Pollen Filament Beads */}
            <g className="animate-flower-stamen origin-center">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 50 + 13 * Math.sin(rad);
                const cy = 50 - 13 * Math.cos(rad);
                return (
                  <circle
                    key={`pollen-${angle}`}
                    cx={cx}
                    cy={cy}
                    r="1.8"
                    fill="#FBBF24"
                    stroke="#F59E0B"
                    strokeWidth="0.4"
                  />
                );
              })}
            </g>

            {/* 4. Center Luminescent Pearl Core with Diamond Radiance */}
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="url(#sphCorePearl)"
              stroke="#ECFDF5"
              strokeWidth="1.2"
              className="drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]"
            />
            {/* Core Center Gleam */}
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

      {/* Status Message */}
      <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight leading-snug">
        {message}
      </h3>

      {/* Subtitle */}
      {subMessage && (
        <p className="text-[11px] font-semibold text-slate-500 mt-1 max-w-xs font-sans tracking-wide">
          {subMessage}
        </p>
      )}

      {/* Micro Linear Pulse Indicator */}
      <div className="w-24 h-0.5 bg-slate-200/80 rounded-full mt-3 overflow-hidden shadow-inner">
        <div className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 w-full animate-progress-indeterminate rounded-full" />
      </div>
    </div>
  );
};
