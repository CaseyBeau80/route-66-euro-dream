
import { StorageCleanupService } from './StorageCleanupService';
import { ApiKeyValidationService, ValidationResult } from './ApiKeyValidationService';
import { ApiKeyRetrievalService } from './ApiKeyRetrievalService';
import { DebugInfoService, EnhancedDebugInfo } from './DebugInfoService';

export class EnhancedWeatherApiKeyManager {
  private apiKey: string | null = null;
  private lastValidationResult: ValidationResult | null = null;
  private keySource: 'config-file' | 'localStorage' | 'legacy-storage' | 'none' = 'none';
  private lastRefreshTime: number = 0;
  private refreshCooldown: number = 1000; // 1 second cooldown

  constructor() {
    this.performStartupCleanup();
  }

  private performStartupCleanup(): void {
    StorageCleanupService.performStartupCleanup();
    this.refreshApiKey();
  }

  refreshApiKey(): void {
    // Prevent excessive refreshes
    const now = Date.now();
    if (now - this.lastRefreshTime < this.refreshCooldown) {
      console.log('🔄 EnhancedWeatherApiKeyManager: Skipping refresh due to cooldown');
      return;
    }
    
    console.log('🔄 EnhancedWeatherApiKeyManager: Refreshing API key with enhanced detection');
    this.apiKey = ApiKeyRetrievalService.refreshApiKey();
    this.keySource = ApiKeyRetrievalService.getKeySource(this.apiKey);
    this.lastRefreshTime = now;
    
    console.log('🔍 EnhancedWeatherApiKeyManager: Key refresh result:', {
      hasKey: !!this.apiKey,
      keySource: this.keySource,
      keyLength: this.apiKey?.length || 0,
      keyPreview: this.apiKey ? this.apiKey.substring(0, 8) + '...' : 'none'
    });
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 EnhancedWeatherApiKeyManager: Setting new API key with enhanced validation...');
    
    if (!ApiKeyRetrievalService.storeApiKey(apiKey)) {
      throw new Error('Invalid API key provided');
    }
    
    this.apiKey = apiKey.trim();
    this.keySource = 'localStorage';
    this.lastValidationResult = { isValid: true };
    this.lastRefreshTime = Date.now();
    
    console.log('✅ EnhancedWeatherApiKeyManager: API key set successfully');
  }

  hasApiKey(): boolean {
    // Only refresh if we don't have a key or it's been a while
    if (!this.apiKey || (Date.now() - this.lastRefreshTime > 5000)) {
      this.refreshApiKey();
    }
    
    const hasKey = !!this.apiKey && this.apiKey.length > 0;
    
    console.log('🔍 EnhancedWeatherApiKeyManager: API key check:', {
      hasKey,
      keySource: this.keySource,
      keyLength: this.apiKey?.length || 0
    });
    
    return hasKey;
  }

  getApiKey(): string | null {
    // Only refresh if we don't have a key
    if (!this.apiKey) {
      this.refreshApiKey();
    }
    return this.apiKey;
  }

  getKeySource(): 'config-file' | 'localStorage' | 'legacy-storage' | 'none' {
    return this.keySource;
  }

  validateApiKey(): boolean {
    if (!this.apiKey) {
      this.refreshApiKey();
    }
    
    const validation = ApiKeyValidationService.validateApiKey(this.apiKey, 'validation');
    this.lastValidationResult = validation;
    
    if (!validation.isValid) {
      console.warn('❌ EnhancedWeatherApiKeyManager: Validation failed:', validation);
      return false;
    }
    
    return true;
  }

  performNuclearCleanup(): void {
    console.log('💥 EnhancedWeatherApiKeyManager: PERFORMING NUCLEAR CLEANUP');
    
    this.apiKey = null;
    this.keySource = 'none';
    this.lastValidationResult = null;
    this.lastRefreshTime = 0;
    StorageCleanupService.performNuclearCleanup();
    
    console.log('✅ EnhancedWeatherApiKeyManager: Nuclear cleanup completed');
  }

  getEnhancedDebugInfo(): EnhancedDebugInfo {
    const debugInfo = DebugInfoService.getEnhancedDebugInfo(this.apiKey, this.lastValidationResult);
    
    return {
      ...debugInfo,
      keySource: this.keySource,
      managerInitialized: true
    };
  }
}
