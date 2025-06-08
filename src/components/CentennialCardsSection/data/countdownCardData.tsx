
import React from 'react';
import { Cake } from 'lucide-react';
import { TimeLeft, CentennialCardData } from './types';

export const createCountdownCardData = (timeLeft: TimeLeft): CentennialCardData => ({
  id: 'countdown',
  title: 'Birthday Countdown',
  subtitle: 'Centennial Celebration',
  description: 'Count down every moment until Route 66\'s historic 100th birthday celebration on November 11, 2026.',
  icon: <Cake className="h-6 w-6" />,
  route: '/countdown',
  accentColor: 'border-l-pink-500',
  buttonText: 'Join the Countdown',
  sparkleColor: 'text-pink-400',
  content: (
    <div className="text-center space-y-3 relative" aria-label="Countdown to Route 66's centennial birthday">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200 relative overflow-hidden min-h-[140px] flex flex-col justify-center">
        {/* Birthday cake illustration - 30% bigger */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none" aria-hidden="true" style={{ transform: 'translateY(20px)' }}>
          <div className="relative">
            <div className="flex flex-col items-center">
              {/* Top tier - 30% bigger */}
              <div className="w-10 h-4 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-400 rounded-lg border border-pink-400 mb-1 relative shadow-sm">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-pink-100 to-rose-100 rounded-t-lg"></div>
              </div>
              
              {/* Middle tier - 30% bigger */}
              <div className="w-16 h-5 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 rounded-lg border border-pink-500 mb-1 relative shadow-md">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-pink-200 to-rose-200 rounded-t-lg"></div>
                <div className="absolute left-2 top-1 w-0.5 h-0.5 bg-pink-200 rounded-full"></div>
                <div className="absolute right-2 top-1 w-0.5 h-0.5 bg-pink-200 rounded-full"></div>
              </div>
              
              {/* Bottom tier - 30% bigger */}
              <div className="w-21 h-7 bg-gradient-to-b from-pink-400 via-pink-500 to-pink-600 rounded-lg border border-pink-600 relative shadow-lg">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-300 to-rose-300 rounded-t-lg"></div>
                <div className="absolute left-2 top-1 w-1 h-0.5 bg-pink-200 rounded-full"></div>
                <div className="absolute right-2 top-1 w-1 h-0.5 bg-pink-200 rounded-full"></div>
                <div className="absolute left-1/2 top-0.5 w-1.5 h-0.5 bg-pink-100 rounded-full transform -translate-x-1/2"></div>
              </div>
            </div>
            
            {/* Candles with flames - 30% bigger and positioned above cake */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 flex gap-3">
              <div className="flex flex-col items-center">
                {/* Flame - 30% bigger */}
                <div className="w-1.5 h-3 bg-gradient-to-t from-orange-400 via-yellow-300 to-yellow-100 rounded-full motion-safe:animate-pulse motion-reduce:animate-none"></div>
                {/* Candle - 30% bigger */}
                <div className="w-1.5 h-4 bg-blue-400 rounded-sm"></div>
              </div>
              
              <div className="flex flex-col items-center">
                {/* Flame - 30% bigger */}
                <div className="w-1.5 h-3 bg-gradient-to-t from-red-400 via-orange-300 to-yellow-100 rounded-full motion-safe:animate-pulse motion-reduce:animate-none" style={{animationDelay: '0.5s'}}></div>
                {/* Candle - 30% bigger */}
                <div className="w-1.5 h-4 bg-pink-400 rounded-sm"></div>
              </div>
              
              <div className="flex flex-col items-center">
                {/* Flame - 30% bigger */}
                <div className="w-1.5 h-3 bg-gradient-to-t from-orange-400 via-yellow-300 to-white rounded-full motion-safe:animate-pulse motion-reduce:animate-none" style={{animationDelay: '1s'}}></div>
                {/* Candle - 30% bigger */}
                <div className="w-1.5 h-4 bg-green-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content with enhanced visibility */}
        <div className="relative z-20">
          <div className="text-3xl font-black text-pink-700 mb-1 tracking-wide drop-shadow-sm">
            {timeLeft.days}
          </div>
          <div className="text-xs font-semibold text-pink-600 uppercase tracking-wider mb-2 drop-shadow-sm">
            Days Remaining
          </div>
          <div className="text-xs text-pink-600 italic mb-3 drop-shadow-sm">
            Countdown to the birthday bash!
          </div>
          
          {/* Live time pills with enhanced visibility */}
          <div className="flex justify-center items-center gap-x-2">
            <div className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[40px] flex items-center justify-center shadow-md">
              {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <div className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[40px] flex items-center justify-center shadow-md">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
            <div className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[40px] flex items-center justify-center shadow-md">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});
