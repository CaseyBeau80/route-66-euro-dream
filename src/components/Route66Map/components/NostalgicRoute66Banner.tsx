
import React from 'react';
import BackgroundTextures from './BackgroundTextures';
import AtmosphericElements from './AtmosphericElements';
import BannerContent from './BannerContent';
import VintageBorders from './VintageBorders';

const NostalgicRoute66Banner: React.FC = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <BackgroundTextures />
      <AtmosphericElements />
      <BannerContent />
      <VintageBorders />
    </div>
  );
};

export default NostalgicRoute66Banner;
