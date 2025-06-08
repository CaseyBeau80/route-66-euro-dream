import React from 'react';
import { Calendar, Book, Brain, Cake } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const createCentennialCardsData = (timeLeft: TimeLeft, currentFact: string) => [
  {
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
      <div className="text-center space-y-3 relative">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200 relative overflow-hidden">
          {/* Large birthday cake illustration covering the entire card */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="relative scale-[2.5]">
              <div className="flex flex-col items-center">
                {/* Top tier - smallest */}
                <div className="w-10 h-3 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-400 rounded-lg border border-pink-400 mb-0.5 relative shadow-sm">
                  {/* Top tier frosting detail */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-pink-100 to-rose-100 rounded-t-lg"></div>
                  <div className="absolute left-1/2 top-0.5 w-0.5 h-0.5 bg-pink-100 rounded-full transform -translate-x-1/2"></div>
                </div>
                
                {/* Middle tier */}
                <div className="w-14 h-4 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 rounded-lg border border-pink-500 mb-0.5 relative shadow-md">
                  {/* Middle tier decorations */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-pink-200 to-rose-200 rounded-t-lg"></div>
                  <div className="absolute left-2 top-1 w-0.5 h-0.5 bg-pink-200 rounded-full"></div>
                  <div className="absolute right-2 top-1 w-0.5 h-0.5 bg-pink-200 rounded-full"></div>
                  <div className="absolute left-1/2 top-0.5 w-1 h-0.5 bg-pink-100 rounded-full transform -translate-x-1/2"></div>
                </div>
                
                {/* Bottom tier - largest */}
                <div className="w-16 h-5 bg-gradient-to-b from-pink-400 via-pink-500 to-pink-600 rounded-lg border border-pink-600 relative shadow-lg">
                  {/* Bottom tier elaborate frosting */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-300 to-rose-300 rounded-t-lg"></div>
                  <div className="absolute left-2 top-1 w-1 h-0.5 bg-pink-200 rounded-full"></div>
                  <div className="absolute right-2 top-1 w-1 h-0.5 bg-pink-200 rounded-full"></div>
                  <div className="absolute left-1/2 top-0.5 w-1.5 h-0.5 bg-pink-100 rounded-full transform -translate-x-1/2"></div>
                  <div className="absolute left-3 top-2 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
                  <div className="absolute right-3 top-2 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
                </div>
              </div>
              
              {/* Enhanced glow effect for larger cake */}
              <div className="absolute inset-0 bg-gradient-radial from-pink-200/30 via-rose-200/15 to-transparent rounded-full blur-lg -z-10 motion-safe:animate-birthday-glow motion-reduce:animate-none scale-150"></div>
            </div>
          </div>
          
          {/* Three elegant candles with HIGHLY VISIBLE animated flames - positioned ABOVE the content */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex gap-1 z-20 pointer-events-none">
            <div className="flex flex-col items-center">
              {/* Flame with enhanced visibility and realistic glow */}
              <div className="relative">
                <div className="w-1 h-3 bg-gradient-to-t from-orange-400 via-yellow-300 to-yellow-100 rounded-full motion-safe:animate-pulse motion-reduce:animate-none opacity-100 shadow-lg"></div>
                <div className="absolute inset-0 w-1 h-3 bg-yellow-200 rounded-full blur-[1px] motion-safe:animate-birthday-glow motion-reduce:animate-none opacity-90"></div>
                <div className="absolute inset-0 w-1 h-3 bg-white rounded-full blur-[2px] opacity-60"></div>
              </div>
              {/* Candle body */}
              <div className="w-1.5 h-4 bg-gradient-to-b from-blue-200 to-blue-300 rounded-sm border-r border-blue-400 shadow-sm"></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-1 h-3 bg-gradient-to-t from-red-400 via-orange-300 to-yellow-100 rounded-full motion-safe:animate-pulse motion-reduce:animate-none opacity-100 shadow-lg" style={{animationDelay: '0.4s'}}></div>
                <div className="absolute inset-0 w-1 h-3 bg-orange-200 rounded-full blur-[1px] motion-safe:animate-birthday-glow motion-reduce:animate-none opacity-90" style={{animationDelay: '0.4s'}}></div>
                <div className="absolute inset-0 w-1 h-3 bg-white rounded-full blur-[2px] opacity-60"></div>
              </div>
              <div className="w-1.5 h-4 bg-gradient-to-b from-pink-200 to-pink-300 rounded-sm border-r border-pink-400 shadow-sm"></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-1 h-3 bg-gradient-to-t from-orange-400 via-yellow-300 to-white rounded-full motion-safe:animate-pulse motion-reduce:animate-none opacity-100 shadow-lg" style={{animationDelay: '0.8s'}}></div>
                <div className="absolute inset-0 w-1 h-3 bg-yellow-100 rounded-full blur-[1px] motion-safe:animate-birthday-glow motion-reduce:animate-none opacity-90" style={{animationDelay: '0.8s'}}></div>
                <div className="absolute inset-0 w-1 h-3 bg-white rounded-full blur-[2px] opacity-60"></div>
              </div>
              <div className="w-1.5 h-4 bg-gradient-to-b from-green-200 to-green-300 rounded-sm border-r border-green-400 shadow-sm"></div>
            </div>
          </div>
          
          {/* Content with enhanced visibility */}
          <div className="relative z-10">
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
  },
  {
    id: 'timeline',
    title: 'Historic Timeline',
    subtitle: 'Journey Through Time',
    description: 'Explore the rich history and milestones of America\'s Mother Road from its birth to present day.',
    icon: <Calendar className="h-6 w-6" />,
    route: '/timeline',
    accentColor: 'border-l-blue-600',
    buttonText: 'Explore the Journey',
    sparkleColor: 'text-blue-400',
    content: (
      <div className="text-center space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-300">
          <div className="text-2xl font-bold text-blue-800 mb-2">1926 - 2026</div>
          <div className="text-sm text-blue-700 font-medium">
            100 Years of American Adventure
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'facts',
    title: 'Fun Facts & Stories',
    subtitle: 'Daily Route 66 Tales',
    description: 'Discover fascinating stories, legends, and little-known facts about Route 66\'s incredible journey.',
    icon: <Book className="h-6 w-6" />,
    route: '/facts',
    accentColor: 'border-l-green-600',
    buttonText: 'Read the Stories',
    sparkleColor: 'text-green-400',
    content: (
      <div className="text-center space-y-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-300">
          <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
            Today's Route 66 Fact
          </div>
          <p className="text-sm text-green-800 font-medium leading-relaxed line-clamp-3">
            {currentFact}
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'trivia',
    title: 'Route 66 Trivia',
    subtitle: 'Test Your Knowledge',
    description: 'Challenge yourself with fun trivia questions about Route 66\'s history, landmarks, and culture.',
    icon: <Brain className="h-6 w-6" />,
    route: '/trivia',
    accentColor: 'border-l-purple-600',
    buttonText: 'Take the Challenge',
    sparkleColor: 'text-purple-400',
    content: (
      <div className="text-center space-y-3">
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-300">
          <div className="text-2xl font-bold text-purple-800 mb-2">🧠</div>
          <div className="text-sm text-purple-700 font-medium mb-2">
            Test Your Route 66 Knowledge
          </div>
          <div className="text-xs text-purple-600">
            From historical facts to quirky trivia
          </div>
        </div>
      </div>
    )
  }
];
