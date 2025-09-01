/**
 * Layout Optimizer - Reduces forced reflows by caching DOM measurements
 * and batching layout reads using requestAnimationFrame
 */

interface CachedRect {
  rect: DOMRect;
  timestamp: number;
}

interface CachedDimensions {
  width: number;
  height: number;
  timestamp: number;
}

export class LayoutOptimizer {
  private static rectCache = new Map<Element, CachedRect>();
  private static dimensionsCache = new Map<Element, CachedDimensions>();
  private static pendingReads = new Set<() => void>();
  private static isReading = false;
  private static readTimeoutId: number | null = null;
  
  // Increased cache duration to 50ms (~3 frames at 60fps) for better reflow prevention
  private static CACHE_DURATION = 50;
  
  /**
   * Get element's bounding client rect with caching to prevent forced reflows
   */
  static getBoundingClientRect(element: Element): DOMRect {
    const cached = this.rectCache.get(element);
    const now = performance.now();
    
    // Return cached value if still valid
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.rect;
    }
    
    // Read fresh value and cache it
    const rect = element.getBoundingClientRect();
    this.rectCache.set(element, { rect, timestamp: now });
    
    return rect;
  }
  
  /**
   * Get element dimensions with caching to prevent forced reflows
   */
  static getElementDimensions(element: HTMLElement): { width: number; height: number } {
    const cached = this.dimensionsCache.get(element);
    const now = performance.now();
    
    // Return cached value if still valid
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return { width: cached.width, height: cached.height };
    }
    
    // Read fresh values and cache them
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    this.dimensionsCache.set(element, { width, height, timestamp: now });
    
    return { width, height };
  }
  
  /**
   * Batch multiple layout reads in a single animation frame to reduce reflows
   */
  static batchLayoutRead(callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      this.pendingReads.add(() => {
        callback();
        resolve();
      });
      
      if (!this.isReading) {
        this.isReading = true;
        
        // Debounce layout reads to reduce frequency
        if (this.readTimeoutId) {
          clearTimeout(this.readTimeoutId);
        }
        
        this.readTimeoutId = window.setTimeout(() => {
          requestAnimationFrame(() => {
            // Execute all pending reads in a single frame
            this.pendingReads.forEach(cb => cb());
            this.pendingReads.clear();
            this.isReading = false;
            this.readTimeoutId = null;
          });
        }, 8); // Small delay to batch multiple rapid calls
      }
    });
  }
  
  /**
   * Clear caches for specific element (useful when element is resized or removed)
   */
  static clearCache(element: Element): void {
    this.rectCache.delete(element);
    this.dimensionsCache.delete(element);
  }
  
  /**
   * Clear all caches (useful on window resize or major layout changes)
   */
  static clearAllCaches(): void {
    this.rectCache.clear();
    this.dimensionsCache.clear();
  }
  
  /**
   * Debounced cache clearing for window resize events
   */
  private static resizeTimeoutId: number | null = null;
  
  static handleWindowResize(): void {
    // Clear existing timeout
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }
    
    // Debounce cache clearing
    this.resizeTimeoutId = window.setTimeout(() => {
      this.clearAllCaches();
      this.resizeTimeoutId = null;
    }, 100);
  }
  
  /**
   * Initialize resize listener (call once per app)
   */
  static initialize(): void {
    window.addEventListener('resize', () => this.handleWindowResize(), { passive: true });
  }
  
  /**
   * Cleanup (useful for testing or component unmounting)
   */
  static cleanup(): void {
    this.clearAllCaches();
    this.pendingReads.clear();
    this.isReading = false;
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
      this.resizeTimeoutId = null;
    }
  }
}