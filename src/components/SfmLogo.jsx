import React from 'react';

/**
 * Spartans Facility Management Exact Logo Component
 * Presentation Style: Shield with Spartan crest + Navy & Red typography + Tagline
 */
export default function SfmLogo({ size = 'md', showTagline = true, lightMode = true }) {
  const sizes = {
    xs: {
      shield: 'w-7 h-8',
      spartans: 'text-sm',
      fm: 'text-[9px] tracking-[0.25em]',
      tagline: 'text-[7px]'
    },
    sm: {
      shield: 'w-8 h-9',
      spartans: 'text-base',
      fm: 'text-[10px] tracking-[0.3em]',
      tagline: 'text-[8px]'
    },
    md: {
      shield: 'w-11 h-12',
      spartans: 'text-xl',
      fm: 'text-xs tracking-[0.35em]',
      tagline: 'text-[9px]'
    },
    lg: {
      shield: 'w-14 h-16',
      spartans: 'text-2xl sm:text-3xl',
      fm: 'text-sm sm:text-base tracking-[0.35em]',
      tagline: 'text-[10px] sm:text-xs'
    }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none">
      {/* Exact Spartan Crest Shield */}
      <div className={`relative ${currentSize.shield} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Base */}
          <path
            d="M50 5 L90 20 V65 C90 92 50 115 50 115 C50 115 10 92 10 65 V20 L50 5 Z"
            fill="url(#adminShieldGrad)"
            stroke="#c1121f"
            strokeWidth="4"
          />
          {/* Inner Accent Line */}
          <path
            d="M50 12 L82 24 V63 C82 85 50 105 50 105 C50 105 18 85 18 63 V24 L50 12 Z"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Spartan Helmet Silhouette */}
          <path
            d="M50 25 C41 25 34 32 34 42 V58 C34 68 42 75 50 75 C58 75 66 68 66 58 V42 C66 32 59 25 50 25 Z"
            fill="#ffffff"
          />
          {/* Helmet T-slit visor */}
          <path
            d="M48 38 H52 V54 H58 V58 H42 V54 H48 V38 Z"
            fill="#0b1d3a"
          />
          {/* Helmet Crest Plume (Signature Red) */}
          <path
            d="M50 16 C46 16 44 21 44 26 C48 24 52 24 56 26 C56 21 54 16 50 16 Z"
            fill="#c1121f"
          />
          <defs>
            <linearGradient id="adminShieldGrad" x1="10" y1="5" x2="90" y2="115" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0b1d3a" />
              <stop offset="1" stopColor="#1a365d" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-black font-heading ${currentSize.spartans} ${
              lightMode ? 'text-[#0b1d3a]' : 'text-white'
            } tracking-tight`}
          >
            SPARTANS
          </span>
        </div>
        
        <span
          className={`font-bold uppercase ${currentSize.fm} text-[#c1121f] mt-0.5`}
        >
          FACILITY MANAGEMENT
        </span>

        {showTagline && (
          <span
            className={`italic font-medium ${currentSize.tagline} text-slate-500 mt-1 tracking-normal`}
          >
            Seamless Facilities, Superior Service.
          </span>
        )}
      </div>
    </div>
  );
}
