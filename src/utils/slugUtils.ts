// Utility functions for generating and working with slugs

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const generateDestinationUrl = (destination: { id: string; name: string }): string => {
  // For destinations, we'll use the ID as the URL parameter since they might not have slugs
  return `/destination-city/${destination.id}`;
};

export const generateHiddenGemUrl = (hiddenGem: { slug: string | null; title: string; id: string }): string => {
  // Use existing slug if available, otherwise generate from title
  const slug = hiddenGem.slug || generateSlug(hiddenGem.title);
  return `/hidden-gem/${slug}`;
};

export const generateAttractionUrl = (attraction: { slug?: string | null; name: string; title?: string | null }): string => {
  // Use existing slug if available, otherwise generate from name or title
  const slug = attraction.slug || generateSlug(attraction.title || attraction.name);
  return `/attraction/${slug}`;
};