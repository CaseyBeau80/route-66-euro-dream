
export interface CorruptionAnalysis {
  isCorrupted: boolean;
  reason?: string;
  details?: {
    length: number;
    trimmedLength: number;
    hasWhitespace: boolean;
    firstChar: string;
    lastChar: string;
    containsSpecialChars: boolean;
    isAllSameChar: boolean;
  };
}

export class CorruptionDetectionService {
  static detectCorruption(value: string, storageKey: string): CorruptionAnalysis {
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
}
