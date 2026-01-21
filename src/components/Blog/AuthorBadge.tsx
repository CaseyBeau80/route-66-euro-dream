import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AuthorBadgeProps {
  authorName: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const AuthorBadge: React.FC<AuthorBadgeProps> = ({ 
  authorName, 
  size = 'md',
  showName = true 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className={`${sizeClasses[size]} border-2 border-route66-orange ring-2 ring-route66-rust/20`}>
        <AvatarImage 
          src="/lovable-uploads/56c17d61-50a4-49c7-a00f-e49e4806a4b3.png" 
          alt="Big Bo Ramble - Route 66 Mascot"
          className="object-cover"
        />
        <AvatarFallback className="bg-route66-orange text-white font-bold text-xs">
          BB
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className={`${textSizes[size]} font-semibold text-route66-brown`}>
          {authorName}
        </span>
      )}
    </div>
  );
};

export default AuthorBadge;
