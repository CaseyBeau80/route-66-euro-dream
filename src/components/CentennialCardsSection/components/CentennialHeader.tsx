
import React from 'react';
import { Gift, PartyPopper, Sparkles } from 'lucide-react';

const CentennialHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      {/* Birthday Badge with connecting effect */}
      <div className="relative inline-block mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg animate-nostalgic-glow">
          <Gift className="h-5 w-5 animate-birthday-bounce" />
          <span>Centennial Birthday Celebration</span>
          <PartyPopper className="h-5 w-5 animate-birthday-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
        {/* Connecting sparkle line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full">
          <div className="flex items-center justify-center mt-2 mb-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-birthday-sparkle mr-1"></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-birthday-sparkle mx-1" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-birthday-sparkle ml-1" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Main Heading with improved spacing */}
      <h2 
        id="centennial-heading"
        className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight animate-fade-in tracking-wide text-balance"
      >
        Route 66 Turns 100! <span className="inline-block h-8 w-8 sm:h-10 sm:w-10 animate-pulse">🎂</span>
      </h2>
      
      {/* Subtitle with date emphasis */}
      <p className="text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in mt-4 text-balance" style={{ animationDelay: '0.2s' }}>
        Join us in celebrating America's most famous highway as it reaches its centennial milestone on <strong className="font-bold text-blue-700">November 11, 2026</strong>
      </p>

      {/* Decorative Elements */}
      <div className="flex justify-center items-center gap-4 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
        <Sparkles className="h-6 w-6 text-blue-500 animate-birthday-sparkle" />
        <div className="w-16 h-1 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default CentennialHeader;
