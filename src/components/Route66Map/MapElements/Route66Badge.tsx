
import React from "react";

const Route66Badge = () => {
  return (
    <div className="bg-transparent">
      {/* US Highway Shield */}
      <div className="relative w-24 h-28">
        {/* Shield background with authentic US Highway shield shape */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          {/* Main shield shape */}
          <path 
            d="M5,5 L95,5 L95,35 Q95,75 50,115 Q5,75 5,35 Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="4"
          />
          
          {/* Red banner at top */}
          <rect x="5" y="5" width="90" height="22" fill="#D92121" />
        </svg>
        
        {/* Shield content */}
        <div className="absolute inset-0 flex flex-col items-center">
          {/* ROUTE text in the red banner */}
          <div className="text-white font-bold text-sm mt-[8px]">ROUTE</div>
          
          {/* U.S. text */}
          <div className="text-xs font-bold mt-7">U.S.</div>
          
          {/* 66 as the focal point */}
          <div className="text-5xl font-black mt-0">66</div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
