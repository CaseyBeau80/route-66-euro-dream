import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Download, Link2, Mail, RefreshCw } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import ShareTripModal from './ShareTripModal';
import { TripService } from '../services/TripService';
import { toast } from '@/hooks/use-toast';

interface ShareAndExportDropdownProps {
  shareUrl?: string | null;
  tripTitle: string;
  tripPlan: TripPlan;
  tripStartDate?: Date;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const ShareAndExportDropdown: React.FC<ShareAndExportDropdownProps> = ({
  shareUrl,
  tripTitle,
  tripPlan,
  tripStartDate,
  variant = 'default',
  size = 'default',
  className
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState<string | null>(shareUrl || null);
  const [isGeneratingFreshLink, setIsGeneratingFreshLink] = useState(false);

  const handleGenerateFreshLink = async () => {
    if (isGeneratingFreshLink) return;

    try {
      setIsGeneratingFreshLink(true);
      
      console.log('🔗 Generating FRESH share link to test shared view...');
      
      // Generate a completely new share code
      const freshShareCode = await TripService.saveTrip(
        tripPlan, 
        `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip - Fresh Link`,
        `Fresh test link for Route 66 journey from ${tripPlan.startCity} to ${tripPlan.endCity}`
      );
      
      const freshShareUrl = TripService.getShareUrl(freshShareCode);
      setCurrentShareUrl(freshShareUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(freshShareUrl);
      
      toast({
        title: "Fresh Share Link Generated!",
        description: "New link created and copied to clipboard. This will bypass any cached states.",
        variant: "default"
      });
      
      console.log('✅ Fresh share link generated:', {
        shareCode: freshShareCode,
        shareUrl: freshShareUrl,
        purpose: 'testing_shared_view_weather_display'
      });

    } catch (error) {
      console.error('❌ Failed to generate fresh share link:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate fresh share link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingFreshLink(false);
    }
  };

  const handleCopyLink = async () => {
    if (!currentShareUrl) return;
    
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      toast({
        title: "Link Copied!",
        description: "Trip link copied to clipboard.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShareViaEmail = () => {
    if (!currentShareUrl) return;

    const emailSubject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripTitle}`);
    const emailBody = encodeURIComponent(
      `Hi!\n\nI've planned an amazing Route 66 trip and wanted to share it with you!\n\n` +
      `Trip: ${tripTitle}\n` +
      `${tripPlan.totalDays} days, ${Math.round(tripPlan.totalDistance)} miles\n\n` +
      `View the complete itinerary here: ${currentShareUrl}\n\n` +
      `Planned with Ramble 66 - The ultimate Route 66 trip planner\n` +
      `Visit ramble66.com to plan your own adventure!`
    );
    
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={`gap-2 ${className || ''}`}>
            <Share2 className="h-4 w-4" />
            Share & Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setIsShareModalOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Open Share Modal
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleGenerateFreshLink}
            disabled={isGeneratingFreshLink}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGeneratingFreshLink ? 'animate-spin' : ''}`} />
            Generate Fresh Share Link
          </DropdownMenuItem>
          
          {currentShareUrl && (
            <>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Link2 className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleShareViaEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Share via Email
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Print/Save as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareTripModal
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={currentShareUrl}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShareUrlGenerated={(shareCode, shareUrl) => {
          setCurrentShareUrl(shareUrl);
        }}
      />
    </>
  );
};

export default ShareAndExportDropdown;
