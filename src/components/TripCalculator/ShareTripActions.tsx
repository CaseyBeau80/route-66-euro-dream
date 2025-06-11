
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import ShareButton from './components/share/ShareButton';

interface ShareTripActionsProps {
  shareUrl?: string | null;
  tripTitle: string;
}

const ShareTripActions: React.FC<ShareTripActionsProps> = ({ shareUrl, tripTitle }) => {
  const handleExportPDF = () => {
    // Simple PDF export using browser print
    window.print();
  };

  if (!shareUrl) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6 p-4 bg-route66-vintage-beige rounded-lg border border-route66-tan">
      <ShareButton
        shareUrl={shareUrl}
        tripTitle={tripTitle}
        className="bg-route66-primary hover:bg-route66-rust text-white font-bold px-4 py-2 rounded-lg"
      />
      
      <Button
        onClick={handleExportPDF}
        variant="outline"
        className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
      >
        <Download className="w-4 h-4" />
        Export PDF
      </Button>
    </div>
  );
};

export default ShareTripActions;
