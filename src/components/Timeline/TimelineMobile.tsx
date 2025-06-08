
import React from 'react';
import { TimelineMilestone, categoryColors } from '../../data/timelineData';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

interface TimelineMobileProps {
  milestones: TimelineMilestone[];
}

export const TimelineMobile: React.FC<TimelineMobileProps> = ({ milestones }) => {
  return (
    <Accordion type="multiple" className="space-y-4">
      {milestones.map((milestone) => (
        <AccordionItem 
          key={milestone.id} 
          value={milestone.id}
          className={`${categoryColors[milestone.category]} border-l-4 rounded-lg overflow-hidden`}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl flex-shrink-0">{milestone.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-route66-primary">
                    {milestone.year}
                  </span>
                  <span className="text-xs font-semibold text-route66-text-muted uppercase tracking-wider px-2 py-0.5 bg-white rounded-full">
                    {milestone.category.replace('-', ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-route66-text-primary">
                  {milestone.title}
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
      ))}
    </Accordion>
  );
};
