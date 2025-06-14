
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';

interface UnifiedWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherDisplay: React.FC<UnifiedWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  // DIRECT CHECK: Simple and clear live weather detection
  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;

  console.log('🎯 FIXED: UnifiedWeatherDisplay - DIRECT CHECK with inline styles only:', {
    cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveForecast,
    temperature: weather.temperature,
    isSharedView,
    fixedStyling: true
  });

  // COMPLETE INLINE STYLING: No CSS classes that could conflict
  const containerStyle: React.CSSProperties = isLiveForecast ? {
    backgroundColor: '#dcfce7', // green-100
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#bbf7d0', // green-200
    color: '#166534', // green-800
    borderRadius: '0.5rem',
    padding: '1rem',
    position: 'relative'
  } : {
    backgroundColor: '#fef3c7', // amber-100
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#fde68a', // amber-200
    color: '#92400e', // amber-800
    borderRadius: '0.5rem',
    padding: '1rem',
    position: 'relative'
  };

  const badgeStyle: React.CSSProperties = isLiveForecast ? {
    backgroundColor: '#dcfce7', // green-100
    color: '#166534', // green-800
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#bbf7d0', // green-200
    fontSize: '0.75rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    borderRadius: '9999px',
    fontWeight: '500',
    display: 'inline-block'
  } : {
    backgroundColor: '#fef3c7', // amber-100
    color: '#92400e', // amber-800
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#fde68a', // amber-200
    fontSize: '0.75rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    borderRadius: '9999px',
    fontWeight: '500',
    display: 'inline-block'
  };

  const sourceLabel = isLiveForecast ? '🟢 Live Weather Forecast' : '🟡 Historical Weather Data';
  const badgeText = isLiveForecast ? '✨ Current live forecast' : '📊 Based on historical patterns';
  const sourceColor = isLiveForecast ? '#059669' : '#d97706';

  console.log('🎯 FIXED: Applied complete inline styling:', {
    cityName,
    isLiveForecast,
    containerBg: containerStyle.backgroundColor,
    sourceLabel,
    completeInlineStyling: true,
    noCssClasses: true
  });

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '⛅';
  };

  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  return (
    <div style={containerStyle}>
      {/* Debug Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        color: 'white',
        padding: '0.5rem',
        fontSize: '0.75rem',
        borderBottomLeftRadius: '0.25rem',
        zIndex: 50,
        maxWidth: '18rem'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>🎯 FIXED: {cityName}</div>
        <div style={{ 
          marginBottom: '0.25rem', 
          fontWeight: 'bold', 
          color: isLiveForecast ? '#4ade80' : '#facc15'
        }}>
          {isLiveForecast ? '🟢 FIXED: LIVE' : '🟡 FIXED: HISTORICAL'}
        </div>
        <div>Source: {weather.source}</div>
        <div>ActualForecast: {String(weather.isActualForecast)}</div>
        <div>Direct Check: {String(isLiveForecast)}</div>
        <div style={{ color: isLiveForecast ? '#4ade80' : '#facc15' }}>
          Style Applied: {isLiveForecast ? 'GREEN' : 'AMBER'}
        </div>
        <div>View: {isSharedView ? 'SHARED' : 'PREVIEW'}</div>
        <div>Temp: {weather.temperature}°F</div>
        <div style={{ color: '#4ade80' }}>INLINE STYLES ONLY</div>
      </div>

      {/* Weather Source Indicator */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '0.5rem' 
      }}>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: '500',
          color: sourceColor 
        }}>
          {sourceLabel}
        </span>
        <span style={{ 
          fontSize: '0.75rem', 
          color: '#6b7280' 
        }}>
          {formattedDate}
        </span>
      </div>

      {/* Main Weather Display */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.875rem' }}>{weatherIcon}</div>
          <div>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937' 
            }}>
              {Math.round(weather.temperature)}°F
            </div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#4b5563', 
              textTransform: 'capitalize' 
            }}>
              {weather.description}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {weather.highTemp && weather.lowTemp && (
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#4b5563' 
            }}>
              H: {Math.round(weather.highTemp)}° L: {Math.round(weather.lowTemp)}°
            </div>
          )}
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            marginTop: '0.25rem' 
          }}>
            💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
          </div>
        </div>
      </div>

      {/* Weather Status Badge */}
      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
        <span style={badgeStyle}>
          {badgeText}
        </span>
      </div>
    </div>
  );
};

export default UnifiedWeatherDisplay;
