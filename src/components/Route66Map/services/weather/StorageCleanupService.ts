
import { CorruptionDetectionService } from './CorruptionDetectionService';

export class StorageCleanupService {
  private static readonly PRIMARY_STORAGE_KEY = 'openweathermap_api_key';
  private static readonly FALLBACK_STORAGE_KEYS = [
    'weather_api_key',
    'openweather_api_key',
    'owm_api_key'
  ];

  static performStartupCleanup(): void {
    console.log('🔧 StorageCleanupService: Starting comprehensive startup cleanup...');
    
    // Check all storage locations for corrupted keys
    const allKeys = [this.PRIMARY_STORAGE_KEY, ...this.FALLBACK_STORAGE_KEYS];
    let foundCorruption = false;
    
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        const corruption = CorruptionDetectionService.detectCorruption(value, key);
        if (corruption.isCorrupted) {
          console.warn(`🚨 CORRUPTION DETECTED in ${key}:`, corruption);
          localStorage.removeItem(key);
          foundCorruption = true;
        }
      }
    });
    
    if (foundCorruption) {
      console.log('🧹 StorageCleanupService: Corrupted keys automatically removed during startup');
    }
  }

  static performNuclearCleanup(): void {
    console.log('💥 StorageCleanupService: PERFORMING NUCLEAR CLEANUP');
    
    // Clear all possible storage locations
    const allPossibleKeys = [
      this.PRIMARY_STORAGE_KEY,
      ...this.FALLBACK_STORAGE_KEYS,
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
    
    console.log('✅ StorageCleanupService: Nuclear cleanup completed');
  }

  static getAllStorageKeys(): string[] {
    return [this.PRIMARY_STORAGE_KEY, ...this.FALLBACK_STORAGE_KEYS];
  }

  static getPrimaryStorageKey(): string {
    return this.PRIMARY_STORAGE_KEY;
  }

  static getFallbackStorageKeys(): string[] {
    return this.FALLBACK_STORAGE_KEYS;
  }
}
