
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TripPlan } from '../../services/planning/TripPlanTypes';
import { WeatherPreCacheService, WeatherCacheResult } from '../../services/WeatherPreCacheService';
import { TripService } from '../../services/TripService';
import { toast } from '@/hooks/use-toast';
import ShareTripModalContent from './ShareTripModalContent';
import { Loader2, CloudSnow } from 'lucide-react';

interface EnhancedShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripPlan: TripPlan;
  tripStartDate?: Date;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
}

const EnhancedShareTripModal: React.FC<EnhancedShareTripModalProps> = ({
  isOpen,
  onClose,
  tripPlan,
  tripStartDate,
  onShareUrlGenerated
}) => {
  const [isPreCaching, setIsPreCaching] = useState(false);
  const [preCacheComplete, setPreCacheComplete] = useState(false);
  const [cacheResult, setCacheResult] = useState<WeatherCacheResult | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const handlePreCacheAndShare = async () => {
    if (!tripStartDate || !tripPlan.segments) {
      toast({
        title: "Cannot Share Trip",
        description: "Trip start date and segments are required for sharing.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsPreCaching(true);
      
      // Step 1: Pre-cache weather data
      console.log('🔄 Starting weather pre-cache for sharing...');
      const result = await WeatherPreCacheService.preCacheWeatherForTrip(
        tripPlan.segments,
        tripStartDate
      );
      
      setCacheResult(result);
      setPreCacheComplete(true);
      
      if (result.success) {
        toast({
          title: "Weather Data Cached!",
          description: `Cached weather for ${result.cachedSegments}/${result.totalSegments} destinations.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Partial Weather Cache",
          description: `Cached ${result.cachedSegments}/${result.totalSegments} destinations. Some weather data may be limited.`,
          variant: "default"
        });
      }

      // Step 2: Generate share link
      setIsGeneratingLink(true);
      
      const tripTitle = `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
      const tripDescription = `Route 66 journey from ${tripPlan.startCity} to ${tripPlan.endCity} with pre-cached weather data`;
      
      const shareCode = await TripService.saveTrip(tripPlan, tripTitle, tripDescription);
      const generatedShareUrl = TripService.getShareUrl(shareCode);
      
      setShareUrl(generatedShareUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(generatedShareUrl);
      
      toast({
        title: "Trip Shared Successfully!",
        description: "Share link copied to clipboard with cached weather data.",
        variant: "default"
      });
      
      if (onShareUrlGenerated) {
        onShareUrlGenerated(shareCode, generatedShareUrl);
      }

    } catch (error) {
      console.error('❌ Failed to pre-cache and share:', error);
      toast({
        title: "Share Failed",
        description: "Could not prepare trip for sharing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPreCaching(false);
      setIsGeneratingLink(false);
    }
  };

  const handleGenerateLink = async () => {
    if (shareUrl) {
      // Copy existing link
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard.",
        variant: "default"
      });
      return shareUrl;
    }
    
    // Generate new link with pre-caching
    await handlePreCacheAndShare();
    return shareUrl;
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard.",
        variant: "default"
      });
    }
  };

  const handleShareViaEmail = async () => {
    if (shareUrl) {
      const subject = encodeURIComponent(`Route 66 Trip: ${tripPlan.startCity} to ${tripPlan.endCity}`);
      const body = encodeURIComponent(`Check out my Route 66 trip plan with weather forecasts:\n\n${shareUrl}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  };

  const isTripComplete = !!(tripPlan?.segments && tripPlan.segments.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-route66-primary">
            🗺️ Share Your Route 66 Adventure
          </DialogTitle>
        </DialogHeader>

        {/* Pre-caching Status */}
        {(isPreCaching || isGeneratingLink) && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                {isPreCaching && (
                  <p className="text-blue-700 font-medium">
                    <CloudSnow className="inline h-4 w-4 mr-1" />
                    Caching weather data for sharing...
                  </p>
                )}
                {isGeneratingLink && (
                  <p className="text-blue-700 font-medium">
                    Generating share link...
                  </p>
                )}
                <p className="text-blue-600 text-sm mt-1">
                  This ensures your shared trip has all weather information ready to view.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Share Button or Content */}
        {!preCacheComplete && !shareUrl ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <CloudSnow className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Prepare Trip for Sharing
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We'll cache weather data for all destinations to ensure your shared trip displays accurate forecasts.
              </p>
            </div>
            
            <Button
              onClick={handlePreCacheAndShare}
              disabled={isPreCaching || isGeneratingLink || !isTripComplete}
              className="bg-route66-primary hover:bg-route66-rust text-white px-8 py-3 text-lg"
            >
              {isPreCaching || isGeneratingLink ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <CloudSnow className="h-5 w-5 mr-2" />
              )}
              Cache Weather & Create Share Link
            </Button>
          </div>
        ) : (
          <ShareTripModalContent
            tripPlan={tripPlan}
            tripStartDate={tripStartDate}
            currentShareUrl={shareUrl}
            isGeneratingLink={isGeneratingLink}
            isTripComplete={isTripComplete}
            onGenerateLink={handleGenerateLink}
            onCopyLink={handleCopyLink}
            onShareViaEmail={handleShareViaEmail}
            isSharedView={false}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedShareTripModal;
