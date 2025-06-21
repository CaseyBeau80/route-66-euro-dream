
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Share2, Copy, Mail, Check } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanTypes';

interface ShareTripOptionsProps {
  tripPlan: TripPlan;
  currentShareUrl: string | null;
  isGeneratingLink: boolean;
  onGenerateLink: () => Promise<string | null>;
  onCopyLink: () => Promise<void>;
  onShareViaEmail: () => Promise<void>;
}

const ShareTripOptions: React.FC<ShareTripOptionsProps> = ({
  tripPlan,
  currentShareUrl,
  isGeneratingLink,
  onGenerateLink,
  onCopyLink,
  onShareViaEmail
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleCopyWithFeedback = async () => {
    await onCopyLink();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Trip Preview Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {tripPlan.title}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Route:</span> {tripPlan.startCity} → {tripPlan.endCity}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {tripPlan.segments?.length || 0} days
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Share Actions */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Share Your Trip</h4>
        
        {!currentShareUrl ? (
          <Button
            onClick={onGenerateLink}
            disabled={isGeneratingLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isGeneratingLink ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Link...
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 mr-2" />
                Generate Share Link
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Your shareable link:</p>
              <p className="text-sm font-mono text-blue-600 break-all bg-blue-50 p-3 rounded border">
                {currentShareUrl}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleCopyWithFeedback}
                variant="outline"
                className="flex items-center gap-2 py-3 h-auto border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-blue-700 hover:text-blue-800"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </Button>
              
              <Button
                onClick={onShareViaEmail}
                variant="outline"
                className="flex items-center gap-2 py-3 h-auto border-purple-300 hover:bg-purple-50 hover:border-purple-400 text-purple-700 hover:text-purple-800"
              >
                <Mail className="w-4 h-4" />
                Share via Email
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareTripOptions;
