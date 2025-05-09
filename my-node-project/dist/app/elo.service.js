"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EloService {
    constructor() {
        this.idCounter = 1;
        this.players = [];
        this.matches = [];
        this.K_FACTOR = 32;
        for (let i = 1; i <= 100; i++) {
            this.players.push({
                id: i,
                name: `Player ${i}`,
                rating: 1200,
                attack: Math.floor(Math.random() * 80) + 20,
                defense: Math.floor(Math.random() * 80) + 20,
                speed: Math.floor(Math.random() * 80) + 20,
                magic: Math.floor(Math.random() * 80) + 20,
                support: Math.floor(Math.random() * 80) + 20
            });
        }
        this.generateRandomMatches();
    }
    generateRandomMatches() {
        for (let i = 0; i < 100; i++) {
            const player1 = this.players[Math.floor(Math.random() * this.players.length)];
            const player2 = this.players[Math.floor(Math.random() * this.players.length)];
            if (player1.id === player2.id)
                continue;
            const winner = Math.random() > 0.5 ? player1 : player2;
            const match = {
                id: this.idCounter++,
                player1,
                player2,
                winner,
                date: new Date().toLocaleString('en-US').slice(0, 10)
            };
            this.matches.push(match);
            this.updateElo(player1, player2, winner);
        }
    }
    updateElo(player1, player2, winner) {
        const Ra = player1.rating;
        const Rb = player2.rating;
        const Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
        const Eb = 1 / (1 + Math.pow(10, (Ra - Rb) / 400));
        if (winner.id === player1.id) {
            player1.rating = Math.round(Ra + this.K_FACTOR * (1 - Ea));
            player2.rating = Math.round(Rb + this.K_FACTOR * (0 - Eb));
        }
        else {
            player1.rating = Math.round(Ra + this.K_FACTOR * (0 - Ea));
            player2.rating = Math.round(Rb + this.K_FACTOR * (1 - Eb));
        }
    }
    getPlayers() {
        return this.players;
    }
    getMatches() {
        return this.matches.slice(-100);
    }
    getPlayerMatchHistory(playerId) {
        return this.matches.filter(match => match.player1.id === playerId || match.player2.id === playerId) || [];
    }
}
exports.default = EloService;
