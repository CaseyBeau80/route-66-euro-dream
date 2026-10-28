import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { supabase } from '@/lib/supabase';
import { useBlogPost } from './useBlogPost';

beforeEach(() => {
  const related: any = { select: vi.fn(() => related), eq: () => related, neq: () => related, lte: () => related, order: () => related, limit: async () => ({ data: [] }) };
  vi.spyOn(supabase, 'from').mockReturnValue(related);
});
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe('blog content RPC', () => {
  it('loads content from the first RPC row and omits content in related reads', async () => {
    const row = { id: 'post-one', slug: 'mother-road', content: 'Full article' };
    const rpc = vi.spyOn(supabase, 'rpc').mockResolvedValue({ data: [row], error: null } as any);
    const { result } = renderHook(() => useBlogPost('mother-road'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.post?.content).toBe('Full article');
    expect(rpc).toHaveBeenCalledWith('get_blog_post', { p_slug: 'mother-road' });
    const query = vi.mocked(supabase.from).mock.results[0].value as any;
    expect(query.select).toHaveBeenCalledWith('id, title, slug, featured_image_url, published_at, author_name');
  });

  it('does not retry a confirmed missing post', async () => {
    const rpc = vi.spyOn(supabase, 'rpc').mockResolvedValue({ data: [], error: null } as any);
    const { result } = renderHook(() => useBlogPost('missing'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.notFound).toBe(true);
    expect(result.current.error).toBeNull();
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it('keeps loading through 500ms and 1500ms backoff, then permits manual retry', async () => {
    vi.useFakeTimers();
    const rpc = vi.spyOn(supabase, 'rpc').mockResolvedValue({ data: null, error: { message: 'timeout' } } as any);
    const { result } = renderHook(() => useBlogPost('mother-road'));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(499); });
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(rpc).toHaveBeenCalledTimes(2);
    await act(async () => { await vi.advanceTimersByTimeAsync(1499); });
    expect(result.current.isLoading).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(rpc).toHaveBeenCalledTimes(3);
    expect(result.current.error).toBe('timeout');
    expect(result.current.notFound).toBe(false);
    rpc.mockResolvedValue({ data: [{ id: 'post-one', content: 'Recovered' }], error: null } as any);
    await act(async () => { result.current.refetch(); });
    expect(result.current.post?.content).toBe('Recovered');
    expect(result.current.error).toBeNull();
  });

  it('does not retry or update state after unmount during backoff', async () => {
    vi.useFakeTimers();
    const rpc = vi.spyOn(supabase, 'rpc').mockResolvedValue({ data: null, error: { message: 'timeout' } } as any);
    const { unmount } = renderHook(() => useBlogPost('mother-road'));
    await act(async () => { await Promise.resolve(); });
    unmount();
    await act(async () => { await vi.advanceTimersByTimeAsync(2000); });
    expect(rpc).toHaveBeenCalledTimes(1);
  });
});