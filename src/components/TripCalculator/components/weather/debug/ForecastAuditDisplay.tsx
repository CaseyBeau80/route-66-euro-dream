
import React from 'react';
import { ForecastSourceAuditor } from '../services/ForecastSourceAuditor';

const ForecastAuditDisplay: React.FC = () => {
  const [auditSummary, setAuditSummary] = React.useState<any[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const summary = ForecastSourceAuditor.getAuditSummary();
      setAuditSummary(summary);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (auditSummary.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-sm mb-3">🔍 Forecast Source Audit</h3>
      <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
        {auditSummary.map((result, index) => (
          <div key={index} className={`p-2 rounded ${
            result.finalSource === 'live' ? 'bg-green-50 border border-green-200' :
            result.finalSource === 'historical' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">
                Day {result.segmentDay} - {result.cityName}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                result.finalSource === 'live' ? 'bg-green-100 text-green-800' :
                result.finalSource === 'historical' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {result.finalSource === 'live' ? '📡 LIVE' : 
                 result.finalSource === 'historical' ? '📊 HIST' : '❓ UNK'}
              </span>
            </div>
            <div className="text-gray-600">
              <div>Date: {result.requestedDate} ({result.daysFromNow} days)</div>
              <div>Range: {result.isWithinForecastRange ? '✅' : '❌'}</div>
              <div>Attempted: {result.liveForecastAttempted ? '✅' : '❌'}</div>
              <div>Success: {result.liveForecastSuccess ? '✅' : '❌'}</div>
              <div>Actual: {result.isActualForecast ? '✅' : '❌'}</div>
              {result.fallbackReason && (
                <div>Reason: {result.fallbackReason}</div>
              )}
              {result.temperature && (
                <div>Temp: {result.temperature.low}°-{result.temperature.high}°F</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => ForecastSourceAuditor.clearAudit()}
        className="mt-3 w-full bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-200"
      >
        Clear Audit
      </button>
    </div>
  );
};

export default ForecastAuditDisplay;
