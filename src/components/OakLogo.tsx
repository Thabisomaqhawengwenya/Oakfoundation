import React from 'react';

export const OakLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 320 80"
        className={`${sizeClasses[size]} w-auto`}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 'O' with stylized Globe */}
        <g transform="translate(10, 5)">
          <circle cx="28" cy="28" r="26" fill="none" stroke="#163866" strokeWidth="6" />
          {/* Globe landmass shapes */}
          <path
            d="M20 12 C24 16, 26 22, 22 28 C18 34, 14 36, 17 44 C19 47, 24 50, 27 52 C21 51, 14 45, 10 37 C6 29, 9 20, 16 13 Z"
            fill="#9cb4d8"
            opacity="0.85"
          />
          <path
            d="M32 10 C36 14, 42 16, 45 22 C48 29, 43 35, 41 42 C46 38, 49 31, 49 24 C49 17, 44 11, 36 8 Z"
            fill="#9cb4d8"
            opacity="0.85"
          />
          <path
            d="M27 20 C31 23, 34 29, 31 34 C28 39, 23 41, 26 47 C29 42, 36 38, 38 31 C38 24, 34 19, 27 20 Z"
            fill="#9cb4d8"
            opacity="0.9"
          />
        </g>

        {/* 'A' */}
        <text
          x="78"
          y="56"
          fontFamily="'Cinzel', 'Times New Roman', serif"
          fontSize="56"
          fontWeight="400"
          fill="#163866"
          letterSpacing="2"
        >
          A
        </text>

        {/* 'K' */}
        <text
          x="126"
          y="56"
          fontFamily="'Cinzel', 'Times New Roman', serif"
          fontSize="56"
          fontWeight="400"
          fill="#163866"
          letterSpacing="2"
        >
          K
        </text>

        {/* 'FOUNDATION' */}
        <text
          x="10"
          y="74"
          fontFamily="'Cinzel', 'Times New Roman', serif"
          fontSize="17"
          fontWeight="400"
          fill="#163866"
          letterSpacing="8"
        >
          FOUNDATION
        </text>
      </svg>
    </div>
  );
};
