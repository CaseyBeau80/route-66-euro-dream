
import React from 'react';
import { Gift, PartyPopper, Sparkles } from 'lucide-react';

const CentennialHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      {/* Birthday Badge with connecting effect */}
      <div className="relative inline-block mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg animate-nostalgic-glow">
          <Gift className="h-5 w-5 motion-safe:animate-birthday-bounce motion-reduce:animate-none" />
          <span>Centennial Birthday Celebration</span>
          <PartyPopper className="h-5 w-5 motion-safe:animate-birthday-bounce motion-reduce:animate-none" style={{ animationDelay: '0.3s' }} />
        </div>
        {/* Connecting sparkle line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full">
          <div className="flex items-center justify-center mt-2 mb-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full motion-safe:animate-birthday-sparkle motion-reduce:animate-none mr-1"></div>
            <div className="w-1 h-1 bg-blue-600 rounded-full motion-safe:animate-birthday-sparkle motion-reduce:animate-none mx-1" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full motion-safe:animate-birthday-sparkle motion-reduce:animate-none ml-1" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Main Heading with enhanced glow and shadow */}
      <h2 
        id="centennial-heading"
        className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight animate-fade-in tracking-wide text-balance"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(29, 78, 216, 0.15)) drop-shadow(0 0 20px rgba(37, 99, 235, 0.1))',
          textShadow: '0 0 30px rgba(29, 78, 216, 0.3)'
        }}
      >
        Route 66 Turns 100! <span className="inline-block h-8 w-8 sm:h-10 sm:w-10 motion-safe:animate-pulse motion-reduce:animate-none">🎂</span>
      </h2>

      {/* Get Your Kicks callout */}
      <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <p className="text-sm italic text-muted-foreground tracking-wider font-medium">
          Get your kicks on Route 66 🎶
        </p>
      </div>
      
      {/* Subtitle with date emphasis */}
      <p className="text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in mt-4 text-balance" style={{ animationDelay: '0.2s' }}>
        Join us in celebrating America's most famous highway as it reaches its centennial milestone on <strong className="font-bold text-blue-800">November 11, 2026</strong>
      </p>

      {/* Decorative Elements */}
      <div className="flex justify-center items-center gap-4 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
        <Sparkles className="h-6 w-6 text-blue-600 motion-safe:animate-birthday-sparkle motion-reduce:animate-none" />
        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default CentennialHeader;
