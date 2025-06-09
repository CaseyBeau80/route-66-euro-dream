import React, { useState, useCallback } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, Share2 } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { PDFExportService } from '../services/pdf/PDFExportService';
import { toast } from '@/hooks/use-toast';
import LogoImage from '../../shared/LogoImage';
import { getRambleLogoAlt } from '../../../utils/logoConfig';
import ShareActions from './ShareActions';
import ExportActions from './ExportActions';
import ExportOptionsForm from './ExportOptionsForm';

interface ShareAndExportDropdownProps {
  tripPlan: TripPlan;
  shareUrl: string | null;
  onShareTrip: (tripPlan: TripPlan) => Promise<void>;
  tripStartDate?: Date;
  tripTitle?: string;
  variant?: string;
  size?: string;
  className?: string;
}

interface ExportOptions {
  format: 'summary' | 'full';
  includeWeather: boolean;
  includeQRCode: boolean;
  title: string;
  watermark: string;
}

interface CopiedStates {
  shareUrl: boolean;
}

const ShareAndExportDropdown: React.FC<ShareAndExportDropdownProps> = ({
  tripPlan,
  shareUrl,
  onShareTrip,
  tripStartDate,
  tripTitle,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedStates, setCopiedStates] = useState<CopiedStates>({
    shareUrl: false
  });

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'full',
    includeWeather: true,
    includeQRCode: true,
    title: tripTitle || `Route 66 Adventure: ${tripPlan.startCity} to ${tripPlan.endCity}`,
    watermark: 'RAMBLE 66'
  });

  const copyToClipboard = useCallback(async (text: string, type: keyof CopiedStates) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });

      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  }, []);

  const handleShareTrip = useCallback(async (tripPlan: TripPlan) => {
    setIsSharing(true);
    try {
      await onShareTrip(tripPlan);
    } finally {
      setIsSharing(false);
    }
  }, [onShareTrip]);

  const handleExportToPDF = useCallback(async (
    tripPlan: TripPlan, 
    tripStartDate?: Date, 
    shareUrl?: string | null, 
    exportOptions?: ExportOptions
  ) => {
    setIsExporting(true);
    try {
      console.log('🔄 ShareAndExportDropdown: Starting PDF export...');
      await PDFExportService.exportTripToPDF(tripPlan, tripStartDate, shareUrl, exportOptions);
      
      toast({
        title: "PDF Export Complete!",
        description: "Your Route 66 trip plan has been downloaded as a PDF.",
      });
      
      console.log('✅ ShareAndExportDropdown: PDF export completed successfully');
    } catch (error) {
      console.error('❌ ShareAndExportDropdown: PDF export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handlePrintTrip = useCallback(async (
    tripPlan: TripPlan, 
    tripStartDate?: Date, 
    shareUrl?: string | null, 
    exportOptions?: ExportOptions
  ) => {
    setIsPrinting(true);
    try {
      console.log('🔄 ShareAndExportDropdown: Starting print...');
      await PDFExportService.printTrip(tripPlan, tripStartDate, shareUrl, exportOptions);
      console.log('✅ ShareAndExportDropdown: Print completed successfully');
    } catch (error) {
      console.error('❌ ShareAndExportDropdown: Print failed:', error);
      toast({
        title: "Print Failed",
        description: "Failed to prepare trip for printing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPrinting(false);
    }
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`bg-white hover:bg-route66-background-alt border-route66-border text-route66-text-primary ${className}`}
        >
          <LogoImage 
            className="w-4 h-4 mr-2 object-contain"
            alt={getRambleLogoAlt()}
          />
          <Share2 className="h-4 w-4 mr-2" />
          Share & Export
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-96 p-4 bg-white border-route66-border shadow-lg">
        <div className="space-y-4">
          {/* Share Section */}
          <ShareActions
            shareUrl={shareUrl}
            onShareTrip={handleShareTrip}
            tripPlan={tripPlan}
            copiedStates={copiedStates}
            onCopyToClipboard={copyToClipboard}
            isSharing={isSharing}
          />

          <Separator className="bg-route66-border" />

          {/* Export Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-route66-text-primary">
              <LogoImage 
                className="w-4 h-4 object-contain"
                alt={getRambleLogoAlt()}
              />
              Export Options
            </div>

            <ExportOptionsForm
              exportOptions={exportOptions}
              onExportOptionsChange={setExportOptions}
              shareUrl={shareUrl}
            />

            <ExportActions
              tripPlan={tripPlan}
              tripStartDate={tripStartDate}
              shareUrl={shareUrl}
              exportOptions={exportOptions}
              onExportToPDF={handleExportToPDF}
              onPrintTrip={handlePrintTrip}
              isExporting={isExporting}
              isPrinting={isPrinting}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareAndExportDropdown;
