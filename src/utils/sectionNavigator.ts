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
export const navigateToSection = (sectionId: string, maxRetries: number = 15, retryDelay: number = 200) => {
  // First, trigger the force-mount callback if available
  const callback = navigationCallbacks.get(sectionId);
  if (callback) {
    callback();
  }

  // Then wait for element to appear and scroll
  let attempts = 0;
  
  const tryScroll = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }
    
    attempts++;
    if (attempts < maxRetries) {
      setTimeout(tryScroll, retryDelay);
    }
  };
  
  tryScroll();
};
