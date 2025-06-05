
import React from 'react';
import { Zap } from 'lucide-react';
import ApiKeyInput from './ApiKeyInput';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface ApiKeySectionProps {
  showApiKeyInput: boolean;
  onApiKeySet: () => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  showApiKeyInput,
  onApiKeySet
}) => {
  const hasApiKey = GoogleDistanceMatrixService.isAvailable();

  return (
    <>
      {/* API Key Configuration */}
      {(!hasApiKey || showApiKeyInput) && (
        <ApiKeyInput onApiKeySet={onApiKeySet} />
      )}

      {/* Enhanced Features Notice */}
      {hasApiKey && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
            <Zap className="w-5 h-5" />
            Enhanced Mode Activated
          </div>
          <p className="text-sm text-green-600">
            Using Google Maps for accurate driving distances and real travel times!
          </p>
        </div>
      )}
    </>
  );
};

export default ApiKeySection;
