
import React from 'react';

interface MapSectionHeaderProps {
  title: string;
  subtitle: string;
}

const MapSectionHeader: React.FC<MapSectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="max-w-6xl mx-auto mb-16">
      <h2 className="text-4xl md:text-5xl font-route66 font-bold uppercase text-route66-primary mb-6 text-center">
        {title}
      </h2>
      <p className="text-lg text-route66-text-secondary max-w-4xl mx-auto leading-relaxed text-center">
        {subtitle}
      </p>
    </div>
  );
};

export default MapSectionHeader;
