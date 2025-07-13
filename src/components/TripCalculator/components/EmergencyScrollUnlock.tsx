import React, { useEffect } from 'react';

const EmergencyScrollUnlock: React.FC = () => {
  useEffect(() => {
    // Emergency scroll unlock - runs immediately and every 100ms
    const forceUnlockScroll = () => {
      try {
        // Remove all possible scroll locks
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.bottom = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.position = '';
        document.documentElement.style.top = '';
        document.documentElement.style.left = '';
        document.documentElement.style.right = '';
        document.documentElement.style.bottom = '';
        document.documentElement.style.width = '';
        document.documentElement.style.height = '';
        
        // Remove all scroll lock attributes
        document.body.removeAttribute('data-scroll-locked');
        document.body.removeAttribute('style');
        document.documentElement.removeAttribute('data-scroll-locked');
        
        // Force remove any PDF containers that might be stuck
        const pdfContainers = document.querySelectorAll('#pdf-export-content, .pdf-loading-overlay-js');
        pdfContainers.forEach(container => {
          if (container && container.parentNode) {
            container.parentNode.removeChild(container);
          }
        });
        
        console.log('🚨 EMERGENCY: Scroll forcibly unlocked and page cleaned');
      } catch (error) {
        console.error('Emergency unlock error:', error);
      }
    };

    // Immediate unlock
    forceUnlockScroll();
    
    // Set up aggressive interval
    const interval = setInterval(forceUnlockScroll, 100);
    
    // Also listen for any click to unlock
    const handleClick = () => {
      forceUnlockScroll();
    };
    
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleClick);
      document.removeEventListener('touchstart', handleClick);
      forceUnlockScroll();
    };
  }, []);

  // Render an invisible emergency button that can be clicked
  return (
    <div
      onClick={() => {
        console.log('🚨 EMERGENCY UNLOCK BUTTON CLICKED');
        document.body.style.overflow = '';
        document.body.removeAttribute('style');
        document.documentElement.style.overflow = '';
        window.location.reload();
      }}
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
        cursor: 'pointer',
        zIndex: 99999,
        opacity: 0.1
      }}
      title="Emergency: Click to unlock page"
    />
  );
};

export default EmergencyScrollUnlock;