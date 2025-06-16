
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { WeatherPreCacheService, WeatherCacheResult } from '../../services/WeatherPreCacheService';
import { TripService } from '../../services/TripService';
import { GoogleCalendarService } from '../../services/GoogleCalendarService';
import { CalendarExportService } from '../../services/CalendarExportService';
import { toast } from '@/hooks/use-toast';
import ShareTripModalContent from './ShareTripModalContent';
import { Loader2, CloudSnow, Calendar, Download, ExternalLink } from 'lucide-react';

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

  const handleGoogleCalendarExport = () => {
    console.log('🔴 Google Calendar export clicked');
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to add to Google Calendar.",
        variant: "destructive"
      });
      return;
    }

    try {
      GoogleCalendarService.trackCalendarClick(tripPlan);
      
      const calendarUrl = GoogleCalendarService.createTripCalendarUrl(
        tripPlan,
        tripStartDate,
        shareUrl || undefined,
        { useUTC: false }
      );

      window.open(calendarUrl, '_blank', 'noopener,noreferrer');

      toast({
        title: "Opening Google Calendar",
        description: "Your Route 66 trip is being added to Google Calendar.",
        variant: "default"
      });
    } catch (error) {
      console.error('Google Calendar export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not export to Google Calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleICalendarDownload = async () => {
    console.log('🔴 iCalendar download clicked');
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to download calendar file.",
        variant: "destructive"
      });
      return;
    }

    try {
      const events = CalendarExportService.generateCalendarEvents(tripPlan, tripStartDate);
      const filename = `route66-trip-${tripPlan.startCity.replace(/\s+/g, '-').toLowerCase()}-to-${tripPlan.endCity.replace(/\s+/g, '-').toLowerCase()}.ics`;
      
      CalendarExportService.downloadICSFile(events, filename);

      toast({
        title: "Calendar Downloaded",
        description: "Your Route 66 trip calendar file has been downloaded successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('iCalendar download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download calendar file. Please try again.",
        variant: "destructive"
      });
    }
  };

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

        {/* CALENDAR EXPORT SECTION - FIRST AND MOST VISIBLE */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-500 p-6 rounded-lg mb-6">
          <h3 className="font-bold text-red-800 text-xl mb-4 flex items-center gap-2">
            📅 Add to Your Calendar
            <Calendar className="h-6 w-6" />
          </h3>
          
          <div className="bg-white p-4 rounded border mb-4">
            <p className="text-sm font-mono text-gray-800">
              DEBUG: tripStartDate = {tripStartDate ? '✅ ' + tripStartDate.toISOString() : '❌ NULL'}
            </p>
            <p className="text-sm font-mono text-gray-800">
              Trip: {tripPlan ? `${tripPlan.startCity} to ${tripPlan.endCity}` : '❌ No trip plan'}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleGoogleCalendarExport}
              disabled={!tripStartDate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 h-auto text-lg font-bold"
            >
              <ExternalLink className="h-6 w-6 mr-3" />
              Add to Google Calendar
            </Button>

            <Button
              onClick={handleICalendarDownload}
              disabled={!tripStartDate}
              variant="outline"
              className="w-full py-4 h-auto border-2 border-green-300 hover:bg-green-50 text-lg font-bold"
            >
              <Download className="h-6 w-6 mr-3 text-green-600" />
              Download iCalendar (.ics)
            </Button>
          </div>

          {!tripStartDate && (
            <div className="mt-4 bg-amber-100 border border-amber-400 p-3 rounded">
              <p className="text-amber-800 font-semibold">
                ⚠️ Please set a trip start date to enable calendar export
              </p>
            </div>
          )}
        </div>

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

        {/* Cache Results */}
        {cacheResult && preCacheComplete && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CloudSnow className="h-5 w-5 text-green-600" />
              <p className="text-green-700 font-medium">Weather Data Cached</p>
            </div>
            <p className="text-green-600 text-sm">
              Successfully cached weather for {cacheResult.cachedSegments} out of {cacheResult.totalSegments} destinations
              {cacheResult.errors.length > 0 && ` (${cacheResult.errors.length} partial failures)`}
            </p>
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
