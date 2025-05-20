
import React from "react";

const Route66Badge = () => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      {/* US Highway Shield */}
      <div className="relative w-24 h-28">
        {/* Shield background with proper US Highway shield shape */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          <path 
            d="M50,2 L95,2 L95,25 C95,75 70,105 50,118 C30,105 5,75 5,25 L5,2 L50,2 Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="4"
          />
        </svg>
        
        {/* Red top banner with proper width */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          <path 
            d="M5,2 L95,2 L95,20 L5,20 Z" 
            fill="#D92121"
          />
        </svg>
        
        {/* Shield content with better positioning and sizing */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* ROUTE text properly positioned in red banner */}
          <div className="text-sm font-bold text-white absolute top-[6px]">ROUTE</div>
          
          {/* US text positioned below the banner */}
          <div className="text-[10px] font-bold mt-5">U.S.</div>
          
          {/* Larger 66 as the focal point */}
          <div className="text-5xl font-black leading-none mt-0.5">66</div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
