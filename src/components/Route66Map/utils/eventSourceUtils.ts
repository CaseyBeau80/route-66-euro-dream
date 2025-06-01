
import { EventSource } from '../data/cityEventLinks';

export const getEventSourceIcon = (type: EventSource['type']): string => {
  switch (type) {
    case 'official':
      return '🏛️';
    case 'chamber':
      return '🏢';
    case 'visitor_bureau':
      return '🎯';
    case 'facebook':
      return '📘';
    case 'eventbrite':
      return '🎟️';
    case 'tourism':
      return '🗺️';
    default:
      return '📅';
  }
};

export const getEventSourceBadgeClass = (type: EventSource['type']): string => {
  switch (type) {
    case 'official':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'chamber':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'visitor_bureau':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'facebook':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'eventbrite':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'tourism':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const openEventLink = (url: string, sourceName: string): void => {
  try {
    // Ensure URL has protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    console.log(`🔗 Opening event source: ${sourceName} - ${formattedUrl}`);
    
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Error opening event link:', error);
  }
};

export const isValidEventUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};
