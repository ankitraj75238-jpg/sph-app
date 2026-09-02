import React from 'react';

interface SphLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'shield' | 'minimal' | 'full';
}

export const SphLogo: React.FC<SphLogoProps> = ({
  className = '',
  size = 38,
  showText = false,
  variant = 'shield',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Clean Stylized SPH Academic Shield SVG Emblem in Royal Blue and Emerald */}
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(37,99,235,0.18)]"
        >
          <defs>
            {/* Outer Ring & Shield Gradient: Royal Blue to Vibrant Emerald */}
            <linearGradient id="sphShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Accent Gold/Amber Gradient */}
            <linearGradient id="sphGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Core Clean White Gradient */}
            <linearGradient id="sphCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>

            {/* Soft Radial Ambient Glow */}
            <radialGradient id="sphGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="50" cy="50" r="46" fill="url(#sphGlow)" />

          {/* Outer Shield Border */}
          <path
            d="M50 8 L84 22 C84 54 69 78 50 92 C31 78 16 54 16 22 L50 8 Z"
            fill="url(#sphShieldGrad)"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Inner Shield Body */}
          <path
            d="M50 14 L78 26 C78 52 65 73 50 85 C35 73 22 52 22 26 L50 14 Z"
            fill="url(#sphCoreGrad)"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />

          {/* Academic Laurel / Crest Arc */}
          <path
            d="M32 46 C32 60 40 70 50 74 C60 70 68 60 68 46"
            stroke="url(#sphShieldGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />

          {/* Open Book Foundation */}
          <path
            d="M36 64 C42 61 46 62 50 65 C54 62 58 61 64 64 L64 67 C58 64 54 65 50 68 C46 65 42 64 36 67 Z"
            fill="url(#sphShieldGrad)"
            opacity="0.95"
          />

          {/* Central Monogram: S P H */}
          <text
            x="50"
            y="48"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#0F172A"
            fontFamily="'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="0.6"
            className="select-none"
          >
            SPH
          </text>

          {/* Top Star Accent */}
          <polygon
            points="50,18 52,22 56,22 53,24 54,28 50,25 46,28 47,24 44,22 48,22"
            fill="url(#sphGoldGrad)"
          />
        </svg>
      </div>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black text-slate-900 text-base tracking-tight">SILENT PREP</span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              HUB
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-0.5">
            ANKIT • PAREEKSHA • BOOKS
          </span>
        </div>
      )}
    </div>
  );
};

