
import React from 'react';
import { Calendar } from 'lucide-react';
import { CentennialCardData } from './types';

export const timelineCardData: CentennialCardData = {
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
    <div className="text-center space-y-3 relative" aria-label="Route 66 historic timeline">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-300 min-h-[140px] flex flex-col justify-center relative overflow-hidden">
        {/* Large background scroll emoji */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none" aria-hidden="true">
          <div className="text-8xl scale-[2.5] transform -rotate-12">
            📜
          </div>
        </div>
        
        {/* Content with enhanced visibility */}
        <div className="relative z-20">
          <div className="text-2xl font-bold text-blue-800 mb-2">1926 - 2026</div>
          <div className="text-sm text-blue-700 font-medium">
            100 Years of American Adventure
          </div>
        </div>
      </div>
    </div>
  )
};
