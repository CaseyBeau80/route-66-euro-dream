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
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
      {features.map((feature, index) => {
      const IconComponent = feature.icon;
      return;
    })}
    </div>;
};
export default FeatureCardsGrid;