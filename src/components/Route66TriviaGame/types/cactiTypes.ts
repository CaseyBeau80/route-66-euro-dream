
export interface CactusGrowthStage {
  id: string;
  name: string;
  description: string;
  minCorrectAnswers: number;
  height: string;
  icon: string;
  color: string;
}

export interface CactiState {
  currentStage: number;
  correctAnswers: number;
  unlockedStages: CactusGrowthStage[];
  showReward: boolean;
}

export const CACTUS_GROWTH_STAGES: CactusGrowthStage[] = [
  {
    id: 'seed',
    name: 'Desert Seed',
    description: 'Your journey begins in the desert soil',
    minCorrectAnswers: 0,
    height: 'h-2',
    icon: '🌱',
    color: 'text-green-600'
  },
  {
    id: 'sprout',
    name: 'Tiny Sprout',
    description: 'First signs of life in the desert',
    minCorrectAnswers: 1,
    height: 'h-4',
    icon: '🌿',
    color: 'text-green-500'
  },
  {
    id: 'young',
    name: 'Young Cactus',
    description: 'Growing strong under the desert sun',
    minCorrectAnswers: 2,
    height: 'h-8',
    icon: '🌵',
    color: 'text-green-400'
  },
  {
    id: 'mature',
    name: 'Desert Sentinel',
    description: 'A proud guardian of Route 66',
    minCorrectAnswers: 3,
    height: 'h-12',
    icon: '🌵',
    color: 'text-green-300'
  },
  {
    id: 'blooming',
    name: 'Blooming Saguaro',
    description: 'A magnificent desert masterpiece!',
    minCorrectAnswers: 4,
    height: 'h-16',
    icon: '🌵',
    color: 'text-pink-400'
  },
  {
    id: 'master',
    name: 'Desert Master',
    description: 'The ultimate Route 66 desert guardian!',
    minCorrectAnswers: 5,
    height: 'h-20',
    icon: '🌵',
    color: 'text-amber-400'
  }
];
