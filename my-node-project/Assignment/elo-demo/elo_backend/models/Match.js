// elo_backend/models/Match.js
const mongoose = require('mongoose');

const KdaStatsSchema = new mongoose.Schema({
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    assists: { type: Number, default: 0 }
}, { _id: false });

const MatchPlayerInfoSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    championUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'Champion', required: true },
    eloBeforeMatch: { type: Number, required: true },
    eloChange: { type: Number, required: true },
    kda: { type: KdaStatsSchema }
}, { _id: false });

const MatchSchema = new mongoose.Schema({
    player1Info: { type: MatchPlayerInfoSchema, required: true },
    player2Info: { type: MatchPlayerInfoSchema, required: true },
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    date: { type: Date, default: Date.now },
    timelineData: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('Match', MatchSchema);