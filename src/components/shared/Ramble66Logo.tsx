import React from 'react';

interface Ramble66LogoProps {
  className?: string;
  alt?: string;
  variant?: 'light' | 'dark'; // light variant for dark backgrounds, dark variant for light backgrounds
}

const Ramble66Logo: React.FC<Ramble66LogoProps> = ({
  className = 'w-10 h-10',
  alt = 'Ramble 66 Logo',
  variant = 'light'
}) => {
  const numberFill = variant === 'light' ? '#FFFFFF' : '#1B60A3'; // White for dark backgrounds, blue for light backgrounds
  const shieldFill = '#1B60A3'; // Always blue shield
  const textFill = variant === 'light' ? '#FFFFFF' : '#1B60A3';

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
    >
      {/* Route 66 Shield Background */}
      <path
        d="M50 5 L85 20 L85 50 L85 80 L50 95 L15 80 L15 50 L15 20 Z"
        fill={shieldFill}
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      
      {/* First "6" */}
      <text
        x="32"
        y="60"
        fontSize="36"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        fill={numberFill}
        textAnchor="middle"
      >
        6
      </text>
      
      {/* Second "6" */}
      <text
        x="68"
        y="60"
        fontSize="36"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        fill={numberFill}
        textAnchor="middle"
      >
        6
      </text>
      
      {/* "ROUTE" text above */}
      <text
        x="50"
        y="25"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        fill={textFill}
        textAnchor="middle"
      >
        ROUTE
      </text>
    </svg>
  );
};

export default Ramble66Logo;