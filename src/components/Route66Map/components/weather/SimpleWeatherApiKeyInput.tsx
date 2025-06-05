
import React, { useState, useEffect } from 'react';
import { Key, ExternalLink } from 'lucide-react';
import { useApiKeyInput } from './hooks/useApiKeyInput';
import { useApiKeyTest } from './hooks/useApiKeyTest';
import ApiKeyErrorDisplay from './components/ApiKeyErrorDisplay';
import ApiKeyTestResult from './components/ApiKeyTestResult';
import ApiKeyDebugInfo from './components/ApiKeyDebugInfo';
import ApiKeyActions from './components/ApiKeyActions';
import ApiKeyForm from './components/ApiKeyForm';

interface SimpleWeatherApiKeyInputProps {
  onApiKeySet: () => void;
  cityName: string;
}

const SimpleWeatherApiKeyInput: React.FC<SimpleWeatherApiKeyInputProps> = ({ 
  onApiKeySet, 
  cityName 
}) => {
  const {
    apiKey,
    isSubmitting,
    error,
    debugInfo,
    showEnhancedVersion,
    handleInputChange,
    handleSubmit,
    showDebugInfo,
    clearStoredKey,
    switchToEnhancedVersion,
    setError,
    setDebugInfo
  } = useApiKeyInput(onApiKeySet);

  const { testResult, testApiKey, clearTestResult } = useApiKeyTest();

  // Clear test result when input changes
  const handleInputChangeWithClear = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    clearTestResult();
  };

  // Import enhanced version dynamically
  const [EnhancedWeatherApiKeyInput, setEnhancedWeatherApiKeyInput] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Dynamically import enhanced version when needed
    if (showEnhancedVersion && !EnhancedWeatherApiKeyInput) {
      import('./EnhancedWeatherApiKeyInput').then(module => {
        setEnhancedWeatherApiKeyInput(() => module.default);
      });
    }
  }, [showEnhancedVersion, EnhancedWeatherApiKeyInput]);

  if (showEnhancedVersion && EnhancedWeatherApiKeyInput) {
    return <EnhancedWeatherApiKeyInput onApiKeySet={onApiKeySet} cityName={cityName} />;
  }

  const handleTest = () => testApiKey(apiKey);
  const handleClear = () => {
    clearStoredKey();
    clearTestResult();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 text-blue-800">
        <Key className="w-4 h-4" />
        <span className="text-sm font-medium">Weather API Key Required</span>
      </div>
      
      {error && <ApiKeyErrorDisplay error={error} />}
      {testResult && <ApiKeyTestResult testResult={testResult} />}
      
      <ApiKeyForm
        apiKey={apiKey}
        isSubmitting={isSubmitting}
        cityName={cityName}
        onInputChange={handleInputChangeWithClear}
        onSubmit={handleSubmit}
      >
        <ApiKeyActions
          apiKey={apiKey}
          onTest={handleTest}
          onDebug={showDebugInfo}
          onClear={handleClear}
          onNuclear={switchToEnhancedVersion}
        />
      </ApiKeyForm>
      
      {debugInfo && <ApiKeyDebugInfo debugInfo={debugInfo} />}
      
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

export default SimpleWeatherApiKeyInput;
