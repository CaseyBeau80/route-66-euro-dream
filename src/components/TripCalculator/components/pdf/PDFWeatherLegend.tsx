
import React from 'react';

interface PDFWeatherLegendProps {
  className?: string;
}

const PDFWeatherLegend: React.FC<PDFWeatherLegendProps> = ({ className = '' }) => {
  return (
    <div className={`pdf-weather-legend mt-4 p-3 bg-gray-50 rounded border border-gray-200 ${className}`}>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Weather Data Legend:</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-700">
        <div className="flex items-center gap-1">
          <span>🟩</span>
          <span>Forecast (0-5 days ahead)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🟦</span>
          <span>Historical Average (>5 days)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🟨</span>
          <span>Current/No data available</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2 italic">
        💡 Check live weather conditions before departure for the most accurate information.
      </div>
    </div>
  );
};

export default PDFWeatherLegend;
