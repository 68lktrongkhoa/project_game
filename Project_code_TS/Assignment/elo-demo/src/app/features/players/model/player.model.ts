import { Champion } from '../../champions/model/champion.model'; // Import Champion

export interface Player {
  id: any;
  name: string;
  rating: number;
  lp?: number;
  visualRank?: {
    tier?: string | undefined;
    division?: string | undefined;
    iconUrl?: string;
  };
  inPromotionSeries?: boolean;
  promoWins?: number;
  promoNeeded?: number;
  attack: number;
  defense: number;
  speed: number;
  magic: number;
  support: number;
  favoriteChampionId?: number; 
  matchesPlayed?: number;
  wins?: number;
  losses?: number;
  createdAt?: Date;
}