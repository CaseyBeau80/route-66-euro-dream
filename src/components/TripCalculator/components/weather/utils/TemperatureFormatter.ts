
export class TemperatureFormatter {
  static extractSingleTemperature(temp: any, type: string): number {
    console.log(`🌡️ TemperatureFormatter.extractSingleTemperature [${type}]:`, {
      temp,
      type: typeof temp
    });

    // Handle direct numbers
    if (typeof temp === 'number' && !isNaN(temp)) {
      const rounded = Math.round(temp);
      console.log(`✅ TemperatureFormatter: Direct number extraction [${type}]:`, rounded);
      return rounded;
    }

    // Handle string numbers
    if (typeof temp === 'string' && temp.trim() !== '') {
      const parsed = parseFloat(temp);
      if (!isNaN(parsed)) {
        const rounded = Math.round(parsed);
        console.log(`✅ TemperatureFormatter: String number extraction [${type}]:`, rounded);
        return rounded;
      }
    }

    console.warn(`❌ TemperatureFormatter: Could not extract ${type} temperature from:`, temp);
    return NaN;
  }

  static formatTemperature(temp: number | undefined, formatFn?: (temp: number) => string): string {
    if (temp === undefined || temp === null || isNaN(temp)) {
      return '--°';
    }
    
    if (formatFn) {
      return formatFn(temp);
    }
    
    return `${Math.round(temp)}°F`;
  }
}
