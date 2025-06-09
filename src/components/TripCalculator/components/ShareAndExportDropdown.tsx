
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Share2, ChevronDown, Copy, Mail, Calendar, Download, Save, Link, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CalendarExportService } from '../services/CalendarExportService';
import { GoogleCalendarService } from '../services/GoogleCalendarService';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { TripService } from '../services/TripService';
import { useTripAutoSaveBeforeShare } from '../hooks/useTripAutoSaveBeforeShare';
import EnhancedPDFExport from './pdf/EnhancedPDFExport';
import ShareTripModal from './ShareTripModal';
import LogoImage from '../../shared/LogoImage';
import { getRambleLogoAlt } from '../../../utils/logoConfig';

interface ShareAndExportDropdownProps {
  shareUrl?: string | null;
  tripTitle: string;
  tripPlan?: TripPlan;
  tripStartDate?: Date;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
}

const ShareAndExportDropdown: React.FC<ShareAndExportDropdownProps> = ({ 
  shareUrl, 
  tripTitle, 
  tripPlan,
  tripStartDate,
  variant = 'primary',
  size = 'default',
  className,
  onShareUrlGenerated
}) => {
  console.log('🔽 ShareAndExportDropdown ENHANCED rendering with:', {
    shareUrl,
    tripTitle,
    hasTripPlan: !!tripPlan,
    tripStartDate,
    variant,
    size,
    segmentsCount: tripPlan?.segments?.length || 0
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { saveBeforeShare, isAutoSaving } = useTripAutoSaveBeforeShare();

  const ensureShareUrl = async (): Promise<string | null> => {
    if (shareUrl) {
      return shareUrl;
    }

    if (!tripPlan) {
      toast({
        title: "No Trip to Share",
        description: "Please create a trip plan first.",
        variant: "destructive"
      });
      return null;
    }

    // Auto-save the trip to generate a share URL
    const shareCode = await saveBeforeShare(tripPlan);
    if (shareCode) {
      const newShareUrl = TripService.getShareUrl(shareCode);
      
      // Notify parent component about the new share URL
      if (onShareUrlGenerated) {
        onShareUrlGenerated(shareCode, newShareUrl);
      }
      
      return newShareUrl;
    }

    return null;
  };

  const handleShareTrip = () => {
    setIsOpen(false);
    setShowShareModal(true);
  };

  const handleCopyLink = async () => {
    const url = await ensureShareUrl();
    if (!url) return;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      toast({
        title: "Link Copied Successfully!",
        description: "Your shareable trip link is now in your clipboard and ready to share.",
        variant: "default"
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShareViaEmail = async () => {
    const url = await ensureShareUrl();
    if (!url) return;

    const subject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripTitle}`);
    const body = encodeURIComponent(
      `I've planned an amazing Route 66 road trip with Ramble 66 and wanted to share it with you!\n\n` +
      `Trip: ${tripTitle}\n` +
      `View the full plan here: ${url}\n\n` +
      `Ramble 66 makes it easy to plan your perfect Route 66 adventure. Start planning your own trip at ${window.location.origin}\n\n` +
      `Happy travels!\n` +
      `Planned with ❤️ using Ramble 66 - Your Route 66 Adventure Starts Here`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const handleAddToGoogleCalendar = () => {
    if (!tripPlan || !tripStartDate) {
      toast({
        title: "Calendar Export Unavailable",
        description: "Trip plan and start date are required for calendar export.",
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
        { useUTC: false, trackAnalytics: true }
      );

      window.open(calendarUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Opening Google Calendar",
        description: "Your Route 66 trip event is being added to Google Calendar.",
        variant: "default"
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Google Calendar integration error:', error);
      toast({
        title: "Google Calendar Failed",
        description: "Could not add trip to Google Calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadICS = () => {
    if (!tripPlan || !tripStartDate) {
      toast({
        title: "Calendar Export Unavailable",
        description: "Trip plan and start date are required for calendar export.",
        variant: "destructive"
      });
      return;
    }

    try {
      const events = CalendarExportService.generateCalendarEvents(tripPlan, tripStartDate);
      CalendarExportService.downloadICSFile(events, `${tripTitle.toLowerCase().replace(/\s+/g, '-')}.ics`);
      
      toast({
        title: "Calendar File Downloaded!",
        description: "Your Route 66 trip has been downloaded as a calendar file compatible with Apple Calendar and Outlook.",
        variant: "default"
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Calendar export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not export calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePDFExport = () => {
    setIsOpen(false);
    setShowPDFModal(true);
  };

  // Check if trip is complete
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  if (!isTripComplete) {
    console.log('⚠️ ShareAndExportDropdown: Trip not complete, showing disabled state');
    return (
      <div className={className}>
        <Button
          disabled
          variant="outline"
          size={size}
          className="opacity-50 cursor-not-allowed"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share & Export
        </Button>
      </div>
    );
  }

  console.log('✅ ShareAndExportDropdown ENHANCED: Rendering full dropdown with new styling');

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant === 'primary' ? 'default' : 'outline'}
            size={size}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold tracking-wide"
            disabled={isAutoSaving}
          >
            {isAutoSaving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Saving...
                </span>
              </>
            ) : (
              <>
                <LogoImage 
                  className="w-4 h-4 mr-2 object-contain"
                  alt={getRambleLogoAlt()}
                />
                <Share2 className="w-4 h-4 mr-2" />
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Share & Export
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300 transform skew-x-12"></div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-80 bg-white/95 backdrop-blur-lg border-2 border-blue-200/50 shadow-2xl rounded-2xl z-50 p-0 overflow-hidden"
          align="end"
          sideOffset={12}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <LogoImage 
                  className="w-5 h-5 object-contain"
                  alt={getRambleLogoAlt()}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">Share Your Adventure</h3>
                <p className="text-sm text-gray-600 leading-tight">Export and share your Route 66 journey</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            {/* Share Options Section */}
            <div className="mb-1">
              <DropdownMenuLabel className="text-sm font-bold text-gray-700 px-4 py-3 bg-gradient-to-r from-blue-50 to-transparent">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-blue-600" />
                  Share Your Trip
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuItem
                onClick={handleShareTrip}
                className="flex items-start gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 rounded-xl mx-2 my-1 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-200">
                  <Link className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-base leading-tight">
                    Save Trip & Share
                  </div>
                  <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Comprehensive sharing options with detailed preview
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={handleShareViaEmail}
                className="flex items-start gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 rounded-xl mx-2 my-1 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-blue-200 transition-all duration-200">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-base leading-tight">Share via Email</div>
                  <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Send your trip plan directly to friends and family
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
            
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3" />
            
            {/* Calendar Export Section */}
            <div className="mb-1">
              <DropdownMenuLabel className="text-sm font-bold text-gray-700 px-4 py-3 bg-gradient-to-r from-purple-50 to-transparent">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Calendar & Planning
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuItem
                onClick={handleAddToGoogleCalendar}
                className="flex items-start gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer transition-all duration-200 rounded-xl mx-2 my-1 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-200">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-base leading-tight">Add to Google Calendar</div>
                  <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Create calendar events for your Route 66 adventure
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={handleDownloadICS}
                className="flex items-start gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer transition-all duration-200 rounded-xl mx-2 my-1 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-200">
                  <Download className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-base leading-tight">Download Calendar File</div>
                  <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Compatible with Apple Calendar, Outlook, and other apps
                  </div>
                </div>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3" />
            
            {/* Document Export Section */}
            <div className="mb-1">
              <DropdownMenuLabel className="text-sm font-bold text-gray-700 px-4 py-3 bg-gradient-to-r from-green-50 to-transparent">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  Export Options
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuItem
                onClick={handlePDFExport}
                className="flex items-start gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 cursor-pointer transition-all duration-200 rounded-xl mx-2 my-1 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-teal-200 transition-all duration-200">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-base leading-tight">Export Trip as PDF</div>
                  <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Create a beautiful printable version of your itinerary
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Powered by Ramble 66 - Your Route 66 Adventure Starts Here
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Trip Modal */}
      {showShareModal && tripPlan && (
        <ShareTripModal
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          shareUrl={shareUrl || undefined}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShareUrlGenerated={onShareUrlGenerated}
        />
      )}

      {/* PDF Export Modal */}
      {showPDFModal && tripPlan && (
        <EnhancedPDFExport
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          shareUrl={shareUrl || undefined}
          isOpen={showPDFModal}
          onClose={() => setShowPDFModal(false)}
        />
      )}
    </div>
  );
};

export default ShareAndExportDropdown;
