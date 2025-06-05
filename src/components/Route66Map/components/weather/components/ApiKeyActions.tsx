
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bug, RefreshCw } from 'lucide-react';

interface ApiKeyActionsProps {
  apiKey: string;
  onTest: () => void;
  onDebug: () => void;
  onClear: () => void;
  onNuclear: () => void;
}

const ApiKeyActions: React.FC<ApiKeyActionsProps> = ({
  apiKey,
  onTest,
  onDebug,
  onClear,
  onNuclear
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
      >
        <Bug className="w-3 h-3" />
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClear}
        className="text-xs"
      >
        <RefreshCw className="w-3 h-3" />
      </Button>
      
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onNuclear}
        className="text-xs"
        title="Switch to Enhanced Version with Nuclear Cleanup"
      >
        💥
      </Button>
    </div>
  );
};

export default ApiKeyActions;
