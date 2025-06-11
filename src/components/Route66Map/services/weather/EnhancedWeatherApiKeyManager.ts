
import { StorageCleanupService } from './StorageCleanupService';
import { ApiKeyValidationService, ValidationResult } from './ApiKeyValidationService';
import { ApiKeyRetrievalService } from './ApiKeyRetrievalService';
import { DebugInfoService, EnhancedDebugInfo } from './DebugInfoService';

export class EnhancedWeatherApiKeyManager {
  private apiKey: string | null = null;
  private lastValidationResult: ValidationResult | null = null;
  private keySource: 'config-file' | 'localStorage' | 'legacy-storage' | 'none' = 'none';

  constructor() {
    this.performStartupCleanup();
  }

  private performStartupCleanup(): void {
    StorageCleanupService.performStartupCleanup();
    this.refreshApiKey();
  }

  refreshApiKey(): void {
    console.log('🔄 EnhancedWeatherApiKeyManager: Refreshing API key with enhanced detection');
    this.apiKey = ApiKeyRetrievalService.refreshApiKey();
    this.keySource = ApiKeyRetrievalService.getKeySource(this.apiKey);
    
    console.log('🔍 EnhancedWeatherApiKeyManager: Key refresh result:', {
      hasKey: !!this.apiKey,
      keySource: this.keySource,
      keyLength: this.apiKey?.length || 0,
      keyPreview: this.apiKey ? this.apiKey.substring(0, 8) + '...' : 'none'
    });
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 EnhancedWeatherApiKeyManager: Setting new API key with enhanced validation...');
    
    const primaryKey = StorageCleanupService.getPrimaryStorageKey();
    ApiKeyValidationService.validateAndStoreApiKey(apiKey, primaryKey);
    
    this.apiKey = apiKey.trim();
    this.keySource = 'localStorage';
    this.lastValidationResult = { isValid: true };
    
    console.log('✅ EnhancedWeatherApiKeyManager: API key set successfully');
  }

  hasApiKey(): boolean {
    // FIXED: Don't always refresh on hasApiKey check to avoid infinite loops
    if (!this.apiKey) {
      this.refreshApiKey();
    }
    
    const hasKey = !!this.apiKey && this.apiKey.length > 0;
    
    if (this.apiKey) {
      const validation = ApiKeyValidationService.validateApiKey(this.apiKey, 'cached');
      if (!validation.isValid) {
        console.warn('🚨 Cached key is corrupted, clearing...', validation);
        this.performNuclearCleanup();
        return false;
      }
    }
    
    console.log('🔍 EnhancedWeatherApiKeyManager: API key check:', {
      hasKey,
      keySource: this.keySource,
      keyLength: this.apiKey?.length || 0
    });
    
    return hasKey;
  }

  getApiKey(): string | null {
    // FIXED: Only refresh if we don't have a key to avoid excessive calls
    if (!this.apiKey) {
      this.apiKey = ApiKeyRetrievalService.getApiKeyWithCorruptionCheck(this.apiKey);
      this.keySource = ApiKeyRetrievalService.getKeySource(this.apiKey);
    }
    return this.apiKey;
  }

  getKeySource(): 'config-file' | 'localStorage' | 'legacy-storage' | 'none' {
    return this.keySource;
  }

  validateApiKey(): boolean {
    const validation = ApiKeyValidationService.validateApiKey(this.apiKey, 'validation');
    this.lastValidationResult = validation;
    
    if (!validation.isValid) {
      console.warn('❌ EnhancedWeatherApiKeyManager: Validation failed:', validation);
      this.performNuclearCleanup();
      return false;
    }
    
    return true;
  }

  performNuclearCleanup(): void {
    console.log('💥 EnhancedWeatherApiKeyManager: PERFORMING NUCLEAR CLEANUP');
    
    this.apiKey = null;
    this.keySource = 'none';
    this.lastValidationResult = null;
    StorageCleanupService.performNuclearCleanup();
    
    console.log('✅ EnhancedWeatherApiKeyManager: Nuclear cleanup completed');
  }

  getEnhancedDebugInfo(): EnhancedDebugInfo {
    // FIXED: Don't refresh every time debug info is requested
    const debugInfo = DebugInfoService.getEnhancedDebugInfo(this.apiKey, this.lastValidationResult);
    
    return {
      ...debugInfo,
      keySource: this.keySource,
      managerInitialized: true
    };
  }
}
