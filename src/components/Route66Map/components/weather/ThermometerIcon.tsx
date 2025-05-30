
import React from 'react';

const ThermometerIcon: React.FC = () => (
  <div className="group cursor-pointer relative">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-md"
    >
      <defs>
        <linearGradient id="thermometer-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="30%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      {/* Thermometer bulb */}
      <circle cx="12" cy="17" r="3" fill="url(#thermometer-gradient)" stroke="#dc2626" />
      {/* Thermometer tube */}
      <rect x="10" y="3" width="4" height="14" rx="2" fill="url(#thermometer-gradient)" stroke="#dc2626" />
      {/* Temperature marks */}
      <path d="M8 8h2M8 11h2M8 14h2" stroke="#dc2626" strokeWidth="1.5" />
    </svg>
  </div>
);

export default ThermometerIcon;
