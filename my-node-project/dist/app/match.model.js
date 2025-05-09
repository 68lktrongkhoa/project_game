"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
// match.model.ts
class Match {
    constructor(id, player1, player2, winner, date) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.winner = winner;
        this.date = date;
    }
}
exports.Match = Match;
