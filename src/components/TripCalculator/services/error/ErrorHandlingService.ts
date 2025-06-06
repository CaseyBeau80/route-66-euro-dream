
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

export interface ErrorReport {
  error: Error;
  errorInfo: ErrorInfo;
  timestamp: Date;
  context: string;
  userId?: string;
}

export class ErrorHandlingService {
  private static errors: ErrorReport[] = [];

  /**
   * Log an error with context information
   */
  static logError(error: Error, context: string, errorInfo?: ErrorInfo): void {
    const errorReport: ErrorReport = {
      error,
      errorInfo: errorInfo || { componentStack: '' },
      timestamp: new Date(),
      context
    };

    this.errors.push(errorReport);
    
    // In development, log to console for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 Error in ${context}:`, error);
      if (errorInfo) {
        console.error('Component stack:', errorInfo.componentStack);
      }
    }
  }

  /**
   * Handle async errors with context
   */
  static async handleAsyncError<T>(
    asyncOperation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await asyncOperation();
    } catch (error) {
      this.logError(error as Error, context);
      return fallback;
    }
  }

  /**
   * Wrap a function with error handling
   */
  static wrapWithErrorHandling<T extends (...args: any[]) => any>(
    fn: T,
    context: string
  ): T {
    return ((...args: any[]) => {
      try {
        const result = fn(...args);
        
        // Handle async functions
        if (result && typeof result.catch === 'function') {
          return result.catch((error: Error) => {
            this.logError(error, context);
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        this.logError(error as Error, context);
        throw error;
      }
    }) as T;
  }

  /**
   * Get recent errors for debugging
   */
  static getRecentErrors(limit: number = 10): ErrorReport[] {
    return this.errors.slice(-limit);
  }

  /**
   * Clear error history
   */
  static clearErrors(): void {
    this.errors = [];
  }
}
