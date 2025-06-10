
import React from 'react';
import { PDFDataIntegrityService } from '../../services/pdf/PDFDataIntegrityService';

interface DataQualityNoticeProps {
  integrityReport: any;
}

const DataQualityNotice: React.FC<DataQualityNoticeProps> = ({ integrityReport }) => {
  if (!PDFDataIntegrityService.shouldShowDataQualityNotice(integrityReport)) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
      <div className="text-sm text-yellow-800">
        <div className="font-semibold mb-1">
          {PDFDataIntegrityService.generateDataQualityMessage(integrityReport)}
        </div>
        {integrityReport.warnings.length > 0 && (
          <ul className="text-xs space-y-1 mt-2">
            {integrityReport.warnings.slice(0, 2).map((warning: string, index: number) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DataQualityNotice;
