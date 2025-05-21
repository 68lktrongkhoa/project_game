"use strict";
// import { Injectable } from '@angular/core';
// import { Player } from '../model/player.model';
// import { Match, MatchPlayerInfo, KdaStats } from '../../matchs/models/match.model';
// import { ChampionService } from '../../champions/services/champion.service';
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EloService = void 0;
// const AVAILABLE_TIERS_MAP: { [key: string]: string } = {
//   'unranked': 'assets/icons/unranked.png',
//   'iron': 'assets/icons/iron.png',
//   'bronze': 'assets/icons/bronze.png',
//   'silver': 'assets/icons/silver.png',
//   'gold': 'assets/icons/gold.png',
//   'platinum': 'assets/icons/platinum.png',
//   'emerald': 'assets/icons/emerald.png',
//   'diamond': 'assets/icons/diamond.png',
//   'master': 'assets/icons/master.png',
//   'grandmaster': 'assets/icons/grandmaster.png',
//   'challenger': 'assets/icons/challenger.png',
// };
// const TIER_NAMES_LOWERCASE = Object.keys(AVAILABLE_TIERS_MAP);
// const TIERS_WITH_DIVISIONS = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond'];
// const DIVISIONS = ['I', 'II', 'III', 'IV'];
// function getRandomVisualRank(): { tier: string, division: string } {
//   const randomTierIndex = Math.floor(Math.random() * TIER_NAMES_LOWERCASE.length);
//   const randomLowerTierName = TIER_NAMES_LOWERCASE[randomTierIndex];
//   const displayTierName = randomLowerTierName.charAt(0).toUpperCase() + randomLowerTierName.slice(1);
//   let randomDivision = '';
//   if (TIERS_WITH_DIVISIONS.includes(randomLowerTierName)) {
//     const randomDivisionIndex = Math.floor(Math.random() * DIVISIONS.length);
//     randomDivision = DIVISIONS[randomDivisionIndex];
//   }
//   return {
//     tier: displayTierName,
//     division: randomDivision
//   };
// }
// @Injectable({
//   providedIn: 'root'
// })
// export class EloService {
//   private idCounter = 1;
//   private players: Player[] = [];
//   private matches: Match[] = [];
//   private K_FACTOR = 32;
//   constructor(private championService: ChampionService) {
//     for (let i = 1; i <= 20; i++) {
//       const allChampions = this.championService.getChampions();
//       const favoriteChampion = allChampions.length > 0
//         ? allChampions[Math.floor(Math.random() * allChampions.length)]
//         : undefined;
//       const randomRank = getRandomVisualRank();
//       this.players.push({
//         id: i,
//         name: `Player ${i}`,
//         rating: 1200,
//         attack: Math.floor(Math.random() * 30) + 50,
//         defense: Math.floor(Math.random() * 30) + 50,
//         speed: Math.floor(Math.random() * 30) + 50,
//         magic: Math.floor(Math.random() * 30) + 50,
//         support: Math.floor(Math.random() * 30) + 50,
//         favoriteChampionId: favoriteChampion?.id,
//         visualRank: randomRank,
//         lp: TIERS_WITH_DIVISIONS.includes(randomRank.tier.toLowerCase()) ? Math.floor(Math.random() * 101) : 0
//       });
//     }
//     this.generateInitialRandomMatches(100);
//     this.idCounter = this.matches.length > 0 ? Math.max(...this.matches.map(m => m.id)) + 1 : 1;
//   }
//   public getPlayerRankIcon(tier: string | undefined): string {
//     if (!tier) {
//         return 'assets/icons/unranked.png';
//     }
//     const lowerTier = tier.toLowerCase();
//     const iconPath = AVAILABLE_TIERS_MAP[lowerTier];
//     return iconPath || 'assets/icons/unranked.png';
//   }
//   private generateInitialRandomMatches(numberOfMatches: number): void {
//     if (this.players.length < 2) {
//       console.warn('Not enough players to generate initial matches.');
//       return;
//     }
//     const champions = this.championService.getChampions();
//     if (champions.length === 0) {
//         console.warn('No champions available to generate initial matches.');
//         return;
//     }
//     for (let i = 0; i < numberOfMatches; i++) {
//       let p1Index = Math.floor(Math.random() * this.players.length);
//       let p2Index = Math.floor(Math.random() * this.players.length);
//       while (p1Index === p2Index) {
//         p2Index = Math.floor(Math.random() * this.players.length);
//       }
//       const player1Ref = this.players[p1Index];
//       const player2Ref = this.players[p2Index];
//       const player1EloBefore = player1Ref.rating;
//       const player2EloBefore = player2Ref.rating;
//       const champion1 = this.championService.getRandomChampion();
//       const champion2 = this.championService.getRandomChampion();
//       if (!champion1 || !champion2) {
//         console.warn(`Could not get random champion for initial match ${i}. Skipping.`);
//         continue;
//       }
//       const player1Snapshot: Player = { ...player1Ref };
//       const player2Snapshot: Player = { ...player2Ref };
//       const winnerRef = Math.random() > 0.5 ? player1Ref : player2Ref;
//       const { newRating1, newRating2 } = this.calculateNewElo(player1Ref, player2Ref, winnerRef);
//       const player1EloChange = newRating1 - player1EloBefore;
//       const player2EloChange = newRating2 - player2EloBefore;
//       const kda1: KdaStats = {
//           kills: Math.floor(Math.random() * 10),
//           deaths: Math.floor(Math.random() * 10),
//           assists: Math.floor(Math.random() * 15)
//       };
//       const kda2: KdaStats = {
//           kills: Math.floor(Math.random() * 10),
//           deaths: Math.floor(Math.random() * 10),
//           assists: Math.floor(Math.random() * 15)
//       };
//       const match: Match = {
//         id: this.idCounter++,
//         player1Info: {
//           player: player1Snapshot,
//           championUsed: champion1,
//           eloBeforeMatch: player1EloBefore,
//           eloChange: player1EloChange,
//           kda: kda1
//         },
//         player2Info: {
//           player: player2Snapshot,
//           championUsed: champion2,
//           eloBeforeMatch: player2EloBefore,
//           eloChange: player2EloChange,
//           kda: kda2
//         },
//         winnerId: winnerRef.id,
//         date: new Date(new Date().getTime() - (numberOfMatches - i) * 60000 * 60 * 3)
//       };
//       this.matches.push(match);
//       player1Ref.rating = newRating1;
//       player2Ref.rating = newRating2;
//       player1Ref.visualRank = this.getVisualRankFromElo(player1Ref.rating);
//       player2Ref.visualRank = this.getVisualRankFromElo(player2Ref.rating);
//     }
//     this.players.sort((a, b) => b.rating - a.rating);
//     this.matches.sort((a, b) => b.date.getTime() - a.date.getTime());
//   }
//   private calculateNewElo(player1: Player, player2: Player, winner: Player): { newRating1: number, newRating2: number } {
//     const Ra = player1.rating;
//     const Rb = player2.rating;
//     const Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
//     const Eb = 1 / (1 + Math.pow(10, (Ra - Rb) / 400));
//     let newRating1: number;
//     let newRating2: number;
//     if (winner.id === player1.id) {
//       newRating1 = Math.round(Ra + this.K_FACTOR * (1 - Ea));
//       newRating2 = Math.round(Rb + this.K_FACTOR * (0 - Eb));
//     } else {
//       newRating1 = Math.round(Ra + this.K_FACTOR * (0 - Ea));
//       newRating2 = Math.round(Rb + this.K_FACTOR * (1 - Eb));
//     }
//     return { newRating1, newRating2 };
//   }
//   private updateElo(player1: Player, player2: Player, winner: Player): { player1EloChange: number, player2EloChange: number } {
//     const player1EloBefore = player1.rating;
//     const player2EloBefore = player2.rating;
//     const { newRating1, newRating2 } = this.calculateNewElo(player1, player2, winner);
//     player1.rating = newRating1;
//     player2.rating = newRating2;
//     return {
//         player1EloChange: newRating1 - player1EloBefore,
//         player2EloChange: newRating2 - player2EloBefore
//     };
//   }
//   getPlayers(): Player[] {
//     this.players.forEach(player => {
//         player.visualRank = this.getVisualRankFromElo(player.rating);
//     });
//     return [...this.players].sort((a, b) => b.rating - a.rating);
//   }
//   private getVisualRankFromElo(elo: number): { tier: string, division: string, lp: number } {
//     if (elo < 400) return { tier: 'Iron', division: 'IV', lp: elo < 0 ? 0 : elo % 100 };
//     if (elo < 500) return { tier: 'Iron', division: 'III', lp: (elo - 400) % 100 };
//     if (elo < 600) return { tier: 'Iron', division: 'II', lp: (elo - 500) % 100 };
//     if (elo < 700) return { tier: 'Iron', division: 'I', lp: (elo - 600) % 100 };
//     if (elo < 800) return { tier: 'Bronze', division: 'IV', lp: (elo - 700) % 100 };
//     if (elo < 900) return { tier: 'Bronze', division: 'III', lp: (elo - 800) % 100 };
//     if (elo < 1000) return { tier: 'Bronze', division: 'II', lp: (elo - 900) % 100 };
//     if (elo < 1100) return { tier: 'Bronze', division: 'I', lp: (elo - 1000) % 100 };
//     if (elo < 1200) return { tier: 'Silver', division: 'IV', lp: (elo - 1100) % 100 };
//     if (elo < 1300) return { tier: 'Silver', division: 'III', lp: (elo - 1200) % 100 };
//     if (elo < 1400) return { tier: 'Silver', division: 'II', lp: (elo - 1300) % 100 };
//     if (elo < 1500) return { tier: 'Silver', division: 'I', lp: (elo - 1400) % 100 };
//     if (elo < 1600) return { tier: 'Gold', division: 'IV', lp: (elo - 1500) % 100 };
//     if (elo < 1700) return { tier: 'Gold', division: 'III', lp: (elo - 1600) % 100 };
//     if (elo < 1800) return { tier: 'Gold', division: 'II', lp: (elo - 1700) % 100 };
//     if (elo < 1900) return { tier: 'Gold', division: 'I', lp: (elo - 1800) % 100 };
//     if (elo < 2000) return { tier: 'Platinum', division: 'IV', lp: (elo - 1900) % 100 };
//     if (elo < 2100) return { tier: 'Platinum', division: 'III', lp: (elo - 2000) % 100 };
//     if (elo < 2200) return { tier: 'Platinum', division: 'II', lp: (elo - 2100) % 100 };
//     if (elo < 2300) return { tier: 'Platinum', division: 'I', lp: (elo - 2200) % 100 };
//     if (elo < 2400) return { tier: 'Emerald', division: 'IV', lp: (elo - 2300) % 100 };
//     if (elo < 2500) return { tier: 'Emerald', division: 'III', lp: (elo - 2400) % 100 };
//     if (elo < 2600) return { tier: 'Emerald', division: 'II', lp: (elo - 2500) % 100 };
//     if (elo < 2700) return { tier: 'Emerald', division: 'I', lp: (elo - 2600) % 100 };
//     if (elo < 2800) return { tier: 'Diamond', division: 'IV', lp: (elo - 2700) % 100 };
//     if (elo < 2900) return { tier: 'Diamond', division: 'III', lp: (elo - 2800) % 100 };
//     if (elo < 3000) return { tier: 'Diamond', division: 'II', lp: (elo - 2900) % 100 };
//     if (elo < 3100) return { tier: 'Diamond', division: 'I', lp: (elo - 3000) % 100 };
//     if (elo < 3300) {return { tier: 'Master', division: '', lp: elo - 3100 };}
//     if (elo < 3500) { return { tier: 'Grandmaster', division: '', lp: elo - 3300 };}
//     if (elo >= 3500) {return { tier: 'Challenger', division: '', lp: elo - 3500 };}
//     if (elo < 0) return { tier: 'Iron', division: 'IV', lp: 0 }; 
//     return { tier: 'Unranked', division: '', lp: 0 };
// }
//   getMatches(): Match[] {
//     return [...this.matches].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 100);
//   }
//   getPlayerById(playerId: number): Player | undefined {
//     return this.players.find(p => p.id === playerId);
//   }
//   findOpponent(currentPlayerId: number, eloRange: number): Player | null {
//     const currentPlayer = this.getPlayerById(currentPlayerId);
//     if (!currentPlayer) {
//       console.error('Current player not found for matchmaking.');
//       return null;
//     }
//     const lowerBound = currentPlayer.rating - eloRange;
//     const upperBound = currentPlayer.rating + eloRange;
//     const eligibleOpponents = this.players.filter(p =>
//       p.id !== currentPlayerId &&
//       p.rating >= lowerBound &&
//       p.rating <= upperBound
//     );
//     if (eligibleOpponents.length > 0) {
//       const randomIndex = Math.floor(Math.random() * eligibleOpponents.length);
//       return eligibleOpponents[randomIndex];
//     }
//     return null;
//   }
//   createMatch(
//     player1Id: number,
//     player2Id: number,
//     winnerId: number,
//     p1ChampionId: number,
//     p2ChampionId: number,
//     kdaP1?: KdaStats,
//     kdaP2?: KdaStats
//   ): Match | null {
//     const player1 = this.players.find(p => p.id === player1Id); 
//     const player2 = this.players.find(p => p.id === player2Id);
//     const winnerObject = this.players.find(p => p.id === winnerId);
//     if (!player1 || !player2 || !winnerObject) {
//       console.error('Invalid player IDs or winner ID for creating match. One or more players not found.');
//       return null;
//     }
//     if (winnerId !== player1.id && winnerId !== player2.id) {
//         console.error('Winner must be one of the two players.');
//         return null;
//     }
//     const champion1 = this.championService.getChampionById(p1ChampionId);
//     const champion2 = this.championService.getChampionById(p2ChampionId);
//     if (!champion1 || !champion2) {
//         console.error(`Could not find champion with ID ${p1ChampionId} or ${p2ChampionId}.`);
//         return null;
//     }
//     const player1Snapshot: Player = { ...player1, visualRank: { ...player1.visualRank } };
//     const player2Snapshot: Player = { ...player2, visualRank: { ...player2.visualRank } };
//     const player1EloBefore = player1.rating;
//     const player2EloBefore = player2.rating;
//     const { player1EloChange, player2EloChange } = this.updateElo(player1, player2, winnerObject);
//     const finalKdaP1 = kdaP1 || (this.isKdaOptional() ? undefined : { kills: 0, deaths: 0, assists: 0 });
//     const finalKdaP2 = kdaP2 || (this.isKdaOptional() ? undefined : { kills: 0, deaths: 0, assists: 0 });
//     const newMatch: Match = {
//       id: this.idCounter++,
//       player1Info: {
//         player: player1Snapshot,
//         championUsed: champion1,
//         eloBeforeMatch: player1EloBefore,
//         eloChange: player1EloChange,
//         kda: finalKdaP1
//       },
//       player2Info: {
//         player: player2Snapshot,
//         championUsed: champion2,
//         eloBeforeMatch: player2EloBefore,
//         eloChange: player2EloChange,
//         kda: finalKdaP2
//       },
//       winnerId: winnerId,
//       date: new Date()
//     };
//     this.matches.unshift(newMatch);
//     if (this.matches.length > 100) {
//         this.matches.pop();
//     }
//     this.players.sort((a, b) => b.rating - a.rating);
//     return newMatch;
//   }
//   private isKdaOptional(): boolean {
//       return true;
//   }
//   getPlayerMatchHistory(playerId: number): Match[] {
//     return this.matches.filter(
//       match => match.player1Info.player.id === playerId || match.player2Info.player.id === playerId
//     ).sort((a, b) => b.date.getTime() - a.date.getTime());
//   }
// }
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const AVAILABLE_TIERS_MAP = {
    'unranked': 'assets/icons/unranked.png',
    'iron': 'assets/icons/iron.png',
    'bronze': 'assets/icons/bronze.png',
    'silver': 'assets/icons/silver.png',
    'gold': 'assets/icons/gold.png',
    'platinum': 'assets/icons/platinum.png',
    'emerald': 'assets/icons/emerald.png',
    'diamond': 'assets/icons/diamond.png',
    'master': 'assets/icons/master.png',
    'grandmaster': 'assets/icons/grandmaster.png',
    'challenger': 'assets/icons/challenger.png',
};
let EloService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EloService = _classThis = class {
        constructor(http) {
            this.http = http;
            this.apiUrl = 'http://localhost:5000/api';
            console.log('EloService (Frontend) initialized - Interacting with backend at:', this.apiUrl);
        }
        getPlayerRankIcon(tier) {
            if (!tier) {
                return 'assets/icons/unranked.png';
            }
            const lowerTier = tier.toLowerCase();
            const iconPath = AVAILABLE_TIERS_MAP[lowerTier];
            return iconPath || 'assets/icons/unranked.png';
        }
        getPlayers() {
            return this.http.get(`${this.apiUrl}/players`)
                .pipe((0, operators_1.tap)(players => console.log(`Fetched ${players.length} players from backend`)), (0, operators_1.catchError)(this.handleError));
        }
        getPlayerById(playerId) {
            return this.http.get(`${this.apiUrl}/players/${playerId}`)
                .pipe((0, operators_1.tap)(player => console.log(`Fetched player by ID ${playerId}:`, player)), (0, operators_1.catchError)(this.handleError));
        }
        findOpponent(currentPlayerId, eloRange) {
            let params = new http_1.HttpParams()
                .set('currentPlayerId', currentPlayerId)
                .set('eloRange', eloRange.toString());
            return this.http.get(`${this.apiUrl}/players/find-opponent`, { params })
                .pipe((0, operators_1.tap)(opponent => console.log('Opponent found via backend:', opponent)), (0, operators_1.catchError)(this.handleError));
        }
        createMatch(player1Id, player2Id, winnerId, p1ChampionId, p2ChampionId, kdaP1, kdaP2) {
            const matchData = {
                player1Id,
                player2Id,
                winnerId,
                champion1Id: p1ChampionId,
                champion2Id: p2ChampionId,
                kdaP1,
                kdaP2
            };
            return this.http.post(`${this.apiUrl}/matches`, matchData)
                .pipe((0, operators_1.tap)(newMatch => console.log('Match created via backend:', newMatch)), (0, operators_1.catchError)(this.handleError));
        }
        getMatches() {
            return this.http.get(`${this.apiUrl}/matches`)
                .pipe((0, operators_1.tap)(matches => console.log(`Fetched ${matches.length} matches from backend`)), (0, operators_1.catchError)(this.handleError));
        }
        getPlayerMatchHistory(playerId) {
            return this.http.get(`${this.apiUrl}/matches/player/${playerId}`)
                .pipe((0, operators_1.tap)(matches => console.log(`Fetched match history for player ${playerId}:`, matches.length)), (0, operators_1.catchError)(this.handleError));
        }
        handleError(error) {
            console.error('API Error Details:', error);
            let errorMessage = 'An unknown error occurred with the API!';
            if (error.error instanceof ErrorEvent) {
                errorMessage = `Client-side/Network error: ${error.error.message}`;
            }
            else {
                errorMessage = `Backend returned code ${error.status}, ` +
                    `body was: ${JSON.stringify(error.error) || error.message}`;
            }
            return (0, rxjs_1.throwError)(() => new Error(errorMessage));
        }
    };
    __setFunctionName(_classThis, "EloService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EloService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EloService = _classThis;
})();
exports.EloService = EloService;
