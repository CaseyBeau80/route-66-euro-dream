
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  segmentEndCity?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class WeatherErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('🚨 WeatherErrorBoundary: Caught weather component error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 WeatherErrorBoundary: Error details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      segmentEndCity: this.props.segmentEndCity
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-2">
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
            <strong>❌ Weather Component Error:</strong> Unable to load weather information
            {this.props.segmentEndCity && ` for ${this.props.segmentEndCity}`}
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-400 text-2xl mb-2">🌤️</div>
            <p className="text-sm text-gray-600">
              {this.props.fallbackMessage || 'Weather information temporarily unavailable'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WeatherErrorBoundary;
