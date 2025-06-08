
import React from 'react';

interface DesertCactusSVGProps {
  stage: number;
  size?: number;
  className?: string;
}

const DesertCactusSVG: React.FC<DesertCactusSVGProps> = ({ 
  stage, 
  size = 40, 
  className = "" 
}) => {
  const getStageColor = (stage: number) => {
    const colors = [
      '#92400e', // brown seed
      '#16a34a', // green sprout
      '#ea580c', // orange barrel
      '#dc2626', // red cholla
      '#ec4899', // pink prickly pear
      '#f59e0b'  // amber saguaro
    ];
    return colors[Math.min(stage, colors.length - 1)];
  };

  const getSVGContent = (stage: number) => {
    const color = getStageColor(stage);
    
    switch (stage) {
      case 0: // Seedling
        return (
          <g>
            <ellipse cx="20" cy="35" rx="15" ry="3" fill="#d97706" opacity="0.3"/>
            <circle cx="20" cy="32" r="2" fill={color}/>
            <path d="M18 30 Q20 28 22 30" stroke="#16a34a" strokeWidth="1" fill="none"/>
          </g>
        );
      
      case 1: // Sprout
        return (
          <g>
            <ellipse cx="20" cy="35" rx="15" ry="3" fill="#d97706" opacity="0.3"/>
            <rect x="19" y="28" width="2" height="7" fill={color} rx="1"/>
            <path d="M17 26 Q19 24 21 26 Q23 24 25 26" stroke={color} strokeWidth="1.5" fill="none"/>
          </g>
        );
      
      case 2: // Barrel
        return (
          <g>
            <ellipse cx="20" cy="35" rx="15" ry="3" fill="#d97706" opacity="0.3"/>
            <ellipse cx="20" cy="25" rx="6" ry="10" fill={color}/>
            <path d="M14 20 Q20 18 26 20" stroke="#fbbf24" strokeWidth="1" fill="none"/>
            <path d="M14 30 Q20 28 26 30" stroke="#fbbf24" strokeWidth="1" fill="none"/>
            <circle cx="20" cy="20" r="1" fill="#fbbf24"/>
          </g>
        );
      
      case 3: // Cholla
        return (
          <g>
            <ellipse cx="20" cy="35" rx="15" ry="3" fill="#d97706" opacity="0.3"/>
            <rect x="18" y="15" width="4" height="20" fill={color} rx="2"/>
            <rect x="16" y="20" width="3" height="8" fill={color} rx="1.5"/>
            <rect x="21" y="18" width="3" height="6" fill={color} rx="1.5"/>
            <circle cx="20" cy="15" r="2" fill="#fbbf24"/>
            {[...Array(8)].map((_, i) => (
              <line key={i} x1="18" y1={18 + i * 2} x2="16" y2={18 + i * 2} stroke="#fbbf24" strokeWidth="0.5"/>
            ))}
          </g>
        );
      
      case 4: // Prickly Pear
        return (
          <g>
            <ellipse cx="20" cy="35" rx="15" ry="3" fill="#d97706" opacity="0.3"/>
            <ellipse cx="20" cy="28" rx="5" ry="7" fill={color}/>
            <ellipse cx="16" cy="24" rx="4" ry="5" fill={color}/>
            <ellipse cx="24" cy="26" rx="3" ry="4" fill={color}/>
            <circle cx="16" cy="20" r="2" fill="#ec4899"/>
            <circle cx="24" cy="22" r="1.5" fill="#f97316"/>
            <circle cx="20" cy="23" r="1.5" fill="#eab308"/>
            {[...Array(12)].map((_, i) => (
              <circle key={i} cx={15 + (i % 4) * 2.5} cy={23 + Math.floor(i / 4) * 3} r="0.3" fill="#fbbf24"/>
            ))}
          </g>
        );
      
      case 5: // Saguaro
        return (
          <g>
            <ellipse cx="20" cy="35" rx="15" ry="3" fill="#d97706" opacity="0.3"/>
            <rect x="18" y="8" width="4" height="27" fill={color} rx="2"/>
            <rect x="13" y="15" width="3" height="12" fill={color} rx="1.5"/>
            <rect x="24" y="12" width="3" height="15" fill={color} rx="1.5"/>
            <circle cx="20" cy="8" r="2" fill="#fff"/>
            <circle cx="15" cy="15" r="1.5" fill="#fff"/>
            <circle cx="25" cy="12" r="1.5" fill="#fff"/>
            {[...Array(15)].map((_, i) => (
              <line key={i} x1="18" y1={10 + i * 1.5} x2="22" y2={10 + i * 1.5} stroke="#16a34a" strokeWidth="0.3" opacity="0.6"/>
            ))}
          </g>
        );
      
      default:
        return getSVGContent(0);
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      className={className}
      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}
    >
      {getSVGContent(stage)}
    </svg>
  );
};

export default DesertCactusSVG;
