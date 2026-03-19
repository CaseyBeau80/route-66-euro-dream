import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { stateSlugMap } from '@/data/route66States';
import { useStateData } from '@/hooks/useStateData';
import { MapPin, ChevronRight } from 'lucide-react';

const StatePage: React.FC = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const stateInfo = stateSlug ? stateSlugMap.get(stateSlug) : undefined;

  if (!stateInfo) {
    return <Navigate to="/404" replace />;
  }

  const { cities, attractions, isLoading } = useStateData(stateInfo.abbreviation);

  const canonicalUrl = `https://ramble66.com/${stateSlug}`;
  const metaTitle = `Route 66 in ${stateInfo.name} — Attractions & Stops | Ramble 66`;
  const metaDescription = stateInfo.description.substring(0, 155);

  // Group attractions by category
  const categories = attractions.reduce<Record<string, typeof attractions>>((acc, a) => {
    const cat = a.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(a);
    return acc;
  }, {});

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Route 66 Attractions in ${stateInfo.name}`,
    "description": stateInfo.description,
    "url": canonicalUrl,
    "numberOfItems": attractions.length,
    "itemListElement": attractions.slice(0, 20).map((a, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "TouristAttraction",
        "name": a.name,
        "url": `https://ramble66.com/attractions/${a.slug}`,
        ...(a.description && { "description": a.description.substring(0, 100) }),
      },
    })),
  };

  const fallbackHero = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={fallbackHero} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative h-[35vh] min-h-[280px] overflow-hidden bg-[hsl(var(--foreground))]">
          <img src={fallbackHero} alt={`Route 66 in ${stateInfo.name}`} className="w-full h-full object-cover opacity-60" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/0.8)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <nav className="flex items-center gap-1 text-xs font-special uppercase text-white/80 mb-3">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{stateInfo.name}</span>
            </nav>
            <h1 className="font-heading text-4xl md:text-6xl text-white">Route 66 in {stateInfo.name}</h1>
            <p className="font-special text-sm uppercase text-white/90 mt-2">
              {stateInfo.miles} miles of the Mother Road • {stateInfo.abbreviation}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Description */}
          <div className="bg-surface border-2 border-border rounded-sm p-6 mb-10 shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
            <p className="font-body text-foreground text-lg leading-relaxed">{stateInfo.description}</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Cities */}
              {cities.length > 0 && (
                <section className="mb-12">
                  <h2 className="font-heading text-2xl text-foreground mb-4">Cities Along Route 66</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {cities.map((city) => (
                      <div key={city.id}
                        className="bg-surface border-2 border-border rounded-sm p-4 hover:border-primary transition-colors shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-heading text-sm text-foreground">{city.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Attractions by category */}
              {Object.entries(categories).map(([category, items]) => (
                <section key={category} className="mb-10">
                  <h2 className="font-heading text-2xl text-foreground mb-4">{category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <Link key={item.id} to={`/attractions/${item.slug}`}
                        className="bg-surface border-2 border-border rounded-sm overflow-hidden hover:border-primary transition-colors shadow-[4px_4px_0_hsl(var(--border)/0.3)]">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="w-full h-36 object-cover" loading="lazy" />
                        )}
                        <div className="p-4">
                          <h3 className="font-heading text-base text-foreground leading-snug">{item.name}</h3>
                          <p className="font-special text-xs uppercase text-muted-foreground mt-1">
                            {item.city_name}
                          </p>
                          {item.description && (
                            <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}

              {attractions.length === 0 && (
                <p className="font-body text-muted-foreground text-center py-8">Attractions coming soon for {stateInfo.name}.</p>
              )}
            </>
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

export default StatePage;
