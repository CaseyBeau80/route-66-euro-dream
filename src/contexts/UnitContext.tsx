
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

const STORAGE_KEY = 'route66_unit_preference';

interface UnitProviderProps {
  children: ReactNode;
}

export const UnitProvider: React.FC<UnitProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UnitPreferences>(() => {
    // Clear any existing localStorage to force Imperial default
    localStorage.removeItem(STORAGE_KEY);
    
    // Always start with Imperial units
    const imperialPrefs = UnitConversionService.getUnitPreferences('imperial');
    console.log('🔧 UnitProvider initialized with Imperial units:', imperialPrefs);
    return imperialPrefs;
  });

  // Save to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    console.log('💾 Unit preferences saved to localStorage:', preferences);
  }, [preferences]);

  const setUnitSystem = (system: UnitSystem) => {
    const newPreferences = UnitConversionService.getUnitPreferences(system);
    console.log('🔄 Unit system changed to:', system, newPreferences);
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
