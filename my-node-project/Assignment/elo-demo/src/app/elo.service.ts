// src/app/elo.service.ts
import { Injectable } from '@angular/core';
import { Player } from './player.model';
import { Match, MatchPlayerInfo } from './match.model';
import { Champion } from './champion.model'; // Cần nếu bạn kiểm tra type Champion
import { ChampionService } from './champion.service';

@Injectable({
  providedIn: 'root'
})
export class EloService {
  private idCounter = 1; // Sẽ được cập nhật sau khi generateInitialRandomMatches
  private players: Player[] = [];
  private matches: Match[] = [];
  private K_FACTOR = 32;

  constructor(private championService: ChampionService) {
    for (let i = 1; i <= 20; i++) {
      const allChampions = this.championService.getChampions(); // Lấy danh sách champions từ service
      const favoriteChampion = allChampions.length > 0
        ? allChampions[Math.floor(Math.random() * allChampions.length)]
        : undefined;

      this.players.push({
        id: i,
        name: `Player ${i}`,
        rating: 1200,
        attack: Math.floor(Math.random() * 30) + 50,
        defense: Math.floor(Math.random() * 30) + 50,
        speed: Math.floor(Math.random() * 30) + 50,
        magic: Math.floor(Math.random() * 30) + 50,
        support: Math.floor(Math.random() * 30) + 50,
        favoriteChampionId: favoriteChampion?.id
      });
    }
    this.generateInitialRandomMatches(100);
    this.idCounter = this.matches.length > 0 ? Math.max(...this.matches.map(m => m.id)) + 1 : 1; // Đảm bảo idCounter chính xác
  }

  private generateInitialRandomMatches(numberOfMatches: number): void {
    if (this.players.length < 2) {
      console.warn('Not enough players to generate initial matches.');
      return;
    }
    const champions = this.championService.getChampions();
    if (champions.length === 0) {
        console.warn('No champions available to generate initial matches.');
        return;
    }

    for (let i = 0; i < numberOfMatches; i++) {
      let p1Index = Math.floor(Math.random() * this.players.length);
      let p2Index = Math.floor(Math.random() * this.players.length);
      while (p1Index === p2Index) {
        p2Index = Math.floor(Math.random() * this.players.length);
      }

      const player1 = this.players[p1Index];
      const player2 = this.players[p2Index];

      // Sử dụng getRandomChampion từ ChampionService
      const champion1 = this.championService.getRandomChampion();
      const champion2 = this.championService.getRandomChampion();

      // Kiểm tra champion1, champion2 có tồn tại không (getRandomChampion có thể trả về undefined)
      if (!champion1 || !champion2) {
        console.warn(`Could not get random champion for initial match ${i}. Skipping.`);
        continue; // Bỏ qua lần lặp này nếu không có champion
      }

      const winner = Math.random() > 0.5 ? player1 : player2;

      const match: Match = {
        id: this.idCounter++,
        player1Info: { player: player1, championUsed: champion1 },
        player2Info: { player: player2, championUsed: champion2 },
        winnerId: winner.id,
        date: new Date(new Date().getTime() - (numberOfMatches - i) * 60000 * 60 * 3) // Tạo ngày ngẫu nhiên trong quá khứ
      };

      this.matches.push(match);
      this.updateElo(player1, player2, winner);
    }
    this.players.sort((a, b) => b.rating - a.rating);
    this.matches.sort((a, b) => b.date.getTime() - a.date.getTime()); // Sắp xếp match theo ngày giảm dần
  }

  private updateElo(player1: Player, player2: Player, winner: Player): void {
    const Ra = player1.rating;
    const Rb = player2.rating;
    const Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
    const Eb = 1 / (1 + Math.pow(10, (Ra - Rb) / 400));

    let newRating1: number;
    let newRating2: number;

    if (winner.id === player1.id) {
      newRating1 = Math.round(Ra + this.K_FACTOR * (1 - Ea));
      newRating2 = Math.round(Rb + this.K_FACTOR * (0 - Eb));
    } else {
      newRating1 = Math.round(Ra + this.K_FACTOR * (0 - Ea));
      newRating2 = Math.round(Rb + this.K_FACTOR * (1 - Eb));
    }

    const p1InArray = this.players.find(p => p.id === player1.id);
    const p2InArray = this.players.find(p => p.id === player2.id);

    if (p1InArray) p1InArray.rating = newRating1;
    if (p2InArray) p2InArray.rating = newRating2;
  }

