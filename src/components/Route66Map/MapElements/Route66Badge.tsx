
import React from "react";
import { Shield } from "lucide-react";

const Route66Badge = () => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      {/* Shield shape with black border */}
      <div className="relative w-20 h-24">
        {/* Shield background */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          <path 
            d="M50,2 L95,2 L95,30 C95,70 75,100 50,118 C25,100 5,70 5,30 L5,2 L50,2 Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="5"
          />
        </svg>
        
        {/* Red top banner */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          <path 
            d="M5,2 L95,2 L95,15 L5,15 Z" 
            fill="#D92121"
          />
        </svg>
        
        {/* Shield content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
          <div className="text-sm font-bold text-white mt-[-2px]">ROUTE</div>
          <div className="text-xs font-bold mt-3">U.S.</div>
          <div className="text-4xl font-black leading-none mt-1">66</div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
