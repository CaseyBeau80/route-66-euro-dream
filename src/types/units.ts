
export type UnitSystem = 'imperial' | 'metric';

export type DistanceUnit = 'miles' | 'kilometers';
export type SpeedUnit = 'mph' | 'kph';
export type TemperatureUnit = 'fahrenheit' | 'celsius';

export interface UnitPreferences {
  system: UnitSystem;
  distance: DistanceUnit;
  speed: SpeedUnit;
  temperature: TemperatureUnit;
}

export interface ConvertedValue {
  value: number;
  unit: string;
  formatted: string;
}
