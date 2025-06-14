
export interface ApiKeyDetectionResult {
  hasApiKey: boolean;
  keySource: 'config-file' | 'localStorage' | 'legacy-storage' | 'none';
  keyLength: number;
  isValid: boolean;
  confidence: 'high' | 'medium' | 'low';
  debugInfo: {
    configFileCheck: boolean;
    localStorageCheck: boolean;
    legacyStorageCheck: boolean;
    validationPassed: boolean;
  };
}

export class EnhancedApiKeyDetector {
  private static readonly STORAGE_KEYS = [
    'weather_api_key',
    'openweathermap_api_key',
    'openWeatherMapApiKey',
    'openweather_api_key'
  ];

  static detectApiKey(): ApiKeyDetectionResult {
    console.log('🔍 PLAN: EnhancedApiKeyDetector starting comprehensive detection');
    
    const result: ApiKeyDetectionResult = {
      hasApiKey: false,
      keySource: 'none',
      keyLength: 0,
      isValid: false,
      confidence: 'low',
      debugInfo: {
        configFileCheck: false,
        localStorageCheck: false,
        legacyStorageCheck: false,
        validationPassed: false
      }
    };

    // 1. Check localStorage (primary)
    for (const key of this.STORAGE_KEYS) {
      const storedKey = localStorage.getItem(key);
      if (storedKey && this.isValidApiKey(storedKey)) {
        result.hasApiKey = true;
        result.keySource = key === 'weather_api_key' ? 'localStorage' : 'legacy-storage';
        result.keyLength = storedKey.length;
        result.isValid = true;
        result.confidence = 'high';
        result.debugInfo.localStorageCheck = true;
        result.debugInfo.validationPassed = true;
        
        console.log('✅ PLAN: Found valid API key in localStorage:', {
          source: key,
          length: storedKey.length,
          confidence: 'high'
        });
        
        return result;
      }
    }

    // 2. Check config file (fallback)
    try {
      const configKey = process.env.REACT_APP_WEATHER_API_KEY || 
                       (window as any).WEATHER_API_KEY || 
                       localStorage.getItem('config_weather_key');
      
      if (configKey && this.isValidApiKey(configKey)) {
        result.hasApiKey = true;
        result.keySource = 'config-file';
        result.keyLength = configKey.length;
        result.isValid = true;
        result.confidence = 'medium';
        result.debugInfo.configFileCheck = true;
        result.debugInfo.validationPassed = true;
        
        console.log('✅ PLAN: Found valid API key in config:', {
          length: configKey.length,
          confidence: 'medium'
        });
        
        return result;
      }
    } catch (error) {
      console.warn('⚠️ PLAN: Config key check failed:', error);
    }

    console.log('❌ PLAN: No valid API key detected in any source');
    return result;
  }

  private static isValidApiKey(key: string): boolean {
    if (!key || typeof key !== 'string') return false;
    
    const trimmed = key.trim();
    
    // Check length (OpenWeather keys are typically 32 characters)
    if (trimmed.length < 10 || trimmed.length > 100) return false;
    
    // Check for placeholder patterns
    const placeholders = [
      'your_api_key',
      'placeholder',
      'example',
      'test_key',
      'demo_key'
    ];
    
    const lowerKey = trimmed.toLowerCase();
    for (const placeholder of placeholders) {
      if (lowerKey.includes(placeholder)) return false;
    }
    
    return true;
  }

  static logDetectionResult(result: ApiKeyDetectionResult, context: string): void {
    console.log(`🔍 PLAN: API Key Detection Result [${context}]:`, {
      hasApiKey: result.hasApiKey,
      keySource: result.keySource,
      keyLength: result.keyLength,
      isValid: result.isValid,
      confidence: result.confidence,
      debugInfo: result.debugInfo
    });
  }
}
