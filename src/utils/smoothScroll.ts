
export const smoothScrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

// Wait for element to exist (for lazy-loaded sections), then scroll
export const smoothScrollToSectionWithRetry = (
  sectionId: string, 
  maxRetries: number = 10, 
  retryDelay: number = 200
) => {
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

export const smoothScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
