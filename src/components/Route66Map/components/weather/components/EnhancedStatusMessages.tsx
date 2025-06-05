
import React from 'react';
import { AlertTriangle, Zap } from 'lucide-react';

interface EnhancedStatusMessagesProps {
  autoCleanupPerformed: boolean;
  error: string | null;
  testResult: string | null;
}

const EnhancedStatusMessages: React.FC<EnhancedStatusMessagesProps> = ({ 
  autoCleanupPerformed, 
  error, 
  testResult 
}) => {
  return (
    <>
      {autoCleanupPerformed && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-green-800">
          <Zap className="w-4 h-4" />
          <span className="text-xs">Nuclear cleanup performed! Please enter your API key again.</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}
      
      {testResult && (
        <div className="p-2 bg-gray-50 border border-gray-200 rounded text-gray-800">
          <span className="text-xs font-mono">{testResult}</span>
        </div>
      )}
    </>
  );
};

export default EnhancedStatusMessages;
