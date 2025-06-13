
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  componentName?: string;
  maxErrors?: number;
  resetTimeoutMs?: number;
}

interface State {
  hasError: boolean;
  errorCount: number;
  lastErrorTime: number;
  isCircuitOpen: boolean;
}

class PerformanceCircuitBreaker extends Component<Props, State> {
  private resetTimer?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0,
      lastErrorTime: 0,
      isCircuitOpen: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('🚨 PerformanceCircuitBreaker: Component error detected:', error);
    const now = Date.now();
    
    return {
      hasError: true,
      errorCount: 1, // Will be incremented in componentDidCatch
      lastErrorTime: now
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentName = 'Unknown', maxErrors = 3 } = this.props;
    const newErrorCount = this.state.errorCount + 1;
    
    console.error(`🚨 PerformanceCircuitBreaker [${componentName}]:`, {
      error: error.message,
      errorCount: newErrorCount,
      maxErrors,
      componentStack: errorInfo.componentStack
    });

    // Open circuit if too many errors
    if (newErrorCount >= maxErrors) {
      console.warn(`🚨 Circuit OPENED for ${componentName} after ${newErrorCount} errors`);
      this.setState({
        errorCount: newErrorCount,
        isCircuitOpen: true
      });
      
      // Auto-reset circuit after timeout
      this.scheduleReset();
    } else {
      this.setState({ errorCount: newErrorCount });
    }
  }

  scheduleReset = () => {
    const { resetTimeoutMs = 30000 } = this.props; // 30 seconds default
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    
    this.resetTimer = setTimeout(() => {
      console.log(`🔄 Circuit RESET for ${this.props.componentName}`);
      this.setState({
        hasError: false,
        errorCount: 0,
        isCircuitOpen: false,
        lastErrorTime: 0
      });
    }, resetTimeoutMs);
  };

  handleManualReset = () => {
    console.log(`🔄 Manual circuit RESET for ${this.props.componentName}`);
    this.setState({
      hasError: false,
      errorCount: 0,
      isCircuitOpen: false,
      lastErrorTime: 0
    });
  };

  componentWillUnmount() {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
  }

  render() {
    if (this.state.hasError || this.state.isCircuitOpen) {
      const { componentName = 'Component' } = this.props;
      
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-medium">Performance Protection Active</h3>
          </div>
          
          <p className="text-sm text-red-600 mb-3">
            {this.state.isCircuitOpen 
              ? `${componentName} has been temporarily disabled due to repeated errors.`
              : `${componentName} encountered an error and has been safely contained.`
            }
          </p>
          
          <button
            onClick={this.handleManualReset}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded border border-red-300 hover:bg-red-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PerformanceCircuitBreaker;
