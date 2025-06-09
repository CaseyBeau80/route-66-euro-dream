
import React from 'react';
import { Button } from '@/components/ui/button';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { Copy, Mail, Link, Save, ExternalLink } from 'lucide-react';

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
  const handleGenerateOrCopy = async () => {
    if (currentShareUrl) {
      await onCopyLink();
    } else {
      await onGenerateLink();
    }
  };

  return (
    <div className="space-y-4 mt-8 pt-6 border-t border-gray-200">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Link className="w-5 h-5 text-blue-600" />
          Share Your Adventure
        </h4>
        
        <div className="space-y-3">
          {/* Generate/Copy Link Button */}
          <Button
            onClick={handleGenerateOrCopy}
            disabled={isGeneratingLink}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            {isGeneratingLink ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Saving Trip & Generating Link...
              </>
            ) : currentShareUrl ? (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Shareable Link
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Trip & Generate Link
              </>
            )}
          </Button>

          {/* Email Share Button */}
          <Button
            onClick={onShareViaEmail}
            disabled={isGeneratingLink}
            variant="outline"
            className="w-full border-2 border-green-200 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            <Mail className="w-4 h-4 mr-2" />
            Share via Email
          </Button>

          {/* Direct Link Button (if URL exists) */}
          {currentShareUrl && (
            <Button
              onClick={() => window.open(currentShareUrl, '_blank', 'noopener,noreferrer')}
              variant="outline"
              className="w-full border-2 border-orange-200 text-orange-700 hover:bg-orange-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Shared Trip
            </Button>
          )}
        </div>

        {/* Success Message */}
        {currentShareUrl && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-1">✅ Trip Saved & Ready to Share!</p>
            <p className="text-xs text-green-700 font-mono break-all">
              {currentShareUrl}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Link copied to clipboard! Share this with friends and family.
            </p>
          </div>
        )}
      </div>

      {/* Trip Information */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <p className="text-sm text-gray-600 text-center leading-relaxed">
          <strong>"{tripPlan.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`}"</strong> - Your Route 66 adventure will be saved to our database and accessible via a shareable link. 
          Recipients can view your complete itinerary, including all stops, timing, and recommendations.
        </p>
      </div>
    </div>
  );
};

export default ShareTripOptions;