  getPlayers(): Player[] {
    return [...this.players].sort((a, b) => b.rating - a.rating);
  }

  getMatches(): Match[] {
    // Sắp xếp lại ở đây để đảm bảo luôn trả về danh sách đã sắp xếp
    return [...this.matches].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 100);
  }

  getPlayerById(playerId: number): Player | undefined {
    return this.players.find(p => p.id === playerId);
  }

  findOpponent(currentPlayerId: number, eloRange: number): Player | null {
    const currentPlayer = this.getPlayerById(currentPlayerId);
    if (!currentPlayer) {
      console.error('Current player not found for matchmaking.');
      return null;
    }
    const lowerBound = currentPlayer.rating - eloRange;
    const upperBound = currentPlayer.rating + eloRange;
    const eligibleOpponents = this.players.filter(p =>
      p.id !== currentPlayerId &&
      p.rating >= lowerBound &&
      p.rating <= upperBound
    );
    if (eligibleOpponents.length > 0) {
      const randomIndex = Math.floor(Math.random() * eligibleOpponents.length);
      return eligibleOpponents[randomIndex];
    }
    return null;
  }

  createMatch(
    player1Id: number,      // Thay 'any' bằng 'number'
    player2Id: number,      // Thay 'any' bằng 'number'
    winnerId: number,       // Thay 'any' bằng 'number'
    p1ChampionId: number,   // Thêm tham số này
    p2ChampionId: number    // Thêm tham số này
  ): Match | null {
    const player1 = this.getPlayerById(player1Id);
    const player2 = this.getPlayerById(player2Id);
    const winnerObject = this.getPlayerById(winnerId); // Cần cho updateElo

    if (!player1 || !player2 || !winnerObject) {
      console.error('Invalid player IDs or winner ID for creating match. One or more players not found.');
      return null;
    }

    if (winnerId !== player1.id && winnerId !== player2.id) {
        console.error('Winner must be one of the two players.');
        return null;
    }

    // Lấy champion dựa trên ID từ ChampionService
    const champion1 = this.championService.getChampionById(p1ChampionId);
    const champion2 = this.championService.getChampionById(p2ChampionId);

    if (!champion1 || !champion2) { // Kiểm tra xem champion có thực sự lấy được không
        console.error(`Could not find champion with ID ${p1ChampionId} or ${p2ChampionId}.`);
        return null;
    }

    const newMatch: Match = {
      id: this.idCounter++,
      player1Info: { player: player1, championUsed: champion1 }, // Sử dụng champion đã lấy
      player2Info: { player: player2, championUsed: champion2 }, // Sử dụng champion đã lấy
      winnerId: winnerId,
      date: new Date()
      // timelineData sẽ được app.component.ts thêm vào sau
    };

    this.matches.unshift(newMatch); // Thêm vào đầu để trận mới nhất hiển thị trước
    if (this.matches.length > 100) { // Giới hạn số lượng trận đấu
        this.matches.pop(); // Xóa trận cũ nhất nếu vượt quá giới hạn
    }
    
    this.updateElo(player1, player2, winnerObject);
    this.players.sort((a, b) => b.rating - a.rating); // Sắp xếp lại players sau khi cập nhật ELO
    
    return newMatch;
  }

  getPlayerMatchHistory(playerId: number): Match[] {
    return this.matches.filter(
      match => match.player1Info.player.id === playerId || match.player2Info.player.id === playerId
    ).sort((a, b) => b.date.getTime() - a.date.getTime()); // Đảm bảo sắp xếp
  }
}