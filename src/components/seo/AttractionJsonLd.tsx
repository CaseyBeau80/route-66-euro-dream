import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AttractionJsonLdProps {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  url: string;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  website?: string | null;
  tags?: string[] | null;
  touristType?: string | null;
}

const AttractionJsonLd: React.FC<AttractionJsonLdProps> = ({
  name, description, imageUrl, url, city, state,
  latitude, longitude, website, tags, touristType,
}) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": name,
    "url": url,
  };

  if (description) jsonLd.description = description;
  if (imageUrl) jsonLd.image = imageUrl;

  if (city || state) {
    const address: Record<string, string> = { "@type": "PostalAddress", addressCountry: "US" };
    if (city) address.addressLocality = city;
    if (state) address.addressRegion = state;
    jsonLd.address = address;
  }

  if (typeof latitude === 'number' && typeof longitude === 'number') {
    jsonLd.geo = { "@type": "GeoCoordinates", latitude, longitude };
  }

  if (website) jsonLd.sameAs = [website];

  const filteredTags = tags?.filter(Boolean);
  if (filteredTags && filteredTags.length > 0) {
    jsonLd.keywords = filteredTags.join(', ');
  }

  if (touristType) jsonLd.touristType = touristType;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default AttractionJsonLd;
