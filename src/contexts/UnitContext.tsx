
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UnitSystem, UnitPreferences } from '@/types/units';
import { UnitConversionService } from '@/services/unitConversion';

interface UnitContextType {
  preferences: UnitPreferences;
  setUnitSystem: (system: UnitSystem) => void;
  formatDistance: (miles: number) => string;
  formatSpeed: (mph: number) => string;
  formatTemperature: (fahrenheit: number) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

const STORAGE_KEY = 'route66-unit-preferences';

interface UnitProviderProps {
  children: ReactNode;
}

export const UnitProvider: React.FC<UnitProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UnitPreferences>(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed;
      } catch (error) {
        console.warn('Failed to parse stored unit preferences:', error);
      }
    }
    
    // Default to locale-based detection
    const defaultSystem = UnitConversionService.getDefaultPreferences();
    return UnitConversionService.getUnitPreferences(defaultSystem);
  });

  // Save to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const setUnitSystem = (system: UnitSystem) => {
    const newPreferences = UnitConversionService.getUnitPreferences(system);
    setPreferences(newPreferences);
  };

  const formatDistance = (miles: number) => {
    return UnitConversionService.formatDistance(miles, preferences.distance);
  };

  const formatSpeed = (mph: number) => {
    return UnitConversionService.formatSpeed(mph, preferences.speed);
  };

  const formatTemperature = (fahrenheit: number) => {
    return UnitConversionService.formatTemperature(fahrenheit, preferences.temperature);
  };

  const value: UnitContextType = {
    preferences,
    setUnitSystem,
    formatDistance,
    formatSpeed,
    formatTemperature,
  };

  return (
    <UnitContext.Provider value={value}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnits = (): UnitContextType => {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitProvider');
  }
  return context;
};
