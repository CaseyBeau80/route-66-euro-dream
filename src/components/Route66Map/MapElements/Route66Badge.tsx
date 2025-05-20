
import React from "react";

const Route66Badge = () => {
  return (
    <div className="bg-transparent">
      {/* US Highway Shield */}
      <div className="relative w-24 h-28">
        {/* Shield background with authentic US Highway shield shape */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          {/* Shield shape - improved path for more authentic highway shield */}
          <path 
            d="M50,2 
               L8,2 
               L8,30 
               C8,45 15,65 28,85
               C36,98 43,108 50,118
               C57,108 64,98 72,85
               C85,65 92,45 92,30
               L92,2 
               L50,2 Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="3"
          />
          
          {/* Red banner for "ROUTE" - adjusted position and size */}
          <rect 
            x="8" 
            y="2" 
            width="84" 
            height="20" 
            fill="#D92121" 
            stroke="black"
            strokeWidth="1"
          />
          
          {/* Horizontal dividing line below red banner */}
          <line 
            x1="8" 
            y1="22" 
            x2="92" 
            y2="22" 
            stroke="black" 
            strokeWidth="2"
          />
        </svg>
        
        {/* Shield content - improved text positioning */}
        <div className="absolute inset-0 flex flex-col items-center">
          {/* ROUTE text in red banner - properly centered */}
          <div className="text-white font-bold text-sm mt-1.5">ROUTE</div>
          
          {/* US text in middle section - proper position */}
          <div className="text-black font-bold text-lg mt-5">US</div>
          
          {/* 66 as the dominant focal point - larger and more prominent */}
          <div className="text-black text-6xl font-black mt-1.5 leading-none">66</div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
