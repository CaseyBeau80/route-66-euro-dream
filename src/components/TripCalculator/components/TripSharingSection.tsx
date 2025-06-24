
import React, { useState } from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TripSharingSectionProps {
  shareUrl: string;
  tripPlan: TripPlan;
}

const TripSharingSection: React.FC<TripSharingSectionProps> = ({ shareUrl, tripPlan }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">Share Your Trip</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Share your Route 66 adventure with friends and family!
      </p>
      
      <div className="flex items-center gap-2 p-3 bg-white rounded border border-blue-100">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
        />
        <Button
          onClick={handleCopyUrl}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TripSharingSection;
