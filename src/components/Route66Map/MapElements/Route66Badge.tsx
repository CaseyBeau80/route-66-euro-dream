
import React from "react";

const Route66Badge = () => {
  return (
    <div className="bg-transparent">
      {/* Authentic US Highway 66 Shield matching the vintage image */}
      <div className="relative w-24 h-28">
        {/* Shield background with authentic US Highway shield shape */}
        <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full">
          {/* Main shield shape - matching the classic US Highway shield profile */}
          <path 
            d="M50,2 
               L8,2 
               L8,35 
               C8,50 15,70 28,90
               C36,103 43,113 50,118
               C57,113 64,103 72,90
               C85,70 92,50 92,35
               L92,2 
               L50,2 Z" 
            fill="#F5F5DC" 
            stroke="#000000" 
            strokeWidth="3"
          />
          
          {/* Inner shield border for depth */}
          <path 
            d="M50,5 
               L12,5 
               L12,32 
               C12,46 18,64 29,82
               C36,94 42,103 50,107
               C58,103 64,94 71,82
               C82,64 88,46 88,32
               L88,5 
               L50,5 Z" 
            fill="none" 
            stroke="#000000" 
            strokeWidth="1"
          />
        </svg>
        
        {/* Shield content - authentic layout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* ROUTE text at top */}
          <div className="text-black font-bold text-lg mt-1" 
               style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }}>
            ROUTE
          </div>
          
          {/* Large 66 numbers - dominant feature */}
          <div className="text-black text-6xl font-black mt-1 leading-none" 
               style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
            66
          </div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
