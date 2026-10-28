import { describe, it, expect, vi, afterEach } from 'vitest';
import { readPublicCache, writePublicCache, cachedPublicFetch } from './publicReadCache';
import { queryClient } from './queryClient';

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); localStorage.clear(); queryClient.clear(); });
describe('public caching rules', () => {
  it('expires at 30 minutes, not before', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1000);
    writePublicCache('list', [1]);
    vi.mocked(Date.now).mockReturnValue(1000 + 30 * 60 * 1000 - 1);
    expect(readPublicCache('list')).toEqual([1]);
    vi.mocked(Date.now).mockReturnValue(1000 + 30 * 60 * 1000);
    expect(readPublicCache('list')).toBeUndefined();
  });
  it('survives blocked storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(() => writePublicCache('list', [1])).not.toThrow();
  });
  it('sets 15 minute freshness, one hour retention, one retry and no focus refetch', () => {
    expect(queryClient.getDefaultOptions().queries).toMatchObject({ staleTime: 900000, gcTime: 3600000, retry: 1, refetchOnWindowFocus: false });
  });
  it('deduplicates waypoints and reuses them after a page reload', async () => {
    const network = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('[{"id":"one"}]', { status: 200 }));
    const base = 'https://example.supabase.co/rest/v1/route66_waypoints';
    const result = await Promise.all([cachedPublicFetch(base + '?select=*'), cachedPublicFetch(base + '?select=id&order=sequence_order.asc')]);
    expect(network).toHaveBeenCalledTimes(1);
    expect(await result[0].json()).toEqual([{ id: 'one' }]);
    queryClient.clear();
    await cachedPublicFetch(base + '?select=id');
    expect(network).toHaveBeenCalledTimes(1);
  });
  it('never caches writes', async () => {
    const network = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('{}'));
    for (let i = 0; i < 2; i++) await cachedPublicFetch('https://example.supabase.co/rest/v1/attractions', { method: 'POST' });
    expect(network).toHaveBeenCalledTimes(2);
  });
  it('never caches blog or shared-trip RPC POSTs', async () => {
    const network = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('[]'));
    for (const name of ['get_blog_post', 'get_shared_trip', 'increment_trip_view']) {
      for (let i = 0; i < 2; i++) await cachedPublicFetch(`https://example.supabase.co/rest/v1/rpc/${name}`, { method: 'POST' });
    }
    expect(network).toHaveBeenCalledTimes(6);
    expect(localStorage.length).toBe(0);
  });
});