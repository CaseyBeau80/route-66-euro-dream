
import React from 'react';

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

  const logoSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  if (variant === 'logo') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="bg-route66-primary rounded-full p-2">
          <img 
            src="https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/Logo_1_Ramble_66.png" 
            alt="Ramble 66 Logo" 
            className={`${logoSizes[size]} object-contain`}
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
          src="https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/Logo_1_Ramble_66.png" 
          alt="Ramble 66 Logo" 
          className={`${logoSizes[size]} object-contain`}
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
