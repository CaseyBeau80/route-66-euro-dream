
import React from 'react';
import { getRambleLogoUrl, getRambleLogoAlt, getRambleLogoSize } from '../../utils/logoConfig';

interface RambleBrandingProps {
  className?: string;
  variant?: 'logo' | 'text' | 'full';
  size?: 'sm' | 'md' | 'lg';
}

const RambleBranding: React.FC<RambleBrandingProps> = ({
  className = '',
  variant = 'full',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  if (variant === 'logo') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="bg-route66-primary rounded-full p-2">
          <img 
            src={getRambleLogoUrl()}
            alt={getRambleLogoAlt('branding')}
            className={`${getRambleLogoSize(size)} object-contain`}
          />
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`ramble-66-text-logo flex items-center gap-1 ${className}`}>
        <span className={`font-bold text-route66-primary ${sizeClasses[size]}`}>
          RAMBLE
        </span>
        <span className={`font-bold text-route66-primary ${sizeClasses[size]}`}>
          66
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-route66-primary rounded-full p-2">
        <img 
          src={getRambleLogoUrl()}
          alt={getRambleLogoAlt('branding')}
          className={`${getRambleLogoSize(size)} object-contain`}
        />
      </div>
      <div className="ramble-66-text-logo">
        <div className="flex items-center gap-1">
          <div className={`font-bold text-route66-primary leading-none ${sizeClasses[size]}`}>
            RAMBLE
          </div>
          <div className={`font-bold text-route66-primary leading-none ${sizeClasses[size]}`}>
            66
          </div>
        </div>
        <div className="text-xs text-route66-text-secondary font-medium tracking-wider">
          ROUTE 66 TRIP PLANNER
        </div>
      </div>
    </div>
  );
};

export default RambleBranding;
