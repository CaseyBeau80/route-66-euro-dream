
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface MapLoadingProps {
  error: string | null;
  onRetry: () => void;
}

const MapLoading = ({ error, onRetry }: MapLoadingProps) => {
  const [loadingTime, setLoadingTime] = useState(0);
  
  useEffect(() => {
    if (error) return; // Don't count time if there's an error
    
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [error]);
  
  if (error) {
    return (
      <div className="w-full h-[600px] rounded-xl border border-red-300 bg-red-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 text-lg mb-4 text-center">{error}</p>
        <p className="text-gray-600 mb-4 text-center">
          The map library may be having compatibility issues. Please try again or refresh the page.
        </p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const loadingMessages = [
    "Loading map resources...",
    "Preparing Route 66 journey...",
    "Setting up the map...",
    "Almost there, finalizing map details...",
    "This is taking longer than expected, please wait..."
  ];
  
  const messageIndex = Math.min(Math.floor(loadingTime / 3), loadingMessages.length - 1);

  return (
    <div className="w-full h-[600px] rounded-xl relative">
      <Skeleton className="w-full h-full rounded-xl" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-2">{loadingMessages[messageIndex]}</p>
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        {loadingTime > 10 && (
          <p className="text-gray-500 mt-4 text-sm max-w-md text-center">
            Map loading is taking longer than usual. This might be due to slow connection or resource conflicts.
          </p>
        )}
      </div>
    </div>
  );
};

export default MapLoading;
