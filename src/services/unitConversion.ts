
import { UnitSystem, DistanceUnit, SpeedUnit, TemperatureUnit } from '@/types/units';

export class UnitConversionService {
  // Distance conversions
  static convertDistance(miles: number, targetUnit: DistanceUnit): number {
    if (targetUnit === 'kilometers') {
      return miles * 1.60934;
    }
    return miles; // Already in miles
  }

  static formatDistance(miles: number, targetUnit: DistanceUnit): string {
    const converted = this.convertDistance(miles, targetUnit);
    const rounded = Math.round(converted);
    const unit = targetUnit === 'kilometers' ? 'km' : 'mi';
    return `${rounded.toLocaleString()} ${unit}`;
  }

  // Speed conversions
  static convertSpeed(mph: number, targetUnit: SpeedUnit): number {
    if (targetUnit === 'kph') {
      return mph * 1.60934;
    }
    return mph; // Already in mph
  }

  static formatSpeed(mph: number, targetUnit: SpeedUnit): string {
    const converted = this.convertSpeed(mph, targetUnit);
    const rounded = Math.round(converted);
    const unit = targetUnit === 'kph' ? 'km/h' : 'mph';
    return `${rounded} ${unit}`;
  }

  // Temperature conversions
  static convertTemperature(fahrenheit: number, targetUnit: TemperatureUnit): number {
    if (targetUnit === 'celsius') {
      return (fahrenheit - 32) * 5/9;
    }
    return fahrenheit; // Already in fahrenheit
  }

  static formatTemperature(fahrenheit: number, targetUnit: TemperatureUnit): string {
    const converted = this.convertTemperature(fahrenheit, targetUnit);
    const rounded = Math.round(converted);
    const unit = targetUnit === 'celsius' ? '°C' : '°F';
    return `${rounded}${unit}`;
  }

  // Get default preferences based on locale
  static getDefaultPreferences(): UnitSystem {
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    
    // Countries that use metric system
    const metricCountries = ['ca', 'gb', 'au', 'de', 'fr', 'es', 'it', 'jp', 'kr', 'cn', 'br', 'mx'];
    const countryCode = locale.toLowerCase().split('-')[1];
    
    return metricCountries.includes(countryCode) ? 'metric' : 'imperial';
  }

  // Get unit preferences from system
  static getUnitPreferences(system: UnitSystem) {
    return {
      system,
      distance: system === 'metric' ? 'kilometers' as DistanceUnit : 'miles' as DistanceUnit,
      speed: system === 'metric' ? 'kph' as SpeedUnit : 'mph' as SpeedUnit,
      temperature: system === 'metric' ? 'celsius' as TemperatureUnit : 'fahrenheit' as TemperatureUnit
    };
  }
}
