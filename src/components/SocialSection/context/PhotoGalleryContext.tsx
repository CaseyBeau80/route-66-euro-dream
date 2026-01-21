import React, { createContext, useContext, useState, useCallback } from 'react';

interface PhotoGalleryContextType {
  triggerRefresh: () => void;
  refreshKey: number;
}

const PhotoGalleryContext = createContext<PhotoGalleryContextType>({
  triggerRefresh: () => {},
  refreshKey: 0,
});

export const PhotoGalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);
  
  return (
    <PhotoGalleryContext.Provider value={{ triggerRefresh, refreshKey }}>
      {children}
    </PhotoGalleryContext.Provider>
  );
};

export const usePhotoGalleryRefresh = () => useContext(PhotoGalleryContext);
