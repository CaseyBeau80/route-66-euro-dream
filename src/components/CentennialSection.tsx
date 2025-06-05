
import React, { useState, useEffect } from 'react';
import CountdownDisplay from "./Route66Countdown/CountdownDisplay";
import HorizontalTimeline from "./Route66Countdown/HorizontalTimeline";
import NostalgicBadge from "./Route66Countdown/NostalgicBadge";
import WavingFlag from "./Route66Countdown/WavingFlag";
import AnimatedConfetti from "./Route66Countdown/AnimatedConfetti";
import { Star } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CentennialSection = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Route 66 Centennial date - November 11, 2026
  const centennialDate = new Date('2026-11-11T00:00:00');

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = centennialDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Trigger confetti animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Vintage Route 66 Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(220, 38, 38, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(29, 78, 216, 0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(220, 38, 38, 0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(29, 78, 216, 0.1) 75%)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section opacity-95" />
      
      {/* Animated Confetti */}
      {showConfetti && <AnimatedConfetti />}
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header Section with Patriotic Styling */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-6 mb-8">
            <WavingFlag />
            <NostalgicBadge />
            <WavingFlag />
          </div>
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-white to-blue-600 text-route66-text-primary px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl border-2 border-white">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            CENTENNIAL CELEBRATION
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
          </div>
          
          <h2 
            className="text-5xl md:text-7xl lg:text-8xl font-black text-center mb-8 leading-tight"
            style={{
              fontFamily: "'Bungee Shade', 'Impact', sans-serif",
              background: `
                linear-gradient(45deg, 
                  #dc2626 0%, #ffffff 25%, #1d4ed8 50%, #ffffff 75%, #dc2626 100%
                )
              `,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `
                4px 4px 0px rgba(0,0,0,0.8),
                8px 8px 16px rgba(0,0,0,0.6),
                0 0 30px rgba(255, 255, 255, 0.8),
                0 0 60px rgba(220, 38, 38, 0.6),
                0 0 90px rgba(29, 78, 216, 0.6)
              `,
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))'
            }}
          >
            ROUTE 66 CENTENNIAL
          </h2>
          
          <p 
            className="text-xl md:text-2xl text-route66-text-secondary max-w-4xl mx-auto leading-relaxed font-semibold"
            style={{
              textShadow: `
                2px 2px 0px rgba(0,0,0,0.8),
                4px 4px 8px rgba(0,0,0,0.6)
              `
            }}
          >
            Celebrating 100 years of America's most iconic highway - from Chicago to Santa Monica, the Mother Road continues to inspire adventure and freedom
          </p>
        </div>

        {/* Countdown Display - Enhanced */}
        <div className="mb-20">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-red-500/20 via-white/30 to-blue-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-black/60 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-2xl p-8">
              <CountdownDisplay timeLeft={timeLeft} />
            </div>
          </div>
        </div>

        {/* Horizontal Timeline - Replacing tabbed content */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 via-white/20 to-blue-500/10 rounded-3xl blur-2xl"></div>
          <div className="relative">
            <HorizontalTimeline />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center items-center gap-8">
          <div className="w-24 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full"></div>
          <div className="w-8 h-8 bg-white rounded-full border-4 border-red-500 shadow-lg"></div>
          <div className="w-16 h-2 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-full"></div>
          <div className="w-8 h-8 bg-white rounded-full border-4 border-blue-500 shadow-lg"></div>
          <div className="w-24 h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
        </div>
      </div>
      
      {/* Additional Atmospheric Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-white rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-red-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-60 left-1/4 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-80 right-1/3 w-5 h-5 bg-white rounded-full opacity-30 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
    </section>
  );
};

export default CentennialSection;
