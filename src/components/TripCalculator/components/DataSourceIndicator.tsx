
import React from 'react';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { EnhancedSupabaseDataService } from '../services/data/EnhancedSupabaseDataService';

interface DataSourceIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  showDetails = false,
  className = ""
}) => {
  const [dataSourceInfo, setDataSourceInfo] = React.useState(EnhancedSupabaseDataService.getDataSourceInfo());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDataSourceInfo(EnhancedSupabaseDataService.getDataSourceInfo());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!dataSourceInfo) {
    return null;
  }

  const isConnected = dataSourceInfo.isUsingSupabase;
  const message = EnhancedSupabaseDataService.getDataSourceMessage();

  if (!showDetails && isConnected) {
    // Don't show indicator when connected and details not requested
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {isConnected ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <Wifi className="h-4 w-4 text-green-600" />
          {showDetails && (
            <span className="text-green-700">
              Live data ({dataSourceInfo.citiesAvailable} cities)
            </span>
          )}
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <WifiOff className="h-4 w-4 text-orange-600" />
          <span className="text-orange-700">
            Offline mode ({dataSourceInfo.citiesAvailable} cities)
          </span>
          {showDetails && dataSourceInfo.fallbackReason && (
            <span className="text-xs text-gray-500 ml-2">
              • {dataSourceInfo.fallbackReason}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default DataSourceIndicator;
