
import { useState, useEffect } from 'react';

export const useTimelineVisibility = (itemIds: string[]) => {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all timeline entries
    itemIds.forEach((id) => {
      const element = document.getElementById(`timeline-${id}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [itemIds]);

  return visibleItems;
};
