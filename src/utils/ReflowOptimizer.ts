/**
 * Advanced Reflow Optimizer - Eliminates forced reflows through intelligent batching
 * and deferred layout reads with RequestAnimationFrame scheduling
 */

interface LayoutRead {
  id: string;
  callback: () => void;
  priority: 'high' | 'normal' | 'low';
}

interface CachedMeasurement {
  value: any;
  timestamp: number;
  element?: Element;
}

export class ReflowOptimizer {
  private static pendingReads = new Map<string, LayoutRead>();
  private static measurementCache = new Map<string, CachedMeasurement>();
  private static isScheduled = false;
  private static frameId: number | null = null;
  
  // Cache duration optimized for performance
  private static CACHE_DURATION = 16; // ~1 frame at 60fps
  private static MAX_CACHE_SIZE = 100;
  
  /**
   * Schedule a layout read to be batched in the next animation frame
   */
  static scheduleRead(id: string, callback: () => void, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    // Store the read operation
    this.pendingReads.set(id, { id, callback, priority });
    
    // Schedule batch execution if not already scheduled
    if (!this.isScheduled) {
      this.isScheduled = true;
      this.frameId = requestAnimationFrame(() => {
        this.executeBatchedReads();
      });
    }
  }
  
  /**
   * Execute all pending reads in priority order within a single frame
   */
  private static executeBatchedReads(): void {
    // Sort reads by priority
    const reads = Array.from(this.pendingReads.values()).sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    // Execute all reads in a single frame
    reads.forEach(read => {
      try {
        read.callback();
      } catch (error) {
        console.error(`ReflowOptimizer: Error in batched read ${read.id}:`, error);
      }
    });
    
    // Reset state
    this.pendingReads.clear();
    this.isScheduled = false;
    this.frameId = null;
  }
  
  /**
   * Get element dimensions with aggressive caching
   */
  static getDimensions(element: HTMLElement, cacheKey?: string): Promise<{ width: number; height: number }> {
    const key = cacheKey || `dims_${this.getElementKey(element)}`;
    
    return new Promise((resolve) => {
      // Check cache first
      const cached = this.getCachedValue(key);
      if (cached) {
        resolve(cached);
        return;
      }
      
      // Schedule batched read
      this.scheduleRead(key, () => {
        const dimensions = {
          width: element.offsetWidth,
          height: element.offsetHeight
        };
        
        this.setCachedValue(key, dimensions);
        resolve(dimensions);
      }, 'high');
    });
  }
  
  /**
   * Get element bounding rect with aggressive caching
   */
  static getBoundingRect(element: Element, cacheKey?: string): Promise<DOMRect> {
    const key = cacheKey || `rect_${this.getElementKey(element)}`;
    
    return new Promise((resolve) => {
      // Check cache first
      const cached = this.getCachedValue(key);
      if (cached) {
        resolve(cached);
        return;
      }
      
      // Schedule batched read
      this.scheduleRead(key, () => {
        const rect = element.getBoundingClientRect();
        this.setCachedValue(key, rect);
        resolve(rect);
      }, 'high');
    });
  }
  
  /**
   * Batch multiple layout operations together
   */
  static batchMeasurements<T>(operations: Array<() => T>): Promise<T[]> {
    return new Promise((resolve) => {
      const results: T[] = [];
      let completed = 0;
      
      operations.forEach((operation, index) => {
        this.scheduleRead(`batch_${index}_${Date.now()}`, () => {
          try {
            results[index] = operation();
          } catch (error) {
            console.error(`ReflowOptimizer: Error in batch operation ${index}:`, error);
            results[index] = null as T;
          }
          
          completed++;
          if (completed === operations.length) {
            resolve(results);
          }
        }, 'normal');
      });
    });
  }
  
  /**
   * Cache management
   */
  private static setCachedValue(key: string, value: any): void {
    // Prevent cache from growing too large
    if (this.measurementCache.size >= this.MAX_CACHE_SIZE) {
      this.clearOldCache();
    }
    
    this.measurementCache.set(key, {
      value,
      timestamp: performance.now()
    });
  }
  
  private static getCachedValue(key: string): any {
    const cached = this.measurementCache.get(key);
    if (!cached) return null;
    
    const now = performance.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.measurementCache.delete(key);
      return null;
    }
    
    return cached.value;
  }
  
  private static clearOldCache(): void {
    const now = performance.now();
    const toDelete: string[] = [];
    
    this.measurementCache.forEach((cached, key) => {
      if (now - cached.timestamp > this.CACHE_DURATION) {
        toDelete.push(key);
      }
    });
    
    toDelete.forEach(key => this.measurementCache.delete(key));
  }
  
  /**
   * Generate unique key for element
   */
  private static getElementKey(element: Element): string {
    return `${element.tagName}_${element.className}_${Date.now()}`;
  }
  
  /**
   * Clear all caches and cancel pending operations
   */
  static reset(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    
    this.pendingReads.clear();
    this.measurementCache.clear();
    this.isScheduled = false;
  }
  
  /**
   * Force immediate execution of pending reads (use sparingly)
   */
  static flush(): void {
    if (this.isScheduled && this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.executeBatchedReads();
    }
  }
}