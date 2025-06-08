
import { useState, useEffect } from 'react';

export const useKonamiCode = () => {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);

  // Konami Code sequence
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === konamiCode[konamiIndex]) {
        const newIndex = konamiIndex + 1;
        setKonamiIndex(newIndex);
        
        if (newIndex === konamiCode.length) {
          setEasterEggActive(true);
          setKonamiIndex(0);
          setTimeout(() => setEasterEggActive(false), 3000);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  return { easterEggActive };
};
