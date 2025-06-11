
export class TimeoutUtility {
  static async withTimeout<T>(
    promise: Promise<T>, 
    timeoutMs: number, 
    timeoutMessage: string = 'Operation timed out'
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  }
}
