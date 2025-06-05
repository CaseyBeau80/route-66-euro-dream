
export class EnhancedWeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';
  private static readonly FALLBACK_STORAGE_KEYS = [
    'weather_api_key',
    'openweather_api_key',
    'owm_api_key'
  ];
  
  private apiKey: string | null = null;
  private lastValidationResult: { isValid: boolean; reason?: string } | null = null;

  constructor() {
    this.performStartupCleanup();
  }

  // Enhanced startup cleanup with corruption detection
  private performStartupCleanup(): void {
    console.log('🔧 EnhancedWeatherApiKeyManager: Starting comprehensive startup cleanup...');
    
    // Check all storage locations for corrupted keys
    const allKeys = [EnhancedWeatherApiKeyManager.STORAGE_KEY, ...EnhancedWeatherApiKeyManager.FALLBACK_STORAGE_KEYS];
    let foundCorruption = false;
    
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        const corruption = this.detectCorruption(value, key);
        if (corruption.isCorrupted) {
          console.warn(`🚨 CORRUPTION DETECTED in ${key}:`, corruption);
          localStorage.removeItem(key);
          foundCorruption = true;
        }
      }
    });
    
    if (foundCorruption) {
      console.log('🧹 EnhancedWeatherApiKeyManager: Corrupted keys automatically removed during startup');
    }
    
    this.refreshApiKey();
  }

  // Corruption detection with detailed analysis
  private detectCorruption(value: string, storageKey: string): { isCorrupted: boolean; reason?: string; details?: any } {
    const analysis = {
      length: value.length,
      trimmedLength: value.trim().length,
      hasWhitespace: value !== value.trim(),
      firstChar: value[0] || 'none',
      lastChar: value[value.length - 1] || 'none',
      containsSpecialChars: /[^a-zA-Z0-9]/.test(value),
      isAllSameChar: value.length > 1 && value.split('').every(char => char === value[0])
    };

    // Detection rules for corruption
    if (value.length === 0) {
      return { isCorrupted: true, reason: 'Empty key', details: analysis };
    }
    
    if (value.length === 1) {
      return { isCorrupted: true, reason: 'Single character key', details: analysis };
    }
    
    if (value.length < 10) {
      return { isCorrupted: true, reason: 'Too short (less than 10 chars)', details: analysis };
    }
    
    if (value.length > 50) {
      return { isCorrupted: true, reason: 'Too long (over 50 chars)', details: analysis };
    }
    
    if (analysis.isAllSameChar) {
      return { isCorrupted: true, reason: 'All same character', details: analysis };
    }
    
    if (value.includes('undefined') || value.includes('null')) {
      return { isCorrupted: true, reason: 'Contains null/undefined', details: analysis };
    }

    return { isCorrupted: false, details: analysis };
  }

  refreshApiKey(): void {
    console.log('🔍 EnhancedWeatherApiKeyManager: Starting enhanced API key refresh...');
    
    // First try the primary storage key
    this.apiKey = localStorage.getItem(EnhancedWeatherApiKeyManager.STORAGE_KEY);
    
    if (this.apiKey) {
      const corruption = this.detectCorruption(this.apiKey, EnhancedWeatherApiKeyManager.STORAGE_KEY);
      if (corruption.isCorrupted) {
        console.warn(`🚨 PRIMARY KEY CORRUPTION DETECTED:`, corruption);
        localStorage.removeItem(EnhancedWeatherApiKeyManager.STORAGE_KEY);
        this.apiKey = null;
      }
    }
    
    // If primary key is corrupted or missing, try fallbacks
    if (!this.apiKey) {
      console.log('🔍 EnhancedWeatherApiKeyManager: Checking fallback keys...');
      for (const fallbackKey of EnhancedWeatherApiKeyManager.FALLBACK_STORAGE_KEYS) {
        const fallbackValue = localStorage.getItem(fallbackKey);
        if (fallbackValue) {
          const corruption = this.detectCorruption(fallbackValue, fallbackKey);
          if (!corruption.isCorrupted) {
            console.log(`🔑 Valid key found in fallback: ${fallbackKey}`);
            this.apiKey = fallbackValue;
            // Migrate to primary key
            localStorage.setItem(EnhancedWeatherApiKeyManager.STORAGE_KEY, fallbackValue);
            localStorage.removeItem(fallbackKey);
            break;
          } else {
            console.warn(`🚨 FALLBACK KEY CORRUPTION DETECTED in ${fallbackKey}:`, corruption);
            localStorage.removeItem(fallbackKey);
          }
        }
      }
    }
    
    console.log('🔑 EnhancedWeatherApiKeyManager: Refresh complete:', {
      hasValidKey: !!this.apiKey,
      keyLength: this.apiKey?.length || 0
    });
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 EnhancedWeatherApiKeyManager: Setting new API key with enhanced validation...');
    
    const trimmedKey = apiKey.trim();
    
    // Pre-validation corruption check
    const corruption = this.detectCorruption(trimmedKey, 'input');
    if (corruption.isCorrupted) {
      const errorMessage = `Invalid API key: ${corruption.reason}`;
      console.error('❌ EnhancedWeatherApiKeyManager:', errorMessage, corruption.details);
      throw new Error(errorMessage);
    }
    
    // Store the key with immediate verification
    this.apiKey = trimmedKey;
    localStorage.setItem(EnhancedWeatherApiKeyManager.STORAGE_KEY, trimmedKey);
    
    // Immediate verification
    const storedKey = localStorage.getItem(EnhancedWeatherApiKeyManager.STORAGE_KEY);
    if (storedKey !== trimmedKey) {
      console.error('❌ EnhancedWeatherApiKeyManager: Storage verification failed!');
      throw new Error('Failed to store API key properly');
    }
    
    // Validate the stored key for corruption
    const storedCorruption = this.detectCorruption(storedKey, EnhancedWeatherApiKeyManager.STORAGE_KEY);
    if (storedCorruption.isCorrupted) {
      console.error('❌ EnhancedWeatherApiKeyManager: Stored key became corrupted!', storedCorruption);
      throw new Error('API key became corrupted during storage');
    }
    
    this.lastValidationResult = { isValid: true };
    console.log('✅ EnhancedWeatherApiKeyManager: API key set and verified successfully');
  }

  hasApiKey(): boolean {
    this.refreshApiKey();
    const hasKey = !!this.apiKey && this.apiKey.length > 0;
    
    if (this.apiKey) {
      const corruption = this.detectCorruption(this.apiKey, 'cached');
      if (corruption.isCorrupted) {
        console.warn('🚨 Cached key is corrupted, clearing...', corruption);
        this.performNuclearCleanup();
        return false;
      }
    }
    
    return hasKey;
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.refreshApiKey();
    }
    
    if (this.apiKey) {
      const corruption = this.detectCorruption(this.apiKey, 'retrieval');
      if (corruption.isCorrupted) {
        console.warn('🚨 API key corrupted during retrieval, performing cleanup...', corruption);
        this.performNuclearCleanup();
        return null;
      }
    }
    
    return this.apiKey;
  }

  validateApiKey(): boolean {
    if (!this.apiKey) {
      this.lastValidationResult = { isValid: false, reason: 'No API key available' };
      return false;
    }
    
    const corruption = this.detectCorruption(this.apiKey, 'validation');
    if (corruption.isCorrupted) {
      this.lastValidationResult = { isValid: false, reason: corruption.reason };
      console.warn('❌ EnhancedWeatherApiKeyManager: Validation failed due to corruption:', corruption);
      this.performNuclearCleanup();
      return false;
    }
    
    this.lastValidationResult = { isValid: true };
    return true;
  }

  // Nuclear cleanup option - complete reset
  performNuclearCleanup(): void {
    console.log('💥 EnhancedWeatherApiKeyManager: PERFORMING NUCLEAR CLEANUP');
    
    this.apiKey = null;
    this.lastValidationResult = null;
    
    // Clear all possible storage locations
    const allPossibleKeys = [
      EnhancedWeatherApiKeyManager.STORAGE_KEY,
      ...EnhancedWeatherApiKeyManager.FALLBACK_STORAGE_KEYS,
      'weather-api-key',
      'openweathermap-api-key',
      'api_key_weather',
      'owm-api-key'
    ];
    
    allPossibleKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        console.log(`💥 Removing storage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ EnhancedWeatherApiKeyManager: Nuclear cleanup completed');
  }

  // Enhanced debug info with corruption analysis
  getEnhancedDebugInfo(): {
    hasKey: boolean;
    keyLength: number | null;
    keyPreview: string | null;
    lastValidation: { isValid: boolean; reason?: string } | null;
    corruptionAnalysis: any | null;
    storageAnalysis: any[];
  } {
    this.refreshApiKey();
    
    const corruptionAnalysis = this.apiKey ? this.detectCorruption(this.apiKey, 'debug') : null;
    
    // Analyze all storage locations
    const storageAnalysis = [EnhancedWeatherApiKeyManager.STORAGE_KEY, ...EnhancedWeatherApiKeyManager.FALLBACK_STORAGE_KEYS]
      .map(key => {
        const value = localStorage.getItem(key);
        return {
          key,
          hasValue: value !== null,
          length: value?.length || 0,
          corruption: value ? this.detectCorruption(value, key) : null
        };
      });
    
    return {
      hasKey: !!this.apiKey,
      keyLength: this.apiKey?.length || null,
      keyPreview: this.apiKey ? `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}` : null,
      lastValidation: this.lastValidationResult,
      corruptionAnalysis,
      storageAnalysis
    };
  }
}
