
// Deterministic ID generation utility to prevent infinite re-renders
export class DeterministicIdGenerator {
  private static cache = new Map<string, string>();
  
  /**
   * Generate a deterministic ID based on input parameters
   * Same inputs will always produce the same ID
   */
  static generateId(prefix: string, ...inputs: (string | number)[]): string {
    const key = `${prefix}-${inputs.join('-')}`;
    
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    // Create deterministic hash from inputs
    let hash = 0;
    const str = key;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const id = `${prefix}-${Math.abs(hash)}`;
    this.cache.set(key, id);
    return id;
  }
  
  /**
   * Clear the cache when needed (for testing or memory management)
   */
  static clearCache(): void {
    this.cache.clear();
  }
}
