
import React from 'react';

interface EnhancedDebugInfoDisplayProps {
  enhancedDebugInfo: any;
}

const EnhancedDebugInfoDisplay: React.FC<EnhancedDebugInfoDisplayProps> = ({ enhancedDebugInfo }) => {
  if (!enhancedDebugInfo) return null;

  return (
    <div className="bg-gray-100 rounded p-2 text-xs space-y-1">
      <div className="font-semibold text-gray-700">Enhanced Debug Info:</div>
      <div>Has Key: {enhancedDebugInfo.hasKey ? 'Yes' : 'No'}</div>
      <div>Key Length: {enhancedDebugInfo.keyLength || 'None'}</div>
      {enhancedDebugInfo.keyPreview && <div>Preview: {enhancedDebugInfo.keyPreview}</div>}
      
      {enhancedDebugInfo.corruptionAnalysis && (
        <div className="mt-2">
          <div className="font-semibold">Corruption Analysis:</div>
          <div>Is Corrupted: {enhancedDebugInfo.corruptionAnalysis.isCorrupted ? 'Yes' : 'No'}</div>
          {enhancedDebugInfo.corruptionAnalysis.reason && (
            <div>Reason: {enhancedDebugInfo.corruptionAnalysis.reason}</div>
          )}
        </div>
      )}
      
      {enhancedDebugInfo.storageAnalysis && (
        <div className="mt-2">
          <div className="font-semibold">Storage Analysis:</div>
          {enhancedDebugInfo.storageAnalysis.map((storage: any, index: number) => (
            <div key={index}>
              {storage.key}: {storage.hasValue ? `${storage.length} chars` : 'empty'} 
              {storage.corruption?.isCorrupted && ` (CORRUPTED: ${storage.corruption.reason})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedDebugInfoDisplay;
