
export class WeatherDebugService {
  private static readonly DEBUG_PREFIX = '🚨 DEBUG:';

  static logComponentRender(componentName: string, city: string, props: any) {
    console.log(`${this.DEBUG_PREFIX} ${componentName} RENDER`, {
      city,
      ...props
    });
  }

  static logWeatherStateChange(city: string, action: string, data: any) {
    console.log(`${this.DEBUG_PREFIX} ${city} ${action}`, data);
  }

  static logDateCalculation(city: string, tripStartDate: any, day: number, result: Date | null) {
    console.log(`${this.DEBUG_PREFIX} Date calculation for ${city}`, {
      tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
      day,
      result: result?.toISOString(),
      daysFromNow: result ? Math.ceil((result.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null
    });
  }

  static logWeatherFlow(stage: string, data: any) {
    console.log(`${this.DEBUG_PREFIX} ${stage}`, data);
  }

  static logApiCall(city: string, endpoint: string, params: any) {
    console.log(`${this.DEBUG_PREFIX} API CALL ${city}`, {
      endpoint,
      params
    });
  }

  static logDataNormalization(city: string, input: any, output: any) {
    console.log(`${this.DEBUG_PREFIX} Data normalization ${city}`, {
      input,
      output,
      isValid: !!output
    });
  }
}
