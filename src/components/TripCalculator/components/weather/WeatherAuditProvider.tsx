
import React from 'react';
import ForecastAuditDisplay from './debug/ForecastAuditDisplay';

interface WeatherAuditProviderProps {
  children: React.ReactNode;
  showAudit?: boolean;
}

const WeatherAuditProvider: React.FC<WeatherAuditProviderProps> = ({ 
  children, 
  showAudit = process.env.NODE_ENV === 'development' 
}) => {
  return (
    <>
      {children}
      {showAudit && <ForecastAuditDisplay />}
    </>
  );
};

export default WeatherAuditProvider;
