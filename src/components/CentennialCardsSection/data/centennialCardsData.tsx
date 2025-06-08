
import React from 'react';
import { Calendar, Clock, BookOpen, Trophy, Star } from 'lucide-react';

export interface CentennialCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  content: React.ReactNode;
  accentColor: string;
  buttonText: string;
  sparkleColor: string;
}

export const createCentennialCardsData = (timeLeft: any, currentFact: string): CentennialCard[] => [
  {
    id: 'countdown',
    title: 'Centennial Countdown',
    subtitle: 'Days Until Celebration',
    description: 'Track the countdown to Route 66\'s historic 100th anniversary with live updates every second.',
    icon: <Clock className="h-5 w-5" />,
    route: '/countdown',
    buttonText: 'See the Clock',
    accentColor: 'border-l-blue-500',
    sparkleColor: 'text-blue-400',
    content: (
      <div className="text-center space-y-3">
        <div className="text-3xl font-bold text-blue-600 animate-birthday-bounce">
          {timeLeft.days.toLocaleString()}
        </div>
        <div className="text-sm text-slate-600 font-medium">
          Days remaining
        </div>
        <div className="flex justify-center gap-2 text-xs">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
            {timeLeft.hours}h
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
            {timeLeft.minutes}m
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
            {timeLeft.seconds}s
          </span>
        </div>
      </div>
    )
  },
  {
    id: 'timeline',
    title: 'Historic Timeline',
    subtitle: '1926 - 2026',
    description: 'Explore a century of Route 66 history through major milestones and cultural moments.',
    icon: <Calendar className="h-5 w-5" />,
    route: '/timeline',
    buttonText: 'Explore the Journey',
    accentColor: 'border-l-indigo-500',
    sparkleColor: 'text-indigo-400',
    content: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-birthday-sparkle"></div>
          <span className="text-slate-600">1926: Highway designated</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-birthday-sparkle" style={{ animationDelay: '0.5s' }}></div>
          <span className="text-slate-600">1985: Decommissioned</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-birthday-sparkle" style={{ animationDelay: '1s' }}></div>
          <span className="text-slate-600">2026: 100th Anniversary</span>
        </div>
      </div>
    )
  },
  {
    id: 'fun-facts',
    title: 'Daily Fun Facts',
    subtitle: 'Route 66 Stories',
    description: 'Discover fascinating stories and little-known facts about America\'s most famous highway.',
    icon: <BookOpen className="h-5 w-5" />,
    route: '/fun-facts',
    buttonText: 'Read the Stories',
    accentColor: 'border-l-sky-500',
    sparkleColor: 'text-sky-400',
    content: (
      <div className="space-y-2">
        <div 
          className="text-sm text-slate-600 italic transition-opacity duration-500"
          aria-live="polite"
          aria-label="Rotating Route 66 fun fact"
        >
          "{currentFact}"
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Star className="h-3 w-3 fill-current text-blue-500 animate-birthday-sparkle" />
          <span>Updated every 10 seconds</span>
        </div>
      </div>
    )
  },
  {
    id: 'trivia',
    title: 'Route 66 Trivia',
    subtitle: 'Test Your Knowledge',
    description: 'Challenge yourself with interactive trivia covering Route 66 history and landmarks.',
    icon: <Trophy className="h-5 w-5" />,
    route: '/trivia',
    buttonText: 'Take the Challenge',
    accentColor: 'border-l-blue-600',
    sparkleColor: 'text-blue-400',
    content: (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Questions:</span>
          <span className="font-semibold text-blue-700">50+</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Categories:</span>
          <span className="font-semibold text-blue-700">8</span>
        </div>
        <div className="text-xs text-blue-700 text-center font-medium bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
          Play & Earn Badges
        </div>
      </div>
    )
  }
];
