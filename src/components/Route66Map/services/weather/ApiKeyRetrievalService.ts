
import { CorruptionDetectionService } from './CorruptionDetectionService';
import { StorageCleanupService } from './StorageCleanupService';

export class ApiKeyRetrievalService {
  static refreshApiKey(): string | null {
    console.log('🔍 ApiKeyRetrievalService: Starting enhanced API key refresh...');
    
    const primaryKey = StorageCleanupService.getPrimaryStorageKey();
    let apiKey = localStorage.getItem(primaryKey);
    
    if (apiKey) {
      const corruption = CorruptionDetectionService.detectCorruption(apiKey, primaryKey);
      if (corruption.isCorrupted) {
        console.warn(`🚨 PRIMARY KEY CORRUPTION DETECTED:`, corruption);
        localStorage.removeItem(primaryKey);
        apiKey = null;
      }
    }
    
    // If primary key is corrupted or missing, try fallbacks
    if (!apiKey) {
      console.log('🔍 ApiKeyRetrievalService: Checking fallback keys...');
      for (const fallbackKey of StorageCleanupService.getFallbackStorageKeys()) {
        const fallbackValue = localStorage.getItem(fallbackKey);
        if (fallbackValue) {
          const corruption = CorruptionDetectionService.detectCorruption(fallbackValue, fallbackKey);
          if (!corruption.isCorrupted) {
            console.log(`🔑 Valid key found in fallback: ${fallbackKey}`);
            apiKey = fallbackValue;
            // Migrate to primary key
            localStorage.setItem(primaryKey, fallbackValue);
            localStorage.removeItem(fallbackKey);
            break;
          } else {
            console.warn(`🚨 FALLBACK KEY CORRUPTION DETECTED in ${fallbackKey}:`, corruption);
            localStorage.removeItem(fallbackKey);
          }
        }
      }
    }
    
    console.log('🔑 ApiKeyRetrievalService: Refresh complete:', {
      hasValidKey: !!apiKey,
      keyLength: apiKey?.length || 0
    });
    
    return apiKey;
  }

  static getApiKeyWithCorruptionCheck(cachedKey: string | null): string | null {
    if (!cachedKey) {
      return this.refreshApiKey();
    }
    
    const corruption = CorruptionDetectionService.detectCorruption(cachedKey, 'retrieval');
    if (corruption.isCorrupted) {
      console.warn('🚨 API key corrupted during retrieval, performing cleanup...', corruption);
      StorageCleanupService.performNuclearCleanup();
      return null;
    }
    
    return cachedKey;
  }
}
