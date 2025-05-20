
import React from "react";
import { Route } from "lucide-react";

const Route66Badge = () => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      {/* Shield shape with black border */}
      <div className="relative w-20 h-24">
        {/* Shield background */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          <path 
            d="M50,0 L95,0 C95,0 100,40 50,120 C0,40 5,0 5,0 L50,0 Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="6"
          />
        </svg>
        
        {/* Shield content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
          <div className="text-sm font-black mt-1">ROUTE</div>
          <div className="text-xs font-bold mb-0">U S</div>
          <div className="text-3xl font-black leading-none">66</div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
