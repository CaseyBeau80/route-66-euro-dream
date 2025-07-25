
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Download, Link2, Mail } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanTypes';
import { TripService } from '../services/TripService';
import ShareTripModal from './ShareTripModal';
import EnhancedPDFExport from './pdf/EnhancedPDFExport';
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
  const [isPDFExportOpen, setIsPDFExportOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState<string | null>(shareUrl || null);

  const handleCopyLink = async () => {
    if (!currentShareUrl) {
      // Generate share URL directly without opening modal
      try {
        const shareCode = await TripService.saveTrip(tripPlan, tripTitle);
        const generatedShareUrl = TripService.getShareUrl(shareCode);
        setCurrentShareUrl(generatedShareUrl);
        
        // Copy to clipboard
        await navigator.clipboard.writeText(generatedShareUrl);
        
        toast({
          title: "Link Generated & Copied!",
          description: "Your trip link has been generated and copied to clipboard.",
          variant: "default"
        });
      } catch (error) {
        console.error('Failed to generate and copy link:', error);
        toast({
          title: "Generation Failed",
          description: "Could not generate share link. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }
    
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

  const handleShareViaEmail = async () => {
    if (!currentShareUrl) {
      // Generate share URL directly without opening modal
      try {
        const shareCode = await TripService.saveTrip(tripPlan, tripTitle);
        const generatedShareUrl = TripService.getShareUrl(shareCode);
        setCurrentShareUrl(generatedShareUrl);
        
        // Open email with the generated URL
        const emailSubject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripTitle}`);
        const emailBody = encodeURIComponent(
          `Hi!\n\nI've planned an amazing Route 66 trip and wanted to share it with you!\n\n` +
          `Trip: ${tripTitle}\n` +
          `${tripPlan.totalDays} days, ${Math.round(tripPlan.totalDistance)} miles\n\n` +
          `View the complete itinerary here: ${generatedShareUrl}\n\n` +
          `Planned with Ramble 66 - The ultimate Route 66 trip planner\n` +
          `Visit ramble66.com to plan your own adventure!`
        );
        
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
        
        toast({
          title: "Link Generated & Email Opened!",
          description: "Your trip link has been generated and email client opened.",
          variant: "default"
        });
      } catch (error) {
        console.error('Failed to generate link for email:', error);
        toast({
          title: "Generation Failed",
          description: "Could not generate share link. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

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

  // Enhanced button styling for better visibility
  const enhancedClassName = `
    ${className || ''} 
    shadow-lg hover:shadow-xl 
    transition-all duration-300 
    transform hover:scale-105
    bg-gradient-to-r from-blue-600 to-purple-600 
    hover:from-blue-700 hover:to-purple-700
    text-white border-0
    font-bold
  `.trim();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            className={enhancedClassName}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share & Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-white shadow-xl border-2 border-gray-200 rounded-xl p-2"
          sideOffset={8}
        >
          <DropdownMenuItem 
            onClick={() => setIsShareModalOpen(true)}
            className="rounded-lg hover:bg-blue-50 py-3 px-4 cursor-pointer"
          >
            <Share2 className="mr-3 h-5 w-5 text-blue-600" />
            <span className="font-medium">Add to Calendar</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem 
            onClick={handleCopyLink}
            className="rounded-lg hover:bg-green-50 py-3 px-4 cursor-pointer"
          >
            <Link2 className="mr-3 h-5 w-5 text-green-600" />
            <span className="font-medium">
              {currentShareUrl ? "Copy Link" : "Generate & Copy Link"}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleShareViaEmail}
            className="rounded-lg hover:bg-orange-50 py-3 px-4 cursor-pointer"
          >
            <Mail className="mr-3 h-5 w-5 text-orange-600" />
            <span className="font-medium">
              {currentShareUrl ? "Share via Email" : "Generate & Share via Email"}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem 
            onClick={() => setIsPDFExportOpen(true)}
            className="rounded-lg hover:bg-blue-50 py-3 px-4 cursor-pointer"
          >
            <Download className="mr-3 h-5 w-5 text-blue-600" />
            <span className="font-medium">Print/Save as PDF</span>
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

      <EnhancedPDFExport
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={currentShareUrl}
        isOpen={isPDFExportOpen}
        onClose={() => setIsPDFExportOpen(false)}
      />
    </>
  );
};

export default ShareAndExportDropdown;
