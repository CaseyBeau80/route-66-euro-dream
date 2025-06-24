
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import UnifiedShareModal from './UnifiedShareModal';

interface ShareTripButtonProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

const ShareTripButton: React.FC<ShareTripButtonProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  onShareUrlGenerated,
  variant = 'default',
  size = 'default',
  className = '',
  children
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
        disabled={!isComplete}
      >
        <Share2 className="h-4 w-4" />
        {children || 'Share Trip'}
      </Button>

      <UnifiedShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={shareUrl}
        onShareUrlGenerated={onShareUrlGenerated}
      />
    </>
  );
};

export default ShareTripButton;
