
import { useState } from 'react';

export const useApiKeyTest = () => {
  const [testResult, setTestResult] = useState<string | null>(null);

  const testApiKey = async (apiKey: string) => {
    if (!apiKey.trim()) {
      setTestResult('❌ No API key to test');
      return;
    }
    
    console.log('🧪 Testing API key:', {
      length: apiKey.length,
      preview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
    });
    
    try {
      // Make a direct test call to OpenWeatherMap API
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

  const clearTestResult = () => {
    setTestResult(null);
  };

  return {
    testResult,
    testApiKey,
    clearTestResult
  };
};
