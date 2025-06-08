
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
      <div className="text-center space-y-3">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
          <div className="text-3xl font-black text-pink-700 mb-1 tracking-wide">
            {timeLeft.days}
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
    accentColor: 'border-l-blue-500',
    buttonText: 'Explore the Journey',
    sparkleColor: 'text-blue-400',
    content: (
      <div className="text-center space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-700 mb-2">1926 - 2026</div>
          <div className="text-sm text-blue-600 font-medium">
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
    accentColor: 'border-l-green-500',
    buttonText: 'Read the Stories',
    sparkleColor: 'text-green-400',
    content: (
      <div className="text-center space-y-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
            Today's Route 66 Fact
          </div>
          <p className="text-sm text-green-700 font-medium leading-relaxed line-clamp-3">
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
    accentColor: 'border-l-purple-500',
    buttonText: 'Take the Challenge',
    sparkleColor: 'text-purple-400',
    content: (
      <div className="text-center space-y-3">
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-700 mb-2">🧠</div>
          <div className="text-sm text-purple-600 font-medium mb-2">
            Test Your Route 66 Knowledge
          </div>
          <div className="text-xs text-purple-500">
            From historical facts to quirky trivia
          </div>
        </div>
      </div>
    )
  }
];
