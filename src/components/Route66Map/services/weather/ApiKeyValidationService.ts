
import { CorruptionDetectionService } from './CorruptionDetectionService';

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export class ApiKeyValidationService {
  static validateApiKey(apiKey: string | null, context: string): ValidationResult {
    if (!apiKey) {
      return { isValid: false, reason: 'No API key available' };
    }
    
    // Check for placeholder/example keys
    if (apiKey.toLowerCase().includes('your_api_key') || 
        apiKey.toLowerCase().includes('replace_with') ||
        apiKey.toLowerCase().includes('example') ||
        apiKey === 'PLACEHOLDER_KEY') {
      return { isValid: false, reason: 'Placeholder or invalid API key detected' };
    }
    
    // Valid OpenWeatherMap API keys are typically 32 characters long
    // But allow some flexibility for different key formats
    if (apiKey.length < 20) {
      return { isValid: false, reason: 'API key too short' };
    }
    
    const corruption = CorruptionDetectionService.detectCorruption(apiKey, context);
    if (corruption.isCorrupted) {
      console.warn(`❌ ApiKeyValidationService: Validation failed due to corruption:`, corruption);
      return { isValid: false, reason: corruption.reason };
    }
    
    return { isValid: true };
  }

  static validateAndStoreApiKey(apiKey: string, storageKey: string): void {
    const trimmedKey = apiKey.trim();
    
    // Check for placeholder keys before storing
    if (trimmedKey.toLowerCase().includes('your_api_key') || 
        trimmedKey.toLowerCase().includes('replace_with') ||
        trimmedKey.toLowerCase().includes('example') ||
        trimmedKey === 'PLACEHOLDER_KEY') {
      const errorMessage = 'Invalid API key: appears to be a placeholder or example key';
      console.error('❌ ApiKeyValidationService:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Valid OpenWeatherMap API keys should be at least 20 characters
    if (trimmedKey.length < 20) {
      const errorMessage = 'Invalid API key: too short for a valid OpenWeatherMap API key';
      console.error('❌ ApiKeyValidationService:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Pre-validation corruption check
    const corruption = CorruptionDetectionService.detectCorruption(trimmedKey, 'input');
    if (corruption.isCorrupted) {
      const errorMessage = `Invalid API key: ${corruption.reason}`;
      console.error('❌ ApiKeyValidationService:', errorMessage, corruption.details);
      throw new Error(errorMessage);
    }
    
    // Store the key with immediate verification
    localStorage.setItem(storageKey, trimmedKey);
    
    // Immediate verification
    const storedKey = localStorage.getItem(storageKey);
    if (storedKey !== trimmedKey) {
      console.error('❌ ApiKeyValidationService: Storage verification failed!');
      throw new Error('Failed to store API key properly');
    }
    
    // Validate the stored key for corruption
    const storedCorruption = CorruptionDetectionService.detectCorruption(storedKey, storageKey);
    if (storedCorruption.isCorrupted) {
      console.error('❌ ApiKeyValidationService: Stored key became corrupted!', storedCorruption);
      throw new Error('API key became corrupted during storage');
    }
    
    console.log('✅ ApiKeyValidationService: API key set and verified successfully');
  }
}
