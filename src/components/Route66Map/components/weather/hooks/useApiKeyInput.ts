
import { useState, useEffect } from 'react';
import { WeatherService } from '../../../services/WeatherService';

export const useApiKeyInput = (onApiKeySet: () => void) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showEnhancedVersion, setShowEnhancedVersion] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('🔤 SimpleWeatherApiKeyInput: Input changed:', {
      length: value.length,
      firstChar: value[0] || 'none',
      lastChar: value[value.length - 1] || 'none',
      hasSpaces: value.includes(' '),
      trimmedLength: value.trim().length
    });
    setApiKey(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    console.log('🔑 SimpleWeatherApiKeyInput: === SUBMIT SESSION START ===');
    console.log('🔑 Original input:', {
      originalLength: apiKey.length,
      trimmedLength: apiKey.trim().length,
      firstChar: apiKey[0] || 'none',
      lastChar: apiKey[apiKey.length - 1] || 'none',
      preview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
    });

    setIsSubmitting(true);
    setError(null);
    
    try {
      const weatherService = WeatherService.getInstance();
      
      // Validate length before setting
      const trimmedKey = apiKey.trim();
      if (trimmedKey.length < 10) {
        throw new Error(`API key is too short (${trimmedKey.length} characters). OpenWeatherMap API keys are typically 32 characters long.`);
      }
      
      if (trimmedKey.length > 50) {
        throw new Error(`API key is too long (${trimmedKey.length} characters). Please check for extra characters.`);
      }
      
      // Set the API key
      console.log('🔑 Setting API key in WeatherService...');
      weatherService.setApiKey(trimmedKey);
      
      // Immediate verification
      const verificationInfo = weatherService.getDebugInfo();
      console.log('🔍 Immediate verification:', verificationInfo);
      
      // Check localStorage directly
      const storedKey = localStorage.getItem('openweathermap_api_key');
      console.log('🔍 Direct localStorage verification:', {
        stored: storedKey,
        storedLength: storedKey?.length || 0,
        matches: storedKey === trimmedKey
      });
      
      if (!verificationInfo.hasKey || verificationInfo.keyLength !== trimmedKey.length) {
        console.error('❌ Storage verification failed!', verificationInfo);
        throw new Error('API key was not stored correctly. Try using the enhanced version (Nuclear button).');
      }
      
      console.log('✅ API key set and verified successfully');
      console.log('🔑 SimpleWeatherApiKeyInput: === SUBMIT SESSION END ===');
      
      onApiKeySet();
    } catch (error) {
      console.error('❌ SimpleWeatherApiKeyInput: Error setting API key:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to set API key';
      setError(errorMessage);
      
      // Suggest enhanced version for persistent issues
      if (errorMessage.includes('not stored correctly')) {
        setError(errorMessage + ' Please try the Nuclear cleanup button below.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDebugInfo = () => {
    console.log('🔍 SimpleWeatherApiKeyInput: === FULL DEBUG SESSION START ===');
    
    const weatherService = WeatherService.getInstance();
    const info = weatherService.getDebugInfo();
    setDebugInfo(info);
    
    // Check localStorage directly
    const directCheck = localStorage.getItem('openweathermap_api_key');
    console.log('🔍 Direct localStorage check:', {
      key: 'openweathermap_api_key',
      value: directCheck,
      length: directCheck?.length || 0
    });
    
    // Check all possible storage keys
    const allKeys = ['openweathermap_api_key', 'weather_api_key', 'openweather_api_key', 'owm_api_key'];
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`🔍 Storage check [${key}]:`, {
        value: value,
        length: value?.length || 0,
        exists: !!value
      });
    });
    
    console.log('🔍 WeatherService debug info:', info);
    console.log('🔍 SimpleWeatherApiKeyInput: === DEBUG SESSION END ===');
  };

  const clearStoredKey = () => {
    console.log('🧹 SimpleWeatherApiKeyInput: Clearing all stored API keys');
    const keysToRemove = ['openweathermap_api_key', 'weather_api_key', 'openweather_api_key', 'owm_api_key'];
    
    keysToRemove.forEach(key => {
      const existing = localStorage.getItem(key);
      if (existing) {
        console.log(`🧹 Removing key: ${key} (value: ${existing})`);
        localStorage.removeItem(key);
      }
    });
    
    setApiKey('');
    setError(null);
    setDebugInfo(null);
    console.log('✅ All storage cleared');
  };

  const switchToEnhancedVersion = () => {
    console.log('💥 Switching to enhanced version for better corruption handling');
    setShowEnhancedVersion(true);
  };

  return {
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
  };
};
