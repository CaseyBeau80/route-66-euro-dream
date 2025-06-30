
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon | React.ComponentType;
  title: string;
  description: string;
  bgColor: string;
}

interface FeatureCardsGridProps {
  features: Feature[];
}

const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({
  features
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div
            key={index}
            className={`${feature.bgColor} rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureCardsGrid;
