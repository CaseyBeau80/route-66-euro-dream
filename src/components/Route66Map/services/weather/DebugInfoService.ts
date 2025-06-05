
import { CorruptionDetectionService } from './CorruptionDetectionService';
import { StorageCleanupService } from './StorageCleanupService';
import { ValidationResult } from './ApiKeyValidationService';

export interface EnhancedDebugInfo {
  hasKey: boolean;
  keyLength: number | null;
  keyPreview: string | null;
  lastValidation: ValidationResult | null;
  corruptionAnalysis: any | null;
  storageAnalysis: any[];
}

export class DebugInfoService {
  static getEnhancedDebugInfo(
    apiKey: string | null, 
    lastValidationResult: ValidationResult | null
  ): EnhancedDebugInfo {
    const corruptionAnalysis = apiKey ? CorruptionDetectionService.detectCorruption(apiKey, 'debug') : null;
    
    // Analyze all storage locations
    const storageAnalysis = StorageCleanupService.getAllStorageKeys()
      .map(key => {
        const value = localStorage.getItem(key);
        return {
          key,
          hasValue: value !== null,
          length: value?.length || 0,
          corruption: value ? CorruptionDetectionService.detectCorruption(value, key) : null
        };
      });
    
    return {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || null,
      keyPreview: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : null,
      lastValidation: lastValidationResult,
      corruptionAnalysis,
      storageAnalysis
    };
  }

  static getBasicDebugInfo(apiKey: string | null): { hasKey: boolean; keyLength: number | null; keyPreview: string | null } {
    return {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || null,
      keyPreview: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : null
    };
  }
}
