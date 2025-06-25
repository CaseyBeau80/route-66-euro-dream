
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Star } from 'lucide-react';

interface TrailblazerBadgeProps {
  isTrailblazer: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
}

const TrailblazerBadge: React.FC<TrailblazerBadgeProps> = ({
  isTrailblazer,
  className = '',
  size = 'md',
  showIcon = true,
  showText = true
}) => {
  if (!isTrailblazer) return null;

  const sizeConfig = {
    sm: { icon: 12, text: 'text-xs', padding: 'px-2 py-1' },
    md: { icon: 16, text: 'text-sm', padding: 'px-3 py-1' },
    lg: { icon: 20, text: 'text-base', padding: 'px-4 py-2' }
  };

  const config = sizeConfig[size];

  return (
    <Badge 
      variant="secondary" 
      className={`
        bg-gradient-to-r from-yellow-400 to-orange-500 
        text-white font-bold shadow-lg
        animate-pulse
        ${config.padding}
        ${config.text}
        ${className}
      `}
    >
      {showIcon && (
        <Crown 
          size={config.icon} 
          className="mr-1 text-yellow-200" 
        />
      )}
      {showText && (
        <span>🏆 TRAILBLAZER</span>
      )}
    </Badge>
  );
};

export default TrailblazerBadge;
