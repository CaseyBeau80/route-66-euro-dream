
import { useState, useEffect } from 'react';

const rotatingFacts = [
  "Route 66 was the first highway to be completely paved across multiple states.",
  "The highway spans 2,448 miles from Chicago to Santa Monica.",
  "Route 66 was officially established on November 11, 1926.",
  "It crosses through 8 states and 3 time zones.",
  "The Mother Road inspired countless songs, movies, and books."
];

export const useRotatingFacts = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % rotatingFacts.length);
    }, 10000);

    return () => clearInterval(factTimer);
  }, []);

  return { currentFact: rotatingFacts[currentFactIndex] };
};
