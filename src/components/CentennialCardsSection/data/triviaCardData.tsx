
import React from 'react';
import { Brain } from 'lucide-react';
import { CentennialCardData } from './types';

export const triviaCardData: CentennialCardData = {
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
    <div className="text-center space-y-3 relative" aria-label="Route 66 trivia challenge">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-300 min-h-[140px] flex flex-col justify-center relative overflow-hidden">
        {/* Large background brain emoji */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none" aria-hidden="true">
          <div className="text-8xl scale-[2.5] transform rotate-12">
            🧠
          </div>
        </div>
        
        {/* Content with enhanced visibility */}
        <div className="relative z-20">
          <div className="text-2xl font-bold text-purple-800 mb-2">🧠</div>
          <div className="text-sm text-purple-700 font-medium mb-2">
            Test Your Route 66 Knowledge
          </div>
          <div className="text-xs text-purple-600">
            From historical facts to quirky trivia
          </div>
        </div>
      </div>
    </div>
  )
};
