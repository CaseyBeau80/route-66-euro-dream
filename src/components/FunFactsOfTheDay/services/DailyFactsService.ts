
import { FunFact, DailyFacts } from '../types';
import { funFactsDatabase } from '../data/funFactsDatabase';

export class DailyFactsService {
  private static readonly FACTS_PER_DAY = 5;

  /**
   * Get today's fun facts using date-based selection
   */
  static getTodaysFacts(): DailyFacts {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const selectedFacts = this.selectFactsForDate(dateString);
    
    return {
      date: dateString,
      facts: selectedFacts
    };
  }

  /**
   * Select facts for a specific date using deterministic algorithm
   */
  private static selectFactsForDate(dateString: string): FunFact[] {
    // Create a seed based on the date
    const seed = this.createDateSeed(dateString);
    
    // Shuffle facts deterministically based on the seed
    const shuffledFacts = this.shuffleWithSeed([...funFactsDatabase], seed);
    
    // Ensure variety by selecting from different categories
    const selectedFacts = this.selectDiverseFacts(shuffledFacts);
    
    return selectedFacts.slice(0, this.FACTS_PER_DAY);
  }

  /**
   * Create a numeric seed from date string
   */
  private static createDateSeed(dateString: string): number {
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      seed = ((seed << 5) - seed) + char;
      seed = seed & seed; // Convert to 32-bit integer
    }
    return Math.abs(seed);
  }

  /**
   * Shuffle array using a seed for deterministic results
   */
  private static shuffleWithSeed<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let currentIndex = shuffled.length;

    // Use seeded random number generator
    let randomSeed = seed;
    const seededRandom = () => {
      const x = Math.sin(randomSeed++) * 10000;
      return x - Math.floor(x);
    };

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(seededRandom() * currentIndex);
      currentIndex--;

      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex], shuffled[currentIndex]
      ];
    }

    return shuffled;
  }

  /**
   * Select facts to ensure category diversity
   */
  private static selectDiverseFacts(facts: FunFact[]): FunFact[] {
    const categories = ['history', 'trivia', 'culture', 'architecture', 'famous-people'];
    const selectedFacts: FunFact[] = [];
    const usedCategories = new Set<string>();

    // First pass: select one fact from each category
    for (const category of categories) {
      const categoryFact = facts.find(fact => 
        fact.category === category && !selectedFacts.includes(fact)
      );
      if (categoryFact) {
        selectedFacts.push(categoryFact);
        usedCategories.add(category);
      }
    }

    // Second pass: fill remaining slots with any facts
    for (const fact of facts) {
      if (selectedFacts.length >= this.FACTS_PER_DAY) break;
      if (!selectedFacts.includes(fact)) {
        selectedFacts.push(fact);
      }
    }

    return selectedFacts;
  }

  /**
   * Format fact for display
   */
  static formatFact(fact: FunFact): string {
    let formattedFact = fact.fact;
    
    // Add location and year context if available
    const context = [];
    if (fact.location) context.push(fact.location);
    if (fact.year) context.push(fact.year.toString());
    
    if (context.length > 0) {
      formattedFact += ` (${context.join(', ')})`;
    }
    
    return formattedFact;
  }

  /**
   * Get category icon for display
   */
  static getCategoryIcon(category: FunFact['category']): string {
    const icons = {
      history: '📜',
      trivia: '🎯',
      culture: '🎭',
      architecture: '🏛️',
      'famous-people': '⭐'
    };
    return icons[category] || '📍';
  }

  /**
   * Get category color for styling
   */
  static getCategoryColor(category: FunFact['category']): string {
    const colors = {
      history: 'text-amber-700',
      trivia: 'text-blue-700',
      culture: 'text-purple-700',
      architecture: 'text-green-700',
      'famous-people': 'text-pink-700'
    };
    return colors[category] || 'text-gray-700';
  }
}
