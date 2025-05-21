// elo_backend/models/Champion.js
const mongoose = require('mongoose');

const AbilitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
}, { _id: false });

const ChampionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    championClass: { type: String, required: true },
    abilities: [AbilitySchema],
    baseStats: {
        health: { type: Number, default: 100 },
        mana: { type: Number, default: 0 },
        attackDamage: { type: Number, default: 0 },
        abilityPower: { type: Number, default: 100 },
        armor: { type: Number, default: 0 },
        magicResist: { type: Number, default: 0 },
        movementSpeed: { type: Number, default: 0 },
        attackSpeed: { type: Number, default: 100 },
        critChance: { type: Number, default: 0 },
    }
});

module.exports = mongoose.model('Champion', ChampionSchema);