
import { SanitizationReport } from '../TripDataSanitizationService';

export class CircularReferenceRemover {
  /**
   * Remove circular references using a visited set approach
   */
  static removeCircularReferences(
    obj: any, 
    report: SanitizationReport, 
    visited = new WeakSet(), 
    path = ''
  ): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (visited.has(obj)) {
      report.hasCircularReferences = true;
      report.circularPaths.push(path);
      console.warn('🔄 Circular reference detected at path:', path);
      return '[Circular Reference Removed]';
    }

    visited.add(obj);

    if (Array.isArray(obj)) {
      const result = obj.map((item, index) => 
        this.removeCircularReferences(item, report, visited, `${path}[${index}]`)
      );
      visited.delete(obj);
      return result;
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      result[key] = this.removeCircularReferences(value, report, visited, currentPath);
    }

    visited.delete(obj);
    return result;
  }
}
