
export interface CactusGrowthStage {
  id: string;
  name: string;
  description: string;
  minCorrectAnswers: number;
  height: string;
  icon: string;
  color: string;
  tooltip: string;
  region: string;
  flavorText: string;
}

export interface CactiState {
  currentStage: number;
  correctAnswers: number;
  unlockedStages: CactusGrowthStage[];
  showReward: boolean;
}

export const CACTUS_GROWTH_STAGES: CactusGrowthStage[] = [
  {
    id: 'seedling',
    name: 'Desert Seedling',
    description: 'A tiny seed waiting in the Mojave sand',
    minCorrectAnswers: 0,
    height: 'h-2',
    icon: '🌱',
    color: 'text-amber-600',
    tooltip: 'Even the mighty Saguaro starts as a tiny seed, surviving in temperatures over 120°F!',
    region: 'California Desert',
    flavorText: 'Your Route 66 knowledge journey begins in the vast Mojave Desert...'
  },
  {
    id: 'sprout',
    name: 'Arizona Sprout',
    description: 'First brave shoots emerge under the desert sun',
    minCorrectAnswers: 1,
    height: 'h-4',
    icon: '🌿',
    color: 'text-green-600',
    tooltip: 'Desert plants grow incredibly slowly - a Saguaro may only be 1 inch tall after 10 years!',
    region: 'Arizona Borderlands',
    flavorText: 'Like a desert traveler, you\'re finding your way through the southwestern wilderness...'
  },
  {
    id: 'barrel',
    name: 'Barrel Cactus',
    description: 'Growing strong like the iconic barrel cacti of Route 66',
    minCorrectAnswers: 2,
    height: 'h-8',
    icon: '🌵',
    color: 'text-orange-500',
    tooltip: 'Barrel cacti can live over 100 years and tilt toward the south, earning the nickname "compass cactus"!',
    region: 'Sonoran Desert',
    flavorText: 'Your knowledge is as sturdy as the barrel cacti that dot the Arizona landscape...'
  },
  {
    id: 'cholla',
    name: 'Cholla Guardian',
    description: 'Standing tall like the jumping cholla of the desert',
    minCorrectAnswers: 3,
    height: 'h-12',
    icon: '🌵',
    color: 'text-red-400',
    tooltip: 'Cholla cacti segments "jump" onto passersby - they detach so easily that a breeze can make them airborne!',
    region: 'New Mexico High Desert',
    flavorText: 'Like the resilient cholla, your Route 66 expertise is becoming formidable...'
  },
  {
    id: 'prickly-pear',
    name: 'Prickly Pear Pioneer',
    description: 'Blooming with the vibrant flowers of the desert',
    minCorrectAnswers: 4,
    height: 'h-16',
    icon: '🌺',
    color: 'text-pink-500',
    tooltip: 'Prickly pear cacti produce beautiful yellow, red, or pink flowers and edible fruits called tunas!',
    region: 'Texas Panhandle',
    flavorText: 'Your knowledge blooms like desert flowers after a rare summer rain...'
  },
  {
    id: 'saguaro',
    name: 'Saguaro Sentinel',
    description: 'The ultimate desert guardian of Route 66',
    minCorrectAnswers: 5,
    height: 'h-20',
    icon: '🌵',
    color: 'text-amber-400',
    tooltip: 'Saguaro cacti can live 200+ years, grow 40+ feet tall, and are found only in the Sonoran Desert!',
    region: 'Arizona Saguaro Country',
    flavorText: 'You\'ve become a true Route 66 master, standing tall like the ancient Saguaro sentinels!'
  }
];
