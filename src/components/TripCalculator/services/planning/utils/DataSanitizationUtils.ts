
export class DataSanitizationUtils {
  static sanitizeString(value: any, defaultValue: string): string {
    return typeof value === 'string' && value.trim() ? value.trim() : defaultValue;
  }

  static sanitizeNumber(value: any, defaultValue: number): number {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }

  static sanitizeArray(value: any, defaultValue: any[]): any[] {
    return Array.isArray(value) ? value : defaultValue;
  }
}
