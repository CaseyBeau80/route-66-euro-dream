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
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200 relative z-10">
          {/* Enhanced birthday cake behind days */}
          <div className="relative">
            {/* Birthday cake illustration with candles */}
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none"
              aria-hidden="true"
            >
              <div className="relative">
                {/* Cake base layers */}
                <div className="flex flex-col items-center">
                  {/* Top cake layer */}
                  <div className="w-16 h-6 bg-gradient-to-r from-pink-300 to-rose-300 rounded-lg border-2 border-pink-400 mb-1 relative">
                    {/* Candles with flames */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-2 bg-yellow-200 motion-safe:animate-pulse motion-reduce:animate-none"></div>
                        <div className="w-1 h-3 bg-pink-200 rounded-sm"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-2 bg-orange-200 motion-safe:animate-pulse motion-reduce:animate-none" style={{animationDelay: '0.3s'}}></div>
                        <div className="w-1 h-3 bg-pink-200 rounded-sm"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-2 bg-yellow-200 motion-safe:animate-pulse motion-reduce:animate-none" style={{animationDelay: '0.6s'}}></div>
                        <div className="w-1 h-3 bg-pink-200 rounded-sm"></div>
                      </div>
                    </div>
                    {/* Frosting decoration */}
                    <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-pink-200 to-rose-200 rounded-b-lg"></div>
                  </div>
                  
                  {/* Bottom cake layer */}
                  <div className="w-20 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg border-2 border-pink-500 relative">
                    {/* Decorative frosting swirls */}
                    <div className="absolute top-0 left-2 w-2 h-1 bg-pink-200 rounded-full"></div>
                    <div className="absolute top-0 right-2 w-2 h-1 bg-pink-200 rounded-full"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-200 rounded-full"></div>
                  </div>
                </div>
                
                {/* Subtle glow effect around the cake */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 to-rose-200/20 rounded-full blur-sm -z-10 motion-safe:animate-birthday-glow motion-reduce:animate-none"></div>
              </div>
            </div>
            
            <div className="text-3xl font-black text-pink-700 mb-1 tracking-wide relative z-10">
              {timeLeft.days}
            </div>
          </div>
          <div className="text-xs font-semibold text-pink-600 uppercase tracking-wider mb-2">
            Days Remaining
          </div>
          <div className="text-xs text-pink-600 italic mb-3">
            Countdown to the birthday bash!
          </div>
          
          {/* Live time pills with consistent alignment */}
          <div className="flex justify-center items-center gap-x-2">
            <div className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[40px] flex items-center justify-center">
              {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <div className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[40px] flex items-center justify-center">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
            <div className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[40px] flex items-center justify-center">
              {String(timeLeft.seconds).padStart(2, '0')}s
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
