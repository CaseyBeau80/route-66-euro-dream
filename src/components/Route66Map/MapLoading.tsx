
import { Skeleton } from "@/components/ui/skeleton";

interface MapLoadingProps {
  error: string | null;
  onRetry: () => void;
}

const MapLoading = ({ error, onRetry }: MapLoadingProps) => {
  if (error) {
    return (
      <div className="w-full h-[600px] rounded-xl border border-red-300 bg-red-50 flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-xl relative">
      <Skeleton className="w-full h-full rounded-xl" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-2">Loading map...</p>
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default MapLoading;
