
import React from "react";

const Route66Badge = () => {
  return (
    <div className="bg-transparent">
      {/* US Highway Shield */}
      <div className="relative w-24 h-28">
        {/* Shield background with authentic US Highway shield shape */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          {/* Shield shape */}
          <path 
            d="M50,5 
               L5,5 
               L5,35 
               C5,50 12,70 25,85
               C34,95 43,105 50,115
               C57,105 66,95 75,85
               C88,70 95,50 95,35
               L95,5 
               L50,5 Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="4"
          />
          
          {/* Red banner for "ROUTE" */}
          <rect 
            x="5" 
            y="5" 
            width="90" 
            height="22" 
            fill="#D92121" 
          />
          
          {/* Horizontal dividing line below red banner */}
          <line 
            x1="5" 
            y1="27" 
            x2="95" 
            y2="27" 
            stroke="black" 
            strokeWidth="2"
          />
        </svg>
        
        {/* Shield content */}
        <div className="absolute inset-0 flex flex-col items-center">
          {/* ROUTE text in red banner */}
          <div className="text-white font-bold text-xl mt-2">ROUTE</div>
          
          {/* US text in middle section */}
          <div className="text-black font-bold text-xl mt-7">US</div>
          
          {/* 66 as the focal point in lower section */}
          <div className="text-6xl font-black mt-2">66</div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
