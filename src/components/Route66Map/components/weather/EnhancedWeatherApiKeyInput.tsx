
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnhancedWeatherService } from '../../services/weather/EnhancedWeatherService';
import { Key, ExternalLink, AlertTriangle, RefreshCw, Bug, Zap, Shield } from 'lucide-react';

interface EnhancedWeatherApiKeyInputProps {
  onApiKeySet: () => void;
  cityName: string;
}

const EnhancedWeatherApiKeyInput: React.FC<EnhancedWeatherApiKeyInputProps> = ({ 
  onApiKeySet, 
  cityName 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedDebugInfo, setEnhancedDebugInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [autoCleanupPerformed, setAutoCleanupPerformed] = useState(false);

  const weatherService = EnhancedWeatherService.getInstance();

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
    setTestResult(null);
    setAutoCleanupPerformed(true);
    console.log('✅ Nuclear cleanup completed');
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult('❌ No API key to test');
      return;
    }
    
    console.log('🧪 Testing API key:', {
      length: apiKey.length,
      preview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
    });
    
    try {
      const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=${apiKey.trim()}&units=imperial`;
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API key test successful:', data);
        setTestResult('✅ API key is valid and working!');
      } else {
        const errorText = await response.text();
        console.error('❌ API key test failed:', response.status, errorText);
        setTestResult(`❌ API key test failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ API key test error:', error);
      setTestResult(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    setError(null);
    setTestResult(null);
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
      // Enhanced submission with automatic corruption handling
      weatherService.setApiKey(apiKey.trim());
      
      // Immediate verification with enhanced debug info
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

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 text-blue-800">
        <Key className="w-4 h-4" />
        <span className="text-sm font-medium">Enhanced Weather API Key Manager</span>
        <Shield className="w-4 h-4 text-green-600" />
      </div>
      
      {autoCleanupPerformed && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-green-800">
          <Zap className="w-4 h-4" />
          <span className="text-xs">Nuclear cleanup performed! Please enter your API key again.</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}
      
      {testResult && (
        <div className="p-2 bg-gray-50 border border-gray-200 rounded text-gray-800">
          <span className="text-xs font-mono">{testResult}</span>
        </div>
      )}
      
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
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={testApiKey}
            disabled={!apiKey.trim()}
            className="text-xs"
          >
            Test
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={showEnhancedDebugInfo}
            className="text-xs"
            title="Enhanced Debug Info"
          >
            <Bug className="w-3 h-3" />
          </Button>
          
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={performNuclearCleanup}
            className="text-xs"
            title="Nuclear Cleanup - Complete Reset"
          >
            <Zap className="w-3 h-3" />
          </Button>
        </div>
      </form>
      
      {enhancedDebugInfo && (
        <div className="bg-gray-100 rounded p-2 text-xs space-y-1">
          <div className="font-semibold text-gray-700">Enhanced Debug Info:</div>
          <div>Has Key: {enhancedDebugInfo.hasKey ? 'Yes' : 'No'}</div>
          <div>Key Length: {enhancedDebugInfo.keyLength || 'None'}</div>
          {enhancedDebugInfo.keyPreview && <div>Preview: {enhancedDebugInfo.keyPreview}</div>}
          
          {enhancedDebugInfo.corruptionAnalysis && (
            <div className="mt-2">
              <div className="font-semibold">Corruption Analysis:</div>
              <div>Is Corrupted: {enhancedDebugInfo.corruptionAnalysis.isCorrupted ? 'Yes' : 'No'}</div>
              {enhancedDebugInfo.corruptionAnalysis.reason && (
                <div>Reason: {enhancedDebugInfo.corruptionAnalysis.reason}</div>
              )}
            </div>
          )}
          
          {enhancedDebugInfo.storageAnalysis && (
            <div className="mt-2">
              <div className="font-semibold">Storage Analysis:</div>
              {enhancedDebugInfo.storageAnalysis.map((storage: any, index: number) => (
                <div key={index}>
                  {storage.key}: {storage.hasValue ? `${storage.length} chars` : 'empty'} 
                  {storage.corruption?.isCorrupted && ` (CORRUPTED: ${storage.corruption.reason})`}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
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
