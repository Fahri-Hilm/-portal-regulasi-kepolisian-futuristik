import React from 'react';

interface LogoProps {
  className?: string;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-12 h-12', glow = true }) => {
  return (
    <div className={`relative select-none ${className}`}>
      {/* Outer Glow Backing */}
      {glow && (
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full scale-110 pointer-events-none" />
      )}
      
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] filter transition-all duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Cyan Metallic Gradient */}
          <linearGradient id="cyber-gradient-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="40%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#083344" />
          </linearGradient>

          <linearGradient id="cyber-gradient-mid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#155e75" />
          </linearGradient>

          {/* 3D Bevel Shadow Effect */}
          <filter id="bevel-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="3" stdDeviation="1.5" floodColor="#042f2e" floodOpacity="0.8" />
            <feDropShadow dx="-1" dy="-1" stdDeviation="0.5" floodColor="#ecfeff" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Ambient shadow clone */}
        <g opacity="0.3" transform="translate(-4, -4)">
          <path
            d="M 10 75 L 34 22 L 90 22 L 80 37 H 44 L 23 75 Z"
            fill="#0891b2"
            filter="blur(4px)"
          />
          <path
            d="M 29 88 L 49 46 L 76 46 L 70 56 H 55 L 40 88 Z"
            fill="#0e7490"
            filter="blur(4px)"
          />
        </g>

        {/* Top/Main Chevron */}
        <path
          d="M 12 75 L 36 22 L 92 22 L 82 37 H 44 L 24 75 Z"
          fill="url(#cyber-gradient-top)"
          stroke="#22d3ee"
          strokeWidth="0.75"
          filter="url(#bevel-shadow)"
        />

        {/* Lower/Nested Chevron */}
        <path
          d="M 29 88 L 49 46 L 76 46 L 68 57 H 53 L 39 88 Z"
          fill="url(#cyber-gradient-mid)"
          stroke="#22d3ee"
          strokeWidth="0.75"
          filter="url(#bevel-shadow)"
        />

        {/* Inner Highlight Accents */}
        <path
          d="M 37 24 L 88 24 L 83 32 H 45"
          stroke="#ecfeff"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 15 72 L 35 25"
          stroke="#ecfeff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};
