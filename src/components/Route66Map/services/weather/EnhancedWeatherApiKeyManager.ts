
import { StorageCleanupService } from './StorageCleanupService';
import { ApiKeyValidationService, ValidationResult } from './ApiKeyValidationService';
import { ApiKeyRetrievalService } from './ApiKeyRetrievalService';
import { DebugInfoService, EnhancedDebugInfo } from './DebugInfoService';

export class EnhancedWeatherApiKeyManager {
  private apiKey: string | null = null;
  private lastValidationResult: ValidationResult | null = null;

  constructor() {
    this.performStartupCleanup();
  }

  private performStartupCleanup(): void {
    StorageCleanupService.performStartupCleanup();
    this.refreshApiKey();
  }

  refreshApiKey(): void {
    this.apiKey = ApiKeyRetrievalService.refreshApiKey();
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 EnhancedWeatherApiKeyManager: Setting new API key with enhanced validation...');
    
    const primaryKey = StorageCleanupService.getPrimaryStorageKey();
    ApiKeyValidationService.validateAndStoreApiKey(apiKey, primaryKey);
    
    this.apiKey = apiKey.trim();
    this.lastValidationResult = { isValid: true };
  }

  hasApiKey(): boolean {
    this.refreshApiKey();
    const hasKey = !!this.apiKey && this.apiKey.length > 0;
    
    if (this.apiKey) {
      const validation = ApiKeyValidationService.validateApiKey(this.apiKey, 'cached');
      if (!validation.isValid) {
        console.warn('🚨 Cached key is corrupted, clearing...', validation);
        this.performNuclearCleanup();
        return false;
      }
    }
    
    return hasKey;
  }

  getApiKey(): string | null {
    this.apiKey = ApiKeyRetrievalService.getApiKeyWithCorruptionCheck(this.apiKey);
    return this.apiKey;
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
    this.lastValidationResult = null;
    StorageCleanupService.performNuclearCleanup();
    
    console.log('✅ EnhancedWeatherApiKeyManager: Nuclear cleanup completed');
  }

  getEnhancedDebugInfo(): EnhancedDebugInfo {
    this.refreshApiKey();
    return DebugInfoService.getEnhancedDebugInfo(this.apiKey, this.lastValidationResult);
  }
}
