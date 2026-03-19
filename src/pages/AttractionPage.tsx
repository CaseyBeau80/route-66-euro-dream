import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAttraction } from '@/hooks/useAttraction';
import { stateAbbrMap } from '@/data/route66States';
import { MapPin, Globe, Clock, DollarSign, Tag, ArrowLeft, ChevronRight } from 'lucide-react';

const AttractionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { attraction, nearbyAttractions, isLoading, error } = useAttraction(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !attraction) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-heading text-3xl text-foreground">Attraction Not Found</h1>
        <p className="text-muted-foreground font-body">This stop along the Mother Road doesn't exist — yet.</p>
        <Link to="/" className="font-special text-sm uppercase text-primary hover:text-primary/80 border-2 border-primary px-4 py-2 rounded-sm shadow-[4px_4px_0_hsl(var(--primary)/0.3)]">
          Back to Home
        </Link>
      </div>
    );
  }

  const stateInfo = stateAbbrMap.get(attraction.state);
  const stateSlug = stateInfo?.slug || attraction.state.toLowerCase();
  const canonicalUrl = `https://ramble66.com/attractions/${slug}`;
  const metaDescription = attraction.description
    ? attraction.description.substring(0, 155) + (attraction.description.length > 155 ? '…' : '')
    : `Discover ${attraction.name} in ${attraction.city_name}, ${attraction.state} along Route 66.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": attraction.name,
    "description": attraction.description || metaDescription,
    "url": canonicalUrl,
    ...(attraction.image_url && { "image": attraction.image_url }),
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": attraction.latitude,
      "longitude": attraction.longitude,
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": attraction.city_name,
      "addressRegion": attraction.state,
      "addressCountry": "US",
    },
    ...(attraction.website && { "sameAs": attraction.website }),
    "isAccessibleForFree": attraction.admission_fee === 'Free' || !attraction.admission_fee,
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <Helmet>
        <title>{`${attraction.name} — Route 66 | Ramble 66`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${attraction.name} — Route 66 | Ramble 66`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={attraction.image_url || fallbackImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${attraction.name} — Route 66 | Ramble 66`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={attraction.image_url || fallbackImage} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
          <img
            src={attraction.image_url || fallbackImage}
            alt={attraction.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/0.7)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-xs font-special uppercase text-white/80 mb-3">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to={`/${stateSlug}`} className="hover:text-white">{stateInfo?.name || attraction.state}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{attraction.name}</span>
            </nav>
            <h1 className="font-heading text-3xl md:text-5xl text-white leading-tight">{attraction.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-sm font-special text-xs uppercase border-2 border-primary">
                <MapPin className="w-3 h-3" /> {attraction.city_name}, {attraction.state}
              </span>
              {attraction.category && (
                <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-sm font-special text-xs uppercase border-2 border-border">
                  {attraction.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <Link to={`/${stateSlug}`} className="inline-flex items-center gap-1 font-special text-xs uppercase text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-3 h-3" /> Back to {stateInfo?.name || attraction.state}
          </Link>

          {/* Description */}
          {attraction.description && (
            <div className="bg-surface border-2 border-border rounded-sm p-6 mb-8 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
              <p className="font-body text-foreground leading-relaxed text-lg">{attraction.description}</p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {attraction.website && (
              <a href={attraction.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface border-2 border-border rounded-sm p-4 hover:border-primary transition-colors shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-special text-xs uppercase text-muted-foreground block">Website</span>
                  <span className="font-body text-sm text-primary truncate block">{attraction.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </div>
              </a>
            )}
            {attraction.hours_of_operation && (
              <div className="flex items-center gap-3 bg-surface border-2 border-border rounded-sm p-4 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                <Clock className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                <div>
                  <span className="font-special text-xs uppercase text-muted-foreground block">Hours</span>
                  <span className="font-body text-sm text-foreground">{attraction.hours_of_operation}</span>
                </div>
              </div>
            )}
            {attraction.admission_fee && (
              <div className="flex items-center gap-3 bg-surface border-2 border-border rounded-sm p-4 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                <DollarSign className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                <div>
                  <span className="font-special text-xs uppercase text-muted-foreground block">Admission</span>
                  <span className="font-body text-sm text-foreground">{attraction.admission_fee}</span>
                </div>
              </div>
            )}
            {attraction.tribe_nation && (
              <div className="flex items-center gap-3 bg-surface border-2 border-border rounded-sm p-4 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                <Tag className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                <div>
                  <span className="font-special text-xs uppercase text-muted-foreground block">Tribe / Nation</span>
                  <span className="font-body text-sm text-foreground">{attraction.tribe_nation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {attraction.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {attraction.tags.map((tag) => (
                <span key={tag} className="font-special text-xs uppercase bg-muted text-muted-foreground px-3 py-1 border-2 border-border rounded-sm">
                  {tag.replace(/[_-]/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Nearby Attractions */}
          {nearbyAttractions.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-4">More in {stateInfo?.name || attraction.state}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nearbyAttractions.map((item) => (
                  <Link key={item.id} to={`/attractions/${item.slug}`}
                    className="bg-surface border-2 border-border rounded-sm overflow-hidden hover:border-primary transition-colors shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover" loading="lazy" />
                    )}
                    <div className="p-4">
                      <h3 className="font-heading text-lg text-foreground">{item.name}</h3>
                      <p className="font-special text-xs uppercase text-muted-foreground mt-1">{item.city_name}, {item.state}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link to="/"
              className="inline-block font-special text-sm uppercase bg-primary text-primary-foreground px-8 py-3 border-2 border-primary rounded-sm shadow-[4px_4px_0_hsl(var(--primary)/0.3)] hover:bg-primary/90 transition-colors">
              Plan Your Route 66 Trip
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttractionPage;
