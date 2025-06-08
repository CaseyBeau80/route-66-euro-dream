
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SocialMetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  type?: 'website' | 'article';
  siteName?: string;
}

const SocialMetaTags: React.FC<SocialMetaTagsProps> = ({
  title = 'Ramble 66 - Your Route 66 Adventure Starts Here',
  description = 'Plan your perfect Route 66 road trip with Ramble 66. Create custom itineraries, discover hidden gems, and explore the Mother Road your way.',
  imageUrl = '/assets/branding/ramble66-social-share.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  siteName = 'Ramble 66'
}) => {
  return (
    <Helmet>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content="Route 66, road trip, trip planner, Mother Road, historic route, travel, adventure, Ramble 66" />
      <meta name="author" content="Ramble 66" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SocialMetaTags;
