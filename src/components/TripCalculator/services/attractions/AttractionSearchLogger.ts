
export class AttractionSearchLogger {
  static logAttractionSearch(operation: string, data: any, level: 'info' | 'warn' | 'error' = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      level,
      service: 'GeographicAttractionService',
      ...data
    };

    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '🎯';
    console.log(`${prefix} ${operation}:`, logEntry);
  }
}
