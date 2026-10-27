import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useAttraction } from './useAttraction';
import { supabase } from '@/lib/supabase';

afterEach(() => vi.restoreAllMocks());
describe('detail lookup', () => {
  it('stops slug searches at the first matching table', async () => {
    const tables: string[] = [];
    const lookup = vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      tables.push(table);
      const q: any = { select: () => q, eq: () => q, neq: () => q, limit: async () => ({ data: [] }),
        maybeSingle: async () => ({ data: { id: 'one', name: 'Cadillac Ranch', slug: 'cadillac-ranch', state: 'TX', tags: [] }, error: null }) };
      return q;
    });
    const { result } = renderHook(() => useAttraction('cadillac-ranch'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.attraction?.name).toBe('Cadillac Ranch');
    // Two extra reads are the existing nearby-stop queries, not other detail tables.
    expect(tables).toEqual(['attractions', 'attractions', 'hidden_gems']);
    expect(lookup).toHaveBeenCalledTimes(3);
  });
  it('resolves drive-ins by a nine-row name index then id, never slug', async () => {
    const predicates: [string, string, string][] = [];
    const limits: [string, number][] = [];
    vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      let select = '';
      const q: any = {
        select: (value: string) => { select = value; return q; },
        eq: (key: string, value: string) => { predicates.push([table, key, value]); return q; },
        neq: () => q, order: () => q,
        limit: async (value: number) => { limits.push([table, value]); return { data: table === 'drive_ins' ? [{ id: 'drive-one', name: '66 Drive-In Theatre' }] : [], error: null }; },
        maybeSingle: async () => ({ data: table === 'drive_ins' && select === '*' ? { id: 'drive-one', name: '66 Drive-In Theatre', state: 'MO' } : null, error: null }),
      };
      return q;
    });
    const { result } = renderHook(() => useAttraction('66-drive-in-theatre'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.attraction?.source_table).toBe('drive_ins');
    expect(predicates.filter(p => p[0] === 'drive_ins')).toEqual([['drive_ins', 'id', 'drive-one']]);
    expect(limits).toContainEqual(['drive_ins', 9]);
  });
});