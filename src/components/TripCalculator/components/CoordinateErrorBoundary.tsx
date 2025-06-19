
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

/**
 * PHASE 3: Specialized error boundary for coordinate access errors
 */
export class CoordinateErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 PHASE 3: Coordinate Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const isCoordinateError = this.isCoordinateRelatedError(error);
    
    console.error('🚨 PHASE 3: Error boundary details:', {
      isCoordinateError,
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Store error details for debugging
    this.setState({
      hasError: true,
      error,
      errorInfo,
      errorId: this.state.errorId
    });
  }

  private isCoordinateRelatedError(error: Error): boolean {
    const coordinateErrorPatterns = [
      /cannot read propert(y|ies) of undefined.*reading.*latitude/i,
      /cannot read propert(y|ies) of undefined.*reading.*longitude/i,
      /cannot read propert(y|ies) of null.*reading.*latitude/i,
      /cannot read propert(y|ies) of null.*reading.*longitude/i,
      /undefined.*latitude/i,
      /undefined.*longitude/i,
      /distance.*calculation/i
    ];

    return coordinateErrorPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.stack || '')
    );
  }

  private handleRetry = () => {
    console.log('🔄 PHASE 3: User triggered error boundary retry');
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: Math.random().toString(36).substr(2, 9)
    });
  };

  private handleReload = () => {
    console.log('🔄 PHASE 3: User triggered page reload from error boundary');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isCoordinateError = this.state.error ? this.isCoordinateRelatedError(this.state.error) : false;
      
      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              {isCoordinateError ? 'Location Data Error' : 'Application Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-red-700">
              {isCoordinateError ? (
                <div className="space-y-2">
                  <p className="font-medium">
                    There was an issue accessing location coordinate data.
                  </p>
                  <p>
                    This usually happens when location data is incomplete or invalid. 
                    Please try again or choose different start/end locations.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">
                    {this.props.fallbackMessage || 'An unexpected error occurred while planning your trip.'}
                  </p>
                  <p>
                    Please try again. If the problem persists, try refreshing the page.
                  </p>
                </div>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-xs text-red-600 bg-red-100 p-2 rounded border">
                <summary className="cursor-pointer font-medium">
                  Technical Details (Development Mode)
                </summary>
                <div className="mt-2 space-y-1">
                  <div><strong>Error ID:</strong> {this.state.errorId}</div>
                  <div><strong>Message:</strong> {this.state.error.message}</div>
                  <div><strong>Type:</strong> {this.state.error.name}</div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default CoordinateErrorBoundary;
