/**
 * Time-slicing utilities to break up main-thread work
 * Reduces blocking time while preserving functionality
 */
import React from 'react';

/**
 * Yields control to the browser to prevent main-thread blocking
 */
export const yieldToMain = (): Promise<void> => {
  return new Promise(resolve => {
    // Use scheduler.postTask if available, otherwise MessageChannel or setTimeout
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(() => resolve(), { priority: 'user-blocking' });
    } else if (typeof MessageChannel !== 'undefined') {
      const channel = new MessageChannel();
      channel.port1.onmessage = () => resolve();
      channel.port2.postMessage(null);
    } else {
      setTimeout(resolve, 0);
    }
  });
};

/**
 * Ultra-aggressive time-sliced array processing for FID optimization
 */
export const processArrayInChunks = async <T, R>(
  array: T[],
  processor: (item: T, index: number) => R,
  chunkSize: number = 3, // Reduced from 10 to 3 for FID optimization
  yieldAfterChunk: boolean = true
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    
    // Process chunk with micro-yields
    for (let j = 0; j < chunk.length; j++) {
      results.push(processor(chunk[j], i + j));
      
      // Yield after every single item for ultra-aggressive FID optimization
      if (j < chunk.length - 1) {
        await yieldToMain();
      }
    }
    
    // Always yield after each chunk for FID optimization
    if (i + chunkSize < array.length) {
      await yieldToMain();
      // Additional frame delay for aggressive FID optimization
      await new Promise(resolve => setTimeout(resolve, 16));
    }
  }
  
  return results;
};

/**
 * Time-sliced component rendering hook
 */
export const useTimeSlicedRender = <T>(
  items: T[],
  renderBatchSize: number = 5,
  initialDelay: number = 0
) => {
  const [visibleItems, setVisibleItems] = React.useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  React.useEffect(() => {
    if (items.length === 0) return;
    
    const renderNextBatch = async () => {
      // Initial delay for critical path
      if (currentIndex === 0 && initialDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, initialDelay));
      }
      
      const nextBatch = items.slice(currentIndex, currentIndex + renderBatchSize);
      
      if (nextBatch.length > 0) {
        setVisibleItems(prev => [...prev, ...nextBatch]);
        setCurrentIndex(prev => prev + renderBatchSize);
        
        // Yield to main thread before next batch
        await yieldToMain();
        
        // Schedule next batch if there are more items
        if (currentIndex + renderBatchSize < items.length) {
          setTimeout(renderNextBatch, 0);
        }
      }
    };
    
    renderNextBatch();
  }, [items, renderBatchSize, currentIndex, initialDelay]);
  
  // Reset when items change
  React.useEffect(() => {
    setVisibleItems([]);
    setCurrentIndex(0);
  }, [items]);
  
  return {
    visibleItems,
    isComplete: currentIndex >= items.length,
    progress: items.length > 0 ? (currentIndex / items.length) * 100 : 0
  };
};

/**
 * Scheduler for deferring non-critical work
 */
export class WorkScheduler {
  private taskQueue: Array<{ task: () => void; priority: 'high' | 'normal' | 'low' }> = [];
  private isProcessing = false;
  
  schedule(task: () => void, priority: 'high' | 'normal' | 'low' = 'normal') {
    this.taskQueue.push({ task, priority });
    
    // Sort by priority
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }
  
  private async processQueue() {
    if (this.taskQueue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    
    while (this.taskQueue.length > 0) {
      const { task } = this.taskQueue.shift()!;
      
      try {
        task();
      } catch (error) {
        console.error('Scheduled task failed:', error);
      }
      
      // Yield after each task
      await yieldToMain();
    }
    
    this.isProcessing = false;
  }
}

// Global scheduler instance
export const globalScheduler = new WorkScheduler();