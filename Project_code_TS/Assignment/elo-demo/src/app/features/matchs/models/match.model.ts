
import { Player } from '../../players/model/player.model';
import { Champion } from '../../champions/model/champion.model';

export interface ParticipantStats {
  championId: string;
  gold: number;
  cs: number;
  kills: number;
  deaths: number;
  assists: number;
  level: number;
  xp: number;
  damageDealtToChampions: number;
}

export interface KdaStats {
  kills: number;
  deaths: number;
  assists: number;
}


export interface GameTimelineEvent {
  timestamp: number;
  participantStats: ParticipantStats[];
}
export interface MatchPlayerInfo {
  player: Player;
  championUsed: Champion; 
  eloBeforeMatch: number;
  eloChange: number;
  kda?: KdaStats;
  damageDealtToChampions?: number;

}


export interface Match {
  id: number;
  player1Info: MatchPlayerInfo;
  player2Info: MatchPlayerInfo;
  winnerId: number;
  date: Date;
  timelineData?: GameTimelineEvent[]; 
}