
import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_DOMAIN = 'https://ramble66.com';

interface SocialMetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  path?: string; // Explicit path like "/about" - preferred over url
  url?: string;  // Kept for backward compatibility
  type?: 'website' | 'article';
  siteName?: string;
}

const SocialMetaTags: React.FC<SocialMetaTagsProps> = ({
  title = 'Ramble 66',
  description = 'Plan and share your ultimate Route 66 road trip with our interactive map and shareable travel planner. Discover hidden gems, classic diners, retro motels, and iconic attractions along America\'s Mother Road from Chicago to Santa Monica.',
  imageUrl = 'https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/Logo_1_Ramble_66.png',
  path,
  url,
  type = 'website',
  siteName = 'Ramble 66'
}) => {
  // Generate canonical URL from path (preferred) or url prop
  const canonicalUrl = (() => {
    if (path !== undefined) {
      // Remove trailing slash, ensure path starts with /
      const cleanPath = path === '/' ? '' : path.replace(/\/+$/, '');
      return `${BASE_DOMAIN}${cleanPath}`;
    }
    // Fallback to url prop with trailing slash removal and domain normalization
    const fallbackUrl = url || (typeof window !== 'undefined' ? window.location.href : BASE_DOMAIN);
    return fallbackUrl
      .split('?')[0]
      .split('#')[0]
      .replace(/\/+$/, '')
      .replace('https://www.ramble66.com', BASE_DOMAIN)
      .replace('https://ramble66.lovable.app', BASE_DOMAIN) || BASE_DOMAIN;
  })();

  // Ensure absolute URL for social image
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${canonicalUrl}${imageUrl}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Route 66, road trip planner, interactive map, classic diners, retro motels, hidden gems, Mother Road, Chicago to Santa Monica, travel attractions, historic route, Ramble 66, Ramble66" />
      <meta name="author" content="Ramble 66" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:alt" content="Ramble 66 - Route 66 Trip Planner Logo" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content="Ramble 66 - Route 66 Trip Planner Logo" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="application-name" content="Ramble 66" />
      <meta name="apple-mobile-web-app-title" content="Ramble 66" />
      <meta name="msapplication-TileColor" content="#D2041A" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Sitemap */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
      {/* Structured Data - Website */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Ramble 66",
          "alternateName": ["Ramble66", "Ramble 66", "Route 66 Trip Planner"],
          "url": canonicalUrl,
          "description": description,
          "author": {
            "@type": "Organization",
            "name": "Ramble 66"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${canonicalUrl}?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      
      {/* Structured Data - Trip Planning Service */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Route 66 Trip Planner",
          "description": "Interactive Route 66 trip planning service with maps, attractions, and dining recommendations",
          "provider": {
            "@type": "Organization",
            "name": "Ramble 66",
            "url": canonicalUrl
          },
          "serviceType": "Travel Planning",
          "areaServed": {
            "@type": "Place",
            "name": "Route 66 - Chicago to Santa Monica"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free Route 66 trip planning tools and resources"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SocialMetaTags;
