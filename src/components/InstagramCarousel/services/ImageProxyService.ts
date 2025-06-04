
import { supabase } from '@/integrations/supabase/client';

export class ImageProxyService {
  private static cache = new Map<string, string>();

  static async getProxiedImageUrl(originalUrl: string, postId: string): Promise<string> {
    // Check local cache first
    const cacheKey = `${postId}-${originalUrl}`;
    if (this.cache.has(cacheKey)) {
      console.log(`🔄 Using cached proxy URL for post ${postId}`);
      return this.cache.get(cacheKey)!;
    }

    try {
      console.log(`🌐 Requesting proxy for post ${postId}: ${originalUrl}`);
      
      const { data, error } = await supabase.functions.invoke('instagram-proxy', {
        body: { imageUrl: originalUrl, postId }
      });

      if (error) {
        console.error(`❌ Proxy function error for post ${postId}:`, error);
        throw error;
      }

      if (data?.success && data?.imageUrl) {
        console.log(`✅ Got proxied URL for post ${postId}: ${data.cached ? '(cached)' : '(new)'}`);
        this.cache.set(cacheKey, data.imageUrl);
        return data.imageUrl;
      } else {
        console.error(`❌ Proxy function failed for post ${postId}:`, data);
        throw new Error(data?.error || 'Proxy function failed');
      }
    } catch (error) {
      console.error(`❌ ImageProxyService error for post ${postId}:`, error);
      throw error;
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
