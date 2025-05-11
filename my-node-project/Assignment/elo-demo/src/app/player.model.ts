import { Champion } from './champion.model'; // Import Champion
export interface Player {
  id: number;
  name: string;
  rating: number;
  attack: number;
  defense: number;
  speed: number;
  magic: number;
  support: number;
  favoriteChampionId?: number; 
}