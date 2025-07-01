
import React from 'react';
import { Check } from 'lucide-react';

const CompactCountdown: React.FC = () => {
  const benefits = [
    {
      title: "Interactive Route 66 Google Map",
      subtitle: "Explore iconic cities, quirky roadside attractions, and hidden gems"
    },
    {
      title: "Shareable Travel Planner", 
      subtitle: "Build custom Route 66 trips and share them with friends and family"
    },
    {
      title: "Social Media & More",
      subtitle: "Instagram integration and community features for travelers"
    }
  ];

  return (
    <div className="space-y-4">
      {benefits.map((benefit, index) => (
        <div 
          key={index}
          className="bg-white/95 backdrop-blur-sm rounded-xl border border-route66-primary/20 p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-start gap-3">
            {/* Blue Checkmark Icon */}
            <div className="flex-shrink-0 w-6 h-6 bg-route66-primary rounded-full flex items-center justify-center shadow-md group-hover:bg-route66-primary-dark transition-colors duration-300">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 className="font-highway font-bold text-base text-route66-primary mb-1">
                {benefit.title}
              </h3>
              <p className="text-sm text-route66-text-secondary leading-relaxed">
                {benefit.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompactCountdown;
