
export const getFallbackImage = (
  nameOrCategory: string, 
  description?: string | null, 
  category?: string
): string => {
  // Support both old signature (name, description, category) and new signature (category only)
  const actualCategory = category || nameOrCategory;
  const nameAndDesc = category ? `${nameOrCategory} ${description || ''}`.toLowerCase() : '';
  
  // Category-specific fallback images
  if (actualCategory === 'destination_cities') {
    if (nameAndDesc.includes('chicago')) return "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=600&q=80";
    if (nameAndDesc.includes('santa monica')) return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80";
    if (nameAndDesc.includes('flagstaff')) return "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80";
    return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=600&q=80";
  }
  
  if (actualCategory === 'drive_ins') {
    // Use multiple reliable vintage/retro images that work well for drive-ins
    const driveInImages = [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80", // Vintage car at night
      "https://images.unsplash.com/photo-1533319415-e95e8075c522?auto=format&fit=crop&w=600&q=80", // Classic cinema
      "https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?auto=format&fit=crop&w=600&q=80", // Retro neon sign
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80", // Movie theater seats
      "https://images.unsplash.com/photo-1489599856804-e747b5bccadb?auto=format&fit=crop&w=600&q=80"  // Theater screen
    ];
    
    // Use name hash to consistently pick the same image for the same drive-in
    const nameHash = nameOrCategory.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
    return driveInImages[nameHash % driveInImages.length];
  }
  
  if (actualCategory === 'attractions') {
    if (nameAndDesc.includes('museum')) return "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80";
    if (nameAndDesc.includes('ranch')) return "https://images.unsplash.com/photo-1544966503-7e10ae230fb1?auto=format&fit=crop&w=600&q=80";
    return "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=600&q=80";
  }
  
  if (actualCategory === 'route66_waypoints') {
    return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80";
  }
  
  // Hidden gems fallback
  if (nameAndDesc.includes('motel') || nameAndDesc.includes('motor') || nameAndDesc.includes('inn')) {
    return "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=600&q=80";
  }
  if (nameAndDesc.includes('diner') || nameAndDesc.includes('cafe') || nameAndDesc.includes('restaurant')) {
    return "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=600&q=80";
  }
  if (nameAndDesc.includes('gas') || nameAndDesc.includes('station')) {
    return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80";
  }
  
  // Default Route 66 road image
  return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80";
};

// Helper function for simple category-only fallbacks
export const getCategoryFallback = (category: string): string => {
  return getFallbackImage(category);
};
