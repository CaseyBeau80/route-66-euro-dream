
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, ExternalLink, Shield } from 'lucide-react';
import { useEnhancedApiKeyInput } from './hooks/useEnhancedApiKeyInput';
import EnhancedStatusMessages from './components/EnhancedStatusMessages';
import EnhancedActionButtons from './components/EnhancedActionButtons';
import EnhancedDebugInfoDisplay from './components/EnhancedDebugInfoDisplay';

interface EnhancedWeatherApiKeyInputProps {
  onApiKeySet: () => void;
  cityName: string;
}

const EnhancedWeatherApiKeyInput: React.FC<EnhancedWeatherApiKeyInputProps> = ({ 
  onApiKeySet, 
  cityName 
}) => {
  const {
    apiKey,
    isSubmitting,
    error,
    enhancedDebugInfo,
    autoCleanupPerformed,
    testResult,
    handleInputChange,
    handleSubmit,
    showEnhancedDebugInfo,
    performNuclearCleanup,
    testCurrentApiKey
  } = useEnhancedApiKeyInput(onApiKeySet);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 text-blue-800">
        <Key className="w-4 h-4" />
        <span className="text-sm font-medium">Enhanced Weather API Key Manager</span>
        <Shield className="w-4 h-4 text-green-600" />
      </div>
      
      <EnhancedStatusMessages 
        autoCleanupPerformed={autoCleanupPerformed}
        error={error}
        testResult={testResult}
      />
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          placeholder="Enter OpenWeatherMap API key (32 characters)"
          value={apiKey}
          onChange={handleInputChange}
          className="text-sm font-mono"
          disabled={isSubmitting}
          maxLength={50}
        />
        
        <div className="text-xs text-gray-600">
          {apiKey.length > 0 && (
            <span>Length: {apiKey.length} characters | Trimmed: {apiKey.trim().length}</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            size="sm" 
            disabled={!apiKey.trim() || isSubmitting}
            className="flex-1 text-xs"
          >
            {isSubmitting ? 'Setting up...' : `Enable Weather for ${cityName}`}
          </Button>
          
          <EnhancedActionButtons
            apiKey={apiKey}
            onTest={testCurrentApiKey}
            onDebug={showEnhancedDebugInfo}
            onNuclearCleanup={performNuclearCleanup}
          />
        </div>
      </form>
      
      <EnhancedDebugInfoDisplay enhancedDebugInfo={enhancedDebugInfo} />
      
      <a
        href="https://openweathermap.org/api"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
      >
        Get Free API Key <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};

export default EnhancedWeatherApiKeyInput;
