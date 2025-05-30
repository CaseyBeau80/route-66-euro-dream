
import React from 'react';

interface MapLoadingProps {
  error: string | null;
  onRetry: () => void;
}

const MapLoading: React.FC<MapLoadingProps> = ({ error, onRetry }) => {
  console.log("⏳ MapLoading: Rendering with error:", error);

  if (error) {
    return (
      <div className="w-full h-[600px] bg-red-50 flex items-center justify-center rounded-lg border border-red-200">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Map Loading Error
          </h3>
          <p className="text-red-700 mb-4">
            {error}
          </p>
          <button 
            onClick={onRetry}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-blue-50 flex items-center justify-center rounded-lg border border-blue-200">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-blue-800 mb-2">
          Loading Route 66 Map
        </h3>
        <p className="text-blue-700">
          Please wait while we prepare your historic highway adventure...
        </p>
      </div>
    </div>
  );
};

export default MapLoading;
