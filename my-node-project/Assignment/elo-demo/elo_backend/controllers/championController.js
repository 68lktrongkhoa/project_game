// elo_backend/controllers/championController.js
const Champion = require('../models/Champion');

exports.getAllChampions = async (req, res) => {
    try {
        const champions = await Champion.find();
        res.json(champions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching champions', error: err.message });
    }
};

exports.getChampionById = async (req, res) => {
    try {
        const champion = await Champion.findById(req.params.id);
        if (!champion) return res.status(404).json({ message: 'Champion not found' });
        res.json(champion);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching champion', error: err.message });
    }
};

exports.createChampion = async (req, res) => {
    try {
        const champion = new Champion(req.body);
        await champion.save();
        res.status(201).json(champion);
    } catch (err) {
        res.status(500).json({ message: 'Error creating champion', error: err.message });
    }
};