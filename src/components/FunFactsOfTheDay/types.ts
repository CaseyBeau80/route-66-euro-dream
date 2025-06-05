
export interface FunFact {
  id: string;
  fact: string;
  category: 'history' | 'trivia' | 'culture' | 'architecture' | 'famous-people';
  location?: string;
  year?: number;
  source?: string;
}

export interface DailyFacts {
  date: string;
  facts: FunFact[];
}
