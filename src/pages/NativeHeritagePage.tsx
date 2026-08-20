import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { stateAbbrMap } from '@/data/route66States';
import { getAttractionDetailPath, AttractionSourceTable } from '@/types/attractionDetail';
import AttractionJsonLd from '@/components/seo/AttractionJsonLd';
import { MapPin, Globe, ArrowLeft, ChevronRight, Feather, Landmark } from 'lucide-react';
import { useDwellEvent } from '@/hooks/useEngagementTracking';


interface NativeHeritageSite {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city_name: string | null;
  state: string | null;
  latitude: number;
  longitude: number;
  image_url: string | null;
  website: string | null;
  tribe_nation: string | null;
  site_type: string | null;
  tags: string[] | null;
}

interface NearbyStop {
  name: string;
  slug: string;
  image_url: string | null;
  city_name: string | null;
  source_table: AttractionSourceTable;
}

const RETRY_DELAYS = [500, 1500]; // 3 attempts total
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const NativeHeritagePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [site, setSite] = useState<NativeHeritageSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  /** Transient failure (network/exception/Supabase error) after retries exhausted */
  const [error, setError] = useState(false);
  /** Definitive: query succeeded but no row matches this slug */
  const [notFound, setNotFound] = useState(false);
  const [attemptKey, setAttemptKey] = useState(0);
  const [nearbyStops, setNearbyStops] = useState<NearbyStop[]>([]);

  const refetch = useCallback(() => setAttemptKey((k) => k + 1), []);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchSite = async () => {
      setIsLoading(true);
      setError(false);
      setNotFound(false);

      for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
        if (cancelled) return;

        try {
          const { data, error: err } = await supabase
            .from('native_american_sites')
            .select('id, name, slug, description, city_name, state, latitude, longitude, image_url, website, tribe_nation, site_type, tags')
            .eq('slug', slug)
            .maybeSingle();

          if (cancelled) return;

          if (err) {
            // Transient / server-side failure — retry
            console.error(`Error fetching heritage site (attempt ${attempt + 1}):`, err);
          } else if (!data) {
            // Definitive answer: the site does not exist. Never retry.
            setSite(null);
            setNotFound(true);
            setIsLoading(false);
            return;
          } else {
            setSite(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          if (cancelled) return;
          console.error(`Unexpected error fetching heritage site (attempt ${attempt + 1}):`, e);
        }

        // Keep isLoading true while backing off so the spinner stays visible.
        if (attempt < RETRY_DELAYS.length) {
          await sleep(RETRY_DELAYS[attempt]);
        }
      }

      if (cancelled) return;
      setError(true);
      setIsLoading(false);
    };

    fetchSite();

    return () => {
      cancelled = true;
    };
  }, [slug, attemptKey]);


  // Fetch nearby stops once site is loaded
  useEffect(() => {
    if (!site?.state || !site?.id) return;
    const state = site.state;
    const siteId = site.id;

    Promise.all([
      supabase
        .from('native_american_sites')
        .select('name, slug, image_url, city_name')
        .eq('state', state)
        .neq('id', siteId)
        .limit(3),
      supabase
        .from('attractions')
        .select('name, slug, image_url, city_name')
        .eq('state', state)
        .limit(4),
      supabase
        .from('hidden_gems')
        .select('name, slug, image_url, city_name')
        .eq('state', state)
        .limit(4),
    ]).then(([nativeRes, attrRes, gemsRes]) => {
      const native: NearbyStop[] = (nativeRes.data || []).map(d => ({ ...d, source_table: 'native_american_sites' as const }));
      const attractions: NearbyStop[] = (attrRes.data || []).map(d => ({ ...d, source_table: 'attractions' as const }));
      const gems: NearbyStop[] = (gemsRes.data || []).map(d => ({ ...d, source_table: 'hidden_gems' as const }));
      const merged = [...native, ...gems, ...attractions].slice(0, 3);
      setNearbyStops(merged.length >= 2 ? merged : []);
    });
  }, [site]);

  const pathCanonicalUrl = `https://ramble66.com${location.pathname}`;

  // Engagement signal: only after the real stop has been on screen for 5s.
  useDwellEvent('stop_viewed', !!site, 5000, { slug, path: location.pathname });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Helmet>
          <link rel="canonical" href={pathCanonicalUrl} />
        </Helmet>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Definitive: no such record. Dead end — noindex, self-referencing canonical.
  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <Helmet>
          <title>Heritage Site Not Found | Ramble 66</title>
          <meta name="robots" content="noindex" />
          <link rel="canonical" href={pathCanonicalUrl} />
        </Helmet>
        <h1 className="font-heading text-3xl text-foreground">Heritage Site Not Found</h1>
        <p className="text-muted-foreground font-body">This stop along the Mother Road doesn't exist — yet.</p>
        <Link to="/" className="font-special text-sm uppercase text-primary hover:text-primary/80 border-2 border-primary px-4 py-2 rounded-sm shadow-[4px_4px_0_hsl(var(--primary)/0.3)]">
          Back to Home
        </Link>
      </div>
    );
  }

  // Transient failure: the record may be real, we just couldn't load it. Never noindex.
  if (error || !site) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <Helmet>
          <title>Couldn't Load This Heritage Site | Ramble 66</title>
          <link rel="canonical" href={pathCanonicalUrl} />
        </Helmet>
        <h1 className="font-heading text-3xl text-foreground">Couldn't Load This Heritage Site</h1>
        <p className="text-muted-foreground font-body">Something went sideways on the road. Give it another try in a moment.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={refetch}
            className="font-special text-sm uppercase text-primary hover:text-primary/80 border-2 border-primary px-4 py-2 rounded-sm shadow-[4px_4px_0_hsl(var(--primary)/0.3)]"
          >
            Try Again
          </button>
          <Link to="/" className="font-special text-sm uppercase text-muted-foreground hover:text-foreground border-2 border-border px-4 py-2 rounded-sm">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }


  const stateInfo = site.state ? stateAbbrMap.get(site.state) : undefined;
  const stateSlug = stateInfo?.slug || (site.state?.toLowerCase() ?? '');
  const stateName = stateInfo?.name || site.state || '';
  const canonicalUrl = `https://ramble66.com/native-heritage/${slug}`;
  const metaDescription = site.description
    ? site.description.substring(0, 155) + (site.description.length > 155 ? '…' : '')
    : `Discover ${site.name} — Native American heritage along Route 66.`;
  const fallbackImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80';

  const tags = site.tags ?? [];

  return (
    <>
      <Helmet>
        <title>{`${site.name} — Route 66 Native American Heritage | Ramble 66`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${site.name} — Route 66 Native American Heritage | Ramble 66`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={site.image_url || fallbackImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${site.name} — Route 66 Native American Heritage | Ramble 66`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={site.image_url || fallbackImage} />
      </Helmet>
      <AttractionJsonLd
        name={site.name}
        description={site.description}
        imageUrl={site.image_url}
        url={canonicalUrl}
        city={site.city_name}
        state={site.state}
        latitude={site.latitude}
        longitude={site.longitude}
        website={site.website}
        tags={tags}
        touristType="Cultural heritage site"
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
          <img
            src={site.image_url || fallbackImage}
            alt={site.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/0.7)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <nav className="flex items-center gap-1 text-xs font-special uppercase text-white/80 mb-3">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              {stateSlug && (
                <>
                  <Link to={`/${stateSlug}`} className="hover:text-white">{stateName}</Link>
                  <ChevronRight className="w-3 h-3" />
                </>
              )}
              <span className="text-white">{site.name}</span>
            </nav>
            <h1 className="font-heading text-3xl md:text-5xl text-white leading-tight">{site.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {site.city_name && site.state && (
                <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-sm font-special text-xs uppercase border-2 border-primary">
                  <MapPin className="w-3 h-3" /> {site.city_name}, {site.state}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {stateSlug && (
            <Link to={`/${stateSlug}`} className="inline-flex items-center gap-1 font-special text-xs uppercase text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-3 h-3" /> Back to {stateName}
            </Link>
          )}

          {/* Description */}
          {site.description && (
            <div className="bg-surface border-2 border-border rounded-sm p-6 mb-8 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
              <p className="font-body text-foreground leading-relaxed text-lg">{site.description}</p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {site.tribe_nation && (
              <div className="flex items-center gap-3 bg-surface border-2 border-border rounded-sm p-4 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                <Feather className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-special text-xs uppercase text-muted-foreground block">Tribal Nation</span>
                  <span className="font-body text-sm text-foreground">{site.tribe_nation}</span>
                </div>
              </div>
            )}
            {site.site_type && (
              <div className="flex items-center gap-3 bg-surface border-2 border-border rounded-sm p-4 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                <Landmark className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-special text-xs uppercase text-muted-foreground block">Type</span>
                  <span className="font-body text-sm text-foreground capitalize">{site.site_type.replace(/[_-]/g, ' ')}</span>
                </div>
              </div>
            )}
            {site.website && (
              <a href={site.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface border-2 border-border rounded-sm p-4 hover:border-primary transition-colors shadow-[4px_4px_0_hsl(var(--border)/0.3)] overflow-hidden">
                <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-special text-xs uppercase text-muted-foreground block">Website</span>
                  <span className="font-body text-sm text-primary truncate block">{site.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </div>
              </a>
            )}
            {site.city_name && site.state && (
              <div className="flex items-center gap-3 bg-surface border-2 border-border rounded-sm p-4 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                <MapPin className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-special text-xs uppercase text-muted-foreground block">Location</span>
                  <span className="font-body text-sm text-foreground">{site.city_name}, {site.state}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {tags.map((tag) => (
                <span key={tag} className="font-special text-xs uppercase bg-muted text-muted-foreground px-3 py-1 border-2 border-border rounded-sm">
                  {tag.replace(/[_-]/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Nearby Stops */}
          {nearbyStops.length >= 2 && (
            <div className="mt-10">
              <h2 className="font-heading text-2xl text-foreground mb-6">Nearby Stops</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {nearbyStops.map((stop) => (
                  <Link
                    key={`${stop.source_table}-${stop.slug}`}
                    to={getAttractionDetailPath(stop.source_table, stop.slug)}
                    className="group bg-surface border-2 border-border rounded-sm overflow-hidden shadow-[4px_4px_0_hsl(var(--border)/0.3)] hover:border-primary transition-colors"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={stop.image_url || fallbackImage}
                        alt={stop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-heading text-sm text-foreground leading-snug">{stop.name}</h3>
                      {stop.city_name && (
                        <span className="font-special text-xs uppercase text-muted-foreground mt-1 block">
                          {stop.city_name}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NativeHeritagePage;
