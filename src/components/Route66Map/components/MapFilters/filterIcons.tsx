import React from 'react';

// Route 66 Shield icon for Major Cities
export const CitiesIcon = () => (
  <svg width="20" height="24" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L4 2 L4 8 C4 10 5 12 7 13.5 C9 14.5 10.5 15 12 15 C13.5 15 15 14.5 17 13.5 C19 12 20 10 20 8 L20 2 L12 2 Z" 
          fill="url(#shared-route66Shield)" 
          stroke="#000000" 
          strokeWidth="1"/>
    <text x="12" y="6" textAnchor="middle" fill="#000000" fontSize="2" fontWeight="bold">ROUTE</text>
    <text x="12" y="11" textAnchor="middle" fill="#000000" fontSize="6" fontWeight="900">66</text>
  </svg>
);

// Red pin for Attractions
export const AttractionsIcon = () => (
  <svg width="18" height="22" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="filterPinGradient" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" style={{stopColor:'#ff4444', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#cc2222', stopOpacity:1}} />
      </linearGradient>
    </defs>
    <path d="M10,22 C4,16 4,10 10,10 C16,10 16,16 10,22 Z" fill="url(#filterPinGradient)" stroke="#ffffff" strokeWidth="1"/>
    <circle cx="10" cy="13" r="3" fill="#ffffff" stroke="#cc2222" strokeWidth="1"/>
    <circle cx="10" cy="13" r="1.5" fill="#ff4444"/>
  </svg>
);

// Diamond for Hidden Gems
export const HiddenGemsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="filterGemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#40E0D0', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#008B8B', stopOpacity:1}} />
      </linearGradient>
    </defs>
    <polygon points="11,2 6,2 6,7 4,11 6,20 11,20 16,20 18,11 16,7 16,2" 
             fill="url(#filterGemGradient)" 
             stroke="#ffffff" 
             strokeWidth="1"/>
    <polygon points="11,2 8,7 11,11 14,7" fill="#B0E0E6" opacity="0.7"/>
  </svg>
);

// Classic car for Drive-Ins
export const DriveInsIcon = () => (
  <svg width="22" height="14" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="filterCarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#ff4444', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#cc2222', stopOpacity:1}} />
      </linearGradient>
    </defs>
    <path d="M3 12 L3 10 C3 9 4 8 5 8 L6 8 C6.5 7 7.5 6 9 6 L15 6 C16.5 6 17.5 7 18 8 L19 8 C20 8 21 9 21 10 L21 12 L20 12 L20 13 C20 13.5 19.5 14 19 14 L18 14 C17.5 14 17 13.5 17 13 L17 12 L7 12 L7 13 C7 13.5 6.5 14 6 14 L5 14 C4.5 14 4 13.5 4 13 L4 12 L3 12 Z" 
          fill="url(#filterCarGradient)" 
          stroke="#ffffff" 
          strokeWidth="0.8"/>
    <circle cx="6.5" cy="12.5" r="2" fill="#333" stroke="#333" strokeWidth="0.5"/>
    <circle cx="6.5" cy="12.5" r="0.8" fill="#ffffff"/>
    <circle cx="17.5" cy="12.5" r="2" fill="#333" stroke="#333" strokeWidth="0.5"/>
    <circle cx="17.5" cy="12.5" r="0.8" fill="#ffffff"/>
  </svg>
);

// Feather for Native American Heritage
export const NativeAmericanIcon = () => (
  <svg width="18" height="20" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="filterFeatherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#CD5C5C', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#8B4513', stopOpacity:1}} />
      </linearGradient>
    </defs>
    <path d="M10,2 C8,6 6,10 5,16 L10,13 L15,16 C14,10 12,6 10,2 Z" 
          fill="url(#filterFeatherGradient)" 
          stroke="#40E0D0" 
          strokeWidth="1.5"/>
    <line x1="10" y1="4" x2="10" y2="14" 
          stroke="#D2B48C" 
          strokeWidth="1.5" 
          strokeLinecap="round"/>
    <circle cx="10" cy="6" r="1.5" fill="#40E0D0" stroke="#fff" strokeWidth="0.5"/>
  </svg>
);
