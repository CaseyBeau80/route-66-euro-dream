
import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ExternalLinkTooltipProps {
  children: React.ReactNode;
  siteName: string;
  showWarning?: boolean;
}

export const ExternalLinkTooltip: React.FC<ExternalLinkTooltipProps> = ({
  children,
  siteName,
  showWarning = true
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-flex items-center">
            {children}
            <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64">
          <div className="flex items-start gap-2">
            {showWarning && <Info className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />}
            <div>
              <p className="font-medium">External Link</p>
              <p className="text-sm opacity-90">
                Opens {siteName} in a new tab. Use your browser's back button or bookmark this page to return to the Route 66 map.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
