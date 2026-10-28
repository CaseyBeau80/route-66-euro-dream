import { afterEach, describe, expect, it, vi } from 'vitest';
import { supabase } from '@/lib/supabase';
import { TripService } from './TripService';
import type { TripPlan } from './Route66TripPlannerService';

afterEach(() => vi.restoreAllMocks());

describe('restricted anonymous trip access', () => {
  it('saves without requesting inserted rows and returns the generated code', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    vi.spyOn(supabase, 'from').mockReturnValue({ insert } as any);
    const code = await TripService.saveTrip({ title: 'Chicago to Tulsa' } as TripPlan);
    expect(code).toMatch(/^[A-Za-z0-9]{8}$/);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ share_code: code, view_count: 0 }));
  });

  it('reports insert errors even when no rows are returned', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({ insert: vi.fn().mockResolvedValue({ error: { message: 'denied' } }) } as any);
    await expect(TripService.saveTrip({ title: 'Trip' } as TripPlan)).rejects.toThrow('Failed to save trip');
  });

  it('loads the first shared RPC row without a direct trip read', async () => {
    const row = { id: 'trip-one', trip_data: { title: 'Chicago to Tulsa' }, share_code: 'Abcd1234' };
    const rpc = vi.spyOn(supabase, 'rpc').mockResolvedValue({ data: [row], error: null } as any);
    const directRead = vi.spyOn(supabase, 'from');
    expect(await TripService.loadTripByShareCode('Abcd1234')).toEqual(row);
    expect(rpc).toHaveBeenCalledWith('get_shared_trip', { p_share_code: 'Abcd1234' });
    expect(directRead).not.toHaveBeenCalled();
  });

  it('treats an empty shared RPC result as Trip not found', async () => {
    vi.spyOn(supabase, 'rpc').mockResolvedValue({ data: [], error: null } as any);
    await expect(TripService.loadTripByShareCode('Abcd1234')).rejects.toThrow('Trip not found');
  });

  it('keeps trip_data validation on RPC rows', async () => {
    vi.spyOn(supabase, 'rpc').mockResolvedValue({ data: [{ trip_data: null }], error: null } as any);
    await expect(TripService.loadTripByShareCode('Abcd1234')).rejects.toThrow('Invalid trip data format');
  });

  it('increments once via RPC and ignores failures', async () => {
    const rpc = vi.spyOn(supabase, 'rpc').mockResolvedValue({ data: null, error: { message: 'unavailable' } } as any);
    const directRead = vi.spyOn(supabase, 'from');
    await expect(TripService.incrementViewCount('Abcd1234')).resolves.toBeUndefined();
    expect(rpc).toHaveBeenCalledExactlyOnceWith('increment_trip_view', { p_share_code: 'Abcd1234' });
    expect(directRead).not.toHaveBeenCalled();
  });
});