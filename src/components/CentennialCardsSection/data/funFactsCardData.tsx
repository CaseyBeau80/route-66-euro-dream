
import React from 'react';
import { Book } from 'lucide-react';
import { CentennialCardData } from './types';

export const createFunFactsCardData = (currentFact: string): CentennialCardData => ({
  id: 'facts',
  title: 'Fun Facts & Stories',
  subtitle: (
    <div className="flex items-center gap-2">
      <span className="text-lg sm:text-xl group-hover:scale-105 transition-transform duration-200" aria-hidden="true">🗺️</span>
      <span>Daily Route 66 Tales</span>
    </div>
  ),
  description: 'Discover fascinating stories, legends, and little-known facts about Route 66\'s incredible journey.',
  icon: <Book className="h-6 w-6" />,
  route: '/facts',
  accentColor: 'border-l-green-600',
  buttonText: 'Read the Stories',
  sparkleColor: 'text-green-400',
  content: (
    <div className="text-center space-y-3">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-300 min-h-[140px] flex flex-col justify-center">
        <div className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">
          Today's Route 66 Fact
        </div>
        <p className="text-sm text-green-800 font-normal leading-relaxed line-clamp-3">
          {currentFact}
        </p>
      </div>
    </div>
  )
});
