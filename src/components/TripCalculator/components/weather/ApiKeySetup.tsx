
import React from 'react';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ShareWeatherConfigService } from '../../services/weather/ShareWeatherConfigService';
import { WeatherConfigValidationService } from '../../services/weather/WeatherConfigValidationService';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({
  onApiKeySet,
  isSharedView = false,
  isPDFExport = false
}) => {
  const [apiKey, setApiKey] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const weatherConfig = React.useMemo(() => {
    return ShareWeatherConfigService.getShareWeatherConfig();
  }, []);

  const configValidation = React.useMemo(() => {
    return WeatherConfigValidationService.validateConfiguration();
  }, []);

  console.log('🔑 ApiKeySetup render:', {
    isSharedView,
    isPDFExport,
    weatherConfig,
    configValidation
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const weatherService = EnhancedWeatherService.getInstance();
      weatherService.setApiKey(apiKey.trim());
      
      console.log('✅ ApiKeySetup: API key set successfully');
      onApiKeySet();
      setApiKey('');
    } catch (err) {
      console.error('❌ ApiKeySetup: Error setting API key:', err);
      setError('Failed to save API key. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced messaging for export/shared views
  if (isSharedView || isPDFExport) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="text-sm text-yellow-800 mb-2">
          📊 {ShareWeatherConfigService.getWeatherStatusMessage(weatherConfig)}
        </div>
        <div className="text-xs text-yellow-600">
          {!configValidation.isValid ? (
            <div className="space-y-2">
              <div>Live weather forecasts require API key configuration.</div>
              {configValidation.recommendations.length > 0 && (
                <div className="mt-2">
                  <strong>To enable live weather:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {configValidation.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="text-xs">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            'Check current weather conditions before departure for the most accurate information.'
          )}
        </div>
      </div>
    );
  }

  // Interactive setup for main application
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">🌤️ Enable Weather Forecasts</h4>
        <p className="text-xs text-blue-600 mb-2">
          Add your OpenWeatherMap API key to see live weather forecasts for your trip.
        </p>
      </div>

      {/* Configuration status */}
      {!configValidation.isValid && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="text-yellow-800 font-medium">Configuration Help:</div>
          <ul className="list-disc list-inside mt-1 text-yellow-700">
            {configValidation.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenWeatherMap API key"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!apiKey.trim() || loading}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save API Key'}
          </button>
          
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Get Free API Key
          </a>
        </div>
      </form>
      
      <div className="mt-3 text-xs text-gray-500">
        Your API key is stored locally and never shared with our servers.
      </div>
    </div>
  );
};

export default ApiKeySetup;
