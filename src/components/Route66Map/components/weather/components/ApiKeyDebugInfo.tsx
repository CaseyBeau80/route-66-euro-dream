
import React from 'react';

interface ApiKeyDebugInfoProps {
  debugInfo: any;
}

const ApiKeyDebugInfo: React.FC<ApiKeyDebugInfoProps> = ({ debugInfo }) => {
  return (
    <div className="bg-gray-100 rounded p-2 text-xs space-y-1">
      <div className="font-semibold text-gray-700">Debug Info:</div>
      <div>Has Key: {debugInfo.hasKey ? 'Yes' : 'No'}</div>
      <div>Key Length: {debugInfo.keyLength || 'None'}</div>
      {debugInfo.keyPreview && <div>Preview: {debugInfo.keyPreview}</div>}
      <div>Direct Check: {localStorage.getItem('openweathermap_api_key')?.length || 0} chars</div>
    </div>
  );
};

export default ApiKeyDebugInfo;
