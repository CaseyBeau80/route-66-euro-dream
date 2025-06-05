
import { useState } from 'react';
import { EnhancedWeatherService } from '../../../services/weather/EnhancedWeatherService';
import { useApiKeyTest } from './useApiKeyTest';

export const useEnhancedApiKeyInput = (onApiKeySet: () => void) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedDebugInfo, setEnhancedDebugInfo] = useState<any>(null);
  const [autoCleanupPerformed, setAutoCleanupPerformed] = useState(false);

  const { testResult, testApiKey, clearTestResult } = useApiKeyTest();
  const weatherService = EnhancedWeatherService.getInstance();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    setError(null);
    clearTestResult();
    setAutoCleanupPerformed(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    console.log('🔑 EnhancedWeatherApiKeyInput: === ENHANCED SUBMIT SESSION START ===');

    setIsSubmitting(true);
    setError(null);
    
    try {
      weatherService.setApiKey(apiKey.trim());
      
      const verificationInfo = weatherService.getEnhancedDebugInfo();
      console.log('🔍 Enhanced verification:', verificationInfo);
      
      if (!verificationInfo.hasKey || verificationInfo.corruptionAnalysis?.isCorrupted) {
        console.error('❌ Enhanced verification failed!', verificationInfo);
        throw new Error('API key validation failed after storage. Please try again.');
      }
      
      console.log('✅ Enhanced API key set and verified successfully');
      console.log('🔑 EnhancedWeatherApiKeyInput: === ENHANCED SUBMIT SESSION END ===');
      
      onApiKeySet();
    } catch (error) {
      console.error('❌ EnhancedWeatherApiKeyInput: Error setting API key:', error);
      setError(error instanceof Error ? error.message : 'Failed to set API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showEnhancedDebugInfo = () => {
    console.log('🔍 EnhancedWeatherApiKeyInput: === ENHANCED DEBUG SESSION START ===');
    
    const info = weatherService.getEnhancedDebugInfo();
    setEnhancedDebugInfo(info);
    
    console.log('🔍 Enhanced debug info:', info);
    console.log('🔍 EnhancedWeatherApiKeyInput: === ENHANCED DEBUG SESSION END ===');
  };

  const performNuclearCleanup = () => {
    console.log('💥 EnhancedWeatherApiKeyInput: Performing nuclear cleanup');
    weatherService.performNuclearCleanup();
    setApiKey('');
    setError(null);
    setEnhancedDebugInfo(null);
    clearTestResult();
    setAutoCleanupPerformed(true);
    console.log('✅ Nuclear cleanup completed');
  };

  const testCurrentApiKey = () => testApiKey(apiKey);

  return {
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
  };
};
