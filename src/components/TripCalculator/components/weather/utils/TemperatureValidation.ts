
export class TemperatureValidation {
  static isValidTemperature(temp: number | undefined): boolean {
    return typeof temp === 'number' && 
           !isNaN(temp) && 
           temp > -150 && 
           temp < 150;
  }

  static isDisplayableTemp(temp: number | undefined): boolean {
    return temp !== undefined && 
           temp !== null && 
           typeof temp === 'number' && 
           !isNaN(temp) && 
           temp > -150 && 
           temp < 150;
  }

  static hasAnyValidTemperature(temperatures: {
    current?: number;
    high?: number;
    low?: number;
  }): boolean {
    return this.isValidTemperature(temperatures.current) ||
           this.isValidTemperature(temperatures.high) ||
           this.isValidTemperature(temperatures.low);
  }
}
