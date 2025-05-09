// src/app/match.model.ts
import { Player } from './player.model';
import { Champion } from './champion.model';

export interface ParticipantStats {
  championId: number;
  gold: number;
  cs: number;
  kills: number;
  deaths: number;
  assists: number;
  level: number;
  xp: number;
  damageDealtToChampions: number;
  // You can add other stats here like vision score, damage taken, etc.
}

export interface GameTimelineEvent {
  timestamp: number; // e.g., minutes into the game
  participantStats: ParticipantStats[]; // An array, typically one entry per player in the match
  // You could also add other event-specific details here if needed, e.g.,
  // eventType?: 'CHAMPION_KILL' | 'OBJECTIVE_TAKEN' | 'STATS_FRAME';
  // details?: any;
}

// Thông tin chi tiết của một người chơi trong một trận đấu cụ thể
export interface MatchPlayerInfo {
  player: Player;         // Đối tượng Player
  championUsed: Champion; 
  // ID của tướng đã sử dụng
}

// Đại diện cho một trận đấu đã diễn ra
export interface Match {
  id: number;
  player1Info: MatchPlayerInfo;
  player2Info: MatchPlayerInfo;
  winnerId: number;
  date: Date;
  timelineData?: GameTimelineEvent[]; // Make timelineData optional
}

// Không cần class Match nếu bạn chỉ dùng interface để định nghĩa cấu trúc.
// Nếu bạn muốn có các phương thức liên quan đến Match, thì class mới hữu ích.
// Hiện tại, với cách bạn đang dùng, interface là đủ.
/*
export class Match {
  constructor(
    public id: number,
    public player1Info: MatchPlayerInfo, // Cập nhật ở đây
    public player2Info: MatchPlayerInfo, // Cập nhật ở đây
    public winnerId: number,             // Cập nhật ở đây
    public date: Date,
  ) {}
}
*/