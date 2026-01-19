export interface SupabaseConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  error?: string;
}

export class SupabaseConnectionService {
  private static connectionStatus: SupabaseConnectionStatus | null = null;
  private static readonly CHECK_INTERVAL = 30000; // 30 seconds

  static async checkConnection(): Promise<SupabaseConnectionStatus> {
    try {
      // Import supabase here to avoid circular dependencies
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Try a simple query to test connection
      const { data, error } = await (supabase as any)
        .from('destination_cities')
        .select('id')
        .limit(1);

      const status: SupabaseConnectionStatus = {
        isConnected: !error && data !== null,
        lastChecked: new Date(),
        error: error?.message
      };

      this.connectionStatus = status;
      console.log('🔗 Supabase connection check:', status);
      return status;
    } catch (error) {
      const status: SupabaseConnectionStatus = {
        isConnected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown connection error'
      };

      this.connectionStatus = status;
      console.error('❌ Supabase connection failed:', error);
      return status;
    }
  }

  static async getConnectionStatus(): Promise<SupabaseConnectionStatus> {
    // Return cached status if recent
    if (this.connectionStatus && 
        Date.now() - this.connectionStatus.lastChecked.getTime() < this.CHECK_INTERVAL) {
      return this.connectionStatus;
    }

    // Otherwise check connection
    return this.checkConnection();
  }

  static isConnectionFresh(): boolean {
    return this.connectionStatus !== null && 
           Date.now() - this.connectionStatus.lastChecked.getTime() < this.CHECK_INTERVAL;
  }
}
