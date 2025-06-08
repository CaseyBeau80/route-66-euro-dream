
import React from 'react';
import { TimelineMilestone, categoryColors } from '../../data/timelineData';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

interface TimelineMobileProps {
  milestones: TimelineMilestone[];
}

const categoryBadgeColors = {
  establishment: 'bg-green-100 text-green-800 border-green-300',
  cultural: 'bg-purple-100 text-purple-800 border-purple-300',
  decline: 'bg-orange-100 text-orange-800 border-orange-300',
  revival: 'bg-route66-primary/10 text-route66-primary border-route66-primary/30'
};

export const TimelineMobile: React.FC<TimelineMobileProps> = ({ milestones }) => {
  return (
    <Accordion type="multiple" className="space-y-4">
      {milestones.map((milestone) => {
        const isCelebration = milestone.year === 2026;
        
        return (
          <AccordionItem 
            key={milestone.id} 
            value={milestone.id}
            className={`border-l-4 rounded-lg overflow-hidden transition-all duration-300 ${
              categoryColors[milestone.category]
            } ${
              isCelebration 
                ? 'bg-gradient-to-br from-route66-accent-gold/5 to-route66-primary/5 border-l-route66-accent-gold shadow-lg animate-birthday-pulse' 
                : 'hover:shadow-nostalgic'
            }`}
          >
            <AccordionTrigger className="px-4 py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left w-full">
                <span className={`text-2xl flex-shrink-0 relative ${
                  isCelebration ? 'animate-birthday-bounce' : ''
                }`}>
                  {milestone.icon}
                  {isCelebration && (
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-route66-accent-gold animate-birthday-sparkle" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-lg font-bold ${
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
                  <h3 className={`text-sm font-semibold ${
                    isCelebration ? 'text-route66-accent-gold' : 'text-route66-text-primary'
                  }`}>
                    {milestone.title}
                    {isCelebration && <Sparkles className="inline-block ml-1 w-4 h-4 text-route66-accent-gold animate-birthday-sparkle" />}
                  </h3>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-4 pb-4">
              <p className="text-route66-text-secondary text-sm mb-3 leading-relaxed">
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
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
