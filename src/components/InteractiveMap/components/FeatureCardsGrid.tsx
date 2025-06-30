
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
}

interface FeatureCardsGridProps {
  features: Feature[];
}

const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({ features }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
      {features.map((feature, index) => (
        <div 
          key={index}
          className={`${feature.bgColor} rounded-xl border-2 border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <div className="text-route66-primary mb-4 flex justify-center">
            <feature.icon className="w-12 h-12" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-highway font-bold text-route66-text-primary mb-2">
              {feature.title}
            </h3>
            <p className="text-route66-text-secondary leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCardsGrid;
