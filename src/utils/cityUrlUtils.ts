
import type { Route66Waypoint } from '@/components/Route66Map/types/supabaseTypes';

/**
 * Generate a URL-safe slug from a city name
 */
export const generateCitySlug = (cityName: string): string => {
  return cityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Extract clean city name from waypoint name
 */
export const extractCityName = (waypointName: string): string => {
  return waypointName.split(',')[0].split(' - ')[0].trim();
};

/**
 * Generate city page URL from waypoint
 */
export const generateCityUrl = (waypoint: Route66Waypoint): string => {
  const cityName = extractCityName(waypoint.name);
  const slug = generateCitySlug(cityName);
  return `/city/${slug}`;
};

/**
 * Get all city URLs for Route 66 waypoints
 */
export const getAllCityUrls = (waypoints: Route66Waypoint[]): Array<{ waypoint: Route66Waypoint; url: string; slug: string }> => {
  return waypoints
    .filter(waypoint => waypoint.is_major_stop) // Only major stops get individual pages
    .map(waypoint => ({
      waypoint,
      url: generateCityUrl(waypoint),
      slug: generateCitySlug(extractCityName(waypoint.name))
    }));
};
