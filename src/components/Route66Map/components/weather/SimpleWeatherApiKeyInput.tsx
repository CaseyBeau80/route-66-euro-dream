
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
  console.log('🔑 SimpleWeatherApiKeyInput: Rendering for', cityName);

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
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 text-blue-800">
        <Key className="w-5 h-5" />
        <span className="text-base font-semibold">Weather API Key Required</span>
      </div>
      
      <div className="bg-blue-100 border border-blue-200 rounded p-3">
        <p className="text-sm text-blue-700 font-medium mb-2">
          🌤️ Get live weather forecasts for {cityName}
        </p>
        <p className="text-xs text-blue-600">
          Enter your free OpenWeatherMap API key below to see current weather and 5-day forecasts.
        </p>
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
      
      <div className="border-t border-blue-200 pt-3">
        <a
          href="https://openweathermap.org/api"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Get Free API Key at OpenWeatherMap
        </a>
        <p className="text-xs text-blue-500 mt-2">
          • Free tier includes 1,000 API calls per day<br/>
          • No credit card required for basic plan<br/>
          • Takes 10-15 minutes to activate after signup
        </p>
      </div>
    </div>
  );
};

export default SimpleWeatherApiKeyInput;
