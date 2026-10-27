/** Public image delivery only; never proxy private/signed URLs. */
export function getOptimizedImageUrl(url: string, width: number, quality = 72, output: 'webp' | 'jpg' = 'webp'): string {
  try {
    if (!/^https?:\/\//i.test(url)) return url;
    const source = new URL(url);
    if (source.hostname === 'wsrv.nl') return url;
    const w = Math.max(1, Math.round(width));
    if (source.hostname === 'images.unsplash.com') {
      source.searchParams.set('w', String(w));
      source.searchParams.set('q', String(quality));
      source.searchParams.set('fm', output);
      source.searchParams.delete('auto');
      return source.toString();
    }
    const publicStorage = source.hostname.endsWith('.supabase.co') && source.pathname.startsWith('/storage/v1/object/public/');
    const publicRemote = !source.hostname.endsWith('.supabase.co') && !source.searchParams.has('token') && !source.searchParams.has('signature');
    if (!publicStorage && !publicRemote) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//i, ''))}&w=${w}&output=${output}&q=${quality}&we`;
  } catch { return url; }
}

export function buildSrcSet(url: string, widths = [400, 800, 1200]): string | undefined {
  if (getOptimizedImageUrl(url, widths[0] || 400) === url) return undefined;
  return widths.map(width => `${getOptimizedImageUrl(url, width)} ${width}w`).join(', ');
}

export const getSocialImageUrl = (url: string) => getOptimizedImageUrl(url, 1200, 72, 'jpg');