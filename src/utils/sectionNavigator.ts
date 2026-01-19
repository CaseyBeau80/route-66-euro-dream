// Global event system to force-mount lazy sections and scroll to them

type NavigationCallback = () => void;
const navigationCallbacks: Map<string, NavigationCallback> = new Map();

// Register a callback to force-mount a section
export const registerSectionNavigator = (sectionId: string, callback: NavigationCallback) => {
  navigationCallbacks.set(sectionId, callback);
};

// Unregister when component unmounts
export const unregisterSectionNavigator = (sectionId: string) => {
  navigationCallbacks.delete(sectionId);
};

// Navigate to a section - forces mount if needed, then scrolls
// initialDelay gives React time to render after force-mount triggers
export const navigateToSection = (
  sectionId: string, 
  maxRetries: number = 25,  // Increased retries
  retryDelay: number = 150,  // Slightly faster checks
  initialDelay: number = 100 // Wait for React to render after force triggers
) => {
  // First, trigger the force-mount callback if available
  const callback = navigationCallbacks.get(sectionId);
  if (callback) {
    callback();
  }

  // Wait a bit for React to process the force-render before starting to look for element
  setTimeout(() => {
    let attempts = 0;
    
    const tryScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Add a tiny delay to ensure element is fully positioned
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
        return;
      }
      
      attempts++;
      if (attempts < maxRetries) {
        setTimeout(tryScroll, retryDelay);
      } else {
        console.warn(`Could not find section "${sectionId}" after ${maxRetries} attempts`);
      }
    };
    
    tryScroll();
  }, initialDelay);
};
