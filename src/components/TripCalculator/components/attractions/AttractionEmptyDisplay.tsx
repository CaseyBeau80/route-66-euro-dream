
import React from 'react';
import { Info } from 'lucide-react';
import { AttractionSearchResult } from '../../services/attractions/AttractionSearchResult';

interface AttractionEmptyDisplayProps {
  searchResult: AttractionSearchResult;
  onDebug?: () => void;
}

const AttractionEmptyDisplay: React.FC<AttractionEmptyDisplayProps> = ({
  searchResult,
  onDebug
}) => (
  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-start gap-2">
      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-blue-700 font-medium">No Attractions Found</p>
        <p className="text-xs text-blue-600 mt-1">{searchResult.message}</p>
      </div>
    </div>
    {onDebug && (
      <button
        onClick={onDebug}
        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
      >
        Debug city search
      </button>
    )}
  </div>
);

export default AttractionEmptyDisplay;
