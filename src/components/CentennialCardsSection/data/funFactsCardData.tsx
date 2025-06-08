
import React from 'react';
import { Book } from 'lucide-react';
import { CentennialCardData } from './types';

export const createFunFactsCardData = (currentFact: string): CentennialCardData => ({
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
    <div className="text-center space-y-3 relative" aria-label="Route 66 fun facts and stories">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-300 min-h-[140px] flex flex-col justify-center relative overflow-hidden">
        {/* Large background map emoji */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none" aria-hidden="true">
          <div className="text-8xl scale-[2.5] transform rotate-12">
            🗺️
          </div>
        </div>
        
        {/* Content with enhanced visibility */}
        <div className="relative z-20">
          <div className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">
            Today's Route 66 Fact
          </div>
          <p className="text-sm text-green-800 font-normal leading-relaxed line-clamp-3">
            {currentFact}
          </p>
        </div>
      </div>
    </div>
  )
});
