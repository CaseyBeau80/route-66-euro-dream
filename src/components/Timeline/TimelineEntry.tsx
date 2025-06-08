
import React from 'react';
import { TimelineMilestone, categoryColors } from '../../data/timelineData';
import { Card, CardContent } from '@/components/ui/card';

interface TimelineEntryProps {
  milestone: TimelineMilestone;
  isLeft?: boolean;
  isVisible?: boolean;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ 
  milestone, 
  isLeft = false, 
  isVisible = true 
}) => {
  return (
    <div 
      className={`flex items-center mb-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isLeft ? 'flex-row-reverse' : ''}`}
    >
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-16 h-16 bg-route66-primary rounded-full flex items-center justify-center text-white text-2xl shadow-lg border-4 border-white">
          {milestone.icon}
        </div>
      </div>
      
      {/* Content card */}
      <Card 
        className={`max-w-md mx-6 ${categoryColors[milestone.category]} border-l-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-route66-primary">
              {milestone.year}
            </span>
            <span className="text-xs font-semibold text-route66-text-muted uppercase tracking-wider px-2 py-1 bg-white rounded-full">
              {milestone.category.replace('-', ' ')}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-route66-text-primary mb-2">
            {milestone.title}
          </h3>
          
          <p className="text-route66-text-secondary text-sm mb-4 leading-relaxed">
            {milestone.description}
          </p>
          
          {milestone.details && (
            <ul className="space-y-1">
              {milestone.details.map((detail, index) => (
                <li key={index} className="text-xs text-route66-text-muted flex items-start">
                  <span className="text-route66-primary mr-2 flex-shrink-0">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
