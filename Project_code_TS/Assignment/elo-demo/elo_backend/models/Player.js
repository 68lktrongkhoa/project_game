// elo_backend/models/Player.js
const mongoose = require('mongoose');
const { getVisualRankFromElo } = require('../services/playerUpdateService');

const VisualRankSchema = new mongoose.Schema({
    tier: { type: String, default: 'Unranked' },
    division: { type: String, default: '' },
});

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, default: 1200 },
    attack: { type: Number, default: () => Math.floor(Math.random() * 30) + 50 },
    defense: { type: Number, default: () => Math.floor(Math.random() * 30) + 50 },
    speed: { type: Number, default: () => Math.floor(Math.random() * 30) + 50 },
    magic: { type: Number, default: () => Math.floor(Math.random() * 30) + 50 },
    support: { type: Number, default: () => Math.floor(Math.random() * 30) + 50 },
    favoriteChampionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Champion', default: null },
    visualRank: { type: VisualRankSchema, default: () => ({ tier: 'Unranked', division: ''}) },
    lp: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

PlayerSchema.methods.updateVisualRankAndLP = function() {
    const rankInfo = getVisualRankFromElo(this.rating);
    this.visualRank.tier = rankInfo.tier;
    this.visualRank.division = rankInfo.division;
    this.lp = rankInfo.lp;
};

PlayerSchema.pre('save', function(next) {
    if (this.isModified('rating') || this.isNew) {
        this.updateVisualRankAndLP();
    }
    next();
});


module.exports = mongoose.model('Player', PlayerSchema);