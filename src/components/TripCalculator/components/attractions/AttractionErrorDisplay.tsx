
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { AttractionSearchResult, AttractionSearchStatus } from '../../services/attractions/AttractionSearchResult';

interface AttractionErrorDisplayProps {
  searchResult: AttractionSearchResult;
  onRetry: () => void;
  onDebug?: () => void;
}

const AttractionErrorDisplay: React.FC<AttractionErrorDisplayProps> = ({
  searchResult,
  onRetry,
  onDebug
}) => {
  const getErrorColor = () => {
    switch (searchResult.status) {
      case AttractionSearchStatus.CITY_NOT_FOUND:
        return 'yellow';
      case AttractionSearchStatus.TIMEOUT:
        return 'orange';
      case AttractionSearchStatus.ERROR:
        return 'red';
      default:
        return 'red';
    }
  };

  const color = getErrorColor();

  return (
    <div className={`p-3 bg-${color}-50 border border-${color}-200 rounded-lg`}>
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle className={`h-4 w-4 text-${color}-600 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`text-sm text-${color}-700 font-medium`}>
            {searchResult.status === AttractionSearchStatus.CITY_NOT_FOUND && 'City Not Found'}
            {searchResult.status === AttractionSearchStatus.TIMEOUT && 'Search Timed Out'}
            {searchResult.status === AttractionSearchStatus.ERROR && 'Search Failed'}
          </p>
          <p className={`text-xs text-${color}-600 mt-1`}>{searchResult.message}</p>
          <p className={`text-xs text-${color}-500 mt-1`}>
            Searching: {searchResult.citySearched}, {searchResult.stateSearched}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className={`flex items-center gap-1 text-xs bg-${color}-100 hover:bg-${color}-200 text-${color}-700 px-2 py-1 rounded transition-colors`}
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
        {onDebug && (
          <button
            onClick={onDebug}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
          >
            Debug Info
          </button>
        )}
      </div>
    </div>
  );
};

export default AttractionErrorDisplay;
