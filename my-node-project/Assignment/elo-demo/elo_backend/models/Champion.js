const mongoose = require('mongoose');

const AbilitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

const ChampionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    championClass: { type: String, required: true }, 
    abilities: [AbilitySchema],
    baseStats: {
        attack: Number,
        defense: Number,
        magic: Number,
        speed: Number,
        support: Number
    }
});

module.exports = mongoose.model('Champion', ChampionSchema);