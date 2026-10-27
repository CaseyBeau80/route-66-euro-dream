import { describe, it, expect } from 'vitest';
import { buildSrcSet, getOptimizedImageUrl, getSocialImageUrl } from './optimizedImage';

const storage = 'https://example.supabase.co/storage/v1/object/public/attractions/photo.png';
describe('public image delivery', () => {
  it('resizes public storage to WebP at the requested width and default quality', () => {
    const url = new URL(getOptimizedImageUrl(storage, 400));
    expect(url.origin).toBe('https://wsrv.nl');
    expect(url.searchParams.get('url')).toBe(storage.replace('https://', ''));
    expect(url.searchParams.get('w')).toBe('400');
    expect(url.searchParams.get('q')).toBe('72');
    expect(url.searchParams.get('output')).toBe('webp');
    expect(url.searchParams.has('we')).toBe(true);
  });
  it('uses 1200px JPEG for social crawlers', () => {
    const url = new URL(getSocialImageUrl(storage));
    expect(url.searchParams.get('w')).toBe('1200');
    expect(url.searchParams.get('output')).toBe('jpg');
  });
  it('leaves local, data and signed storage URLs untouched', () => {
    for (const url of ['/images/logo.webp', 'data:image/png;base64,x', 'https://example.supabase.co/storage/v1/object/sign/private/x?token=secret']) {
      expect(getOptimizedImageUrl(url, 600)).toBe(url);
    }
  });
  it('uses Unsplash parameters instead of the proxy', () => {
    const url = new URL(getOptimizedImageUrl('https://images.unsplash.com/photo-x?w=2000&q=90&auto=format', 800));
    expect(url.hostname).toBe('images.unsplash.com');
    expect(url.searchParams.get('w')).toBe('800');
    expect(url.searchParams.get('fm')).toBe('webp');
    expect(url.searchParams.get('q')).toBe('72');
  });
  it('builds the 400/800/1200 responsive sizes', () => {
    const set = buildSrcSet(storage, [400, 800, 1200]);
    expect(set?.split(', ').map(item => item.split(' ').at(-1))).toEqual(['400w', '800w', '1200w']);
  });
});