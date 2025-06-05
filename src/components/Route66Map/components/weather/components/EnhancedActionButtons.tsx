
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bug, Zap } from 'lucide-react';

interface EnhancedActionButtonsProps {
  apiKey: string;
  onTest: () => void;
  onDebug: () => void;
  onNuclearCleanup: () => void;
}

const EnhancedActionButtons: React.FC<EnhancedActionButtonsProps> = ({
  apiKey,
  onTest,
  onDebug,
  onNuclearCleanup
}) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onTest}
        disabled={!apiKey.trim()}
        className="text-xs"
      >
        Test
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onDebug}
        className="text-xs"
        title="Enhanced Debug Info"
      >
        <Bug className="w-3 h-3" />
      </Button>
      
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onNuclearCleanup}
        className="text-xs"
        title="Nuclear Cleanup - Complete Reset"
      >
        <Zap className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default EnhancedActionButtons;
