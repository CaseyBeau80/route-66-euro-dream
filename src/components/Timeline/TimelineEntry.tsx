
import React from 'react';
import { TimelineMilestone, categoryColors } from '../../data/timelineData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface TimelineEntryProps {
  milestone: TimelineMilestone;
  isLeft?: boolean;
  isVisible?: boolean;
}

const categoryBadgeColors = {
  establishment: 'bg-green-100 text-green-800 border-green-300',
  cultural: 'bg-purple-100 text-purple-800 border-purple-300',
  decline: 'bg-orange-100 text-orange-800 border-orange-300',
  revival: 'bg-route66-primary/10 text-route66-primary border-route66-primary/30'
};

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ 
  milestone, 
  isLeft = false, 
  isVisible = true 
}) => {
  const isCelebration = milestone.year === 2026;
  
  return (
    <div 
      className={`flex items-center mb-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isLeft ? 'flex-row-reverse' : ''}`}
    >
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg border-4 border-white transition-all duration-300 ${
          isCelebration 
            ? 'bg-gradient-to-br from-route66-accent-gold to-route66-primary animate-birthday-glow' 
            : 'bg-route66-primary hover:scale-110'
        }`}>
          {milestone.icon}
          {isCelebration && (
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-route66-accent-gold animate-birthday-sparkle" />
          )}
        </div>
      </div>
      
      {/* Content card */}
      <Card 
        className={`max-w-md mx-6 border-l-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
          categoryColors[milestone.category]
        } ${
          isCelebration 
            ? 'bg-gradient-to-br from-route66-accent-gold/5 to-route66-primary/5 border-l-route66-accent-gold shadow-lg animate-birthday-pulse' 
            : 'hover:shadow-nostalgic'
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              isCelebration ? 'text-route66-accent-gold' : 'text-route66-primary'
            }`}>
              {milestone.year}
            </span>
            <Badge 
              variant="outline"
              className={`text-xs font-semibold uppercase tracking-wider border ${
                categoryBadgeColors[milestone.category]
              } ${isCelebration ? 'animate-birthday-bounce' : ''}`}
            >
              {milestone.category.replace('-', ' ')}
            </Badge>
          </div>
          
          <h3 className={`text-lg font-bold mb-2 ${
            isCelebration ? 'text-route66-accent-gold' : 'text-route66-text-primary'
          }`}>
            {milestone.title}
            {isCelebration && <Sparkles className="inline-block ml-2 w-5 h-5 text-route66-accent-gold animate-birthday-sparkle" />}
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
