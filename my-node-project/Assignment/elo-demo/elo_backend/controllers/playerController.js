// elo_backend/controllers/playerController.js
const Player = require('../models/Player');

exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find().sort({ rating: -1 }).populate('favoriteChampionId', 'name imageUrl');
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching players', error: err.message });
    }
};

exports.getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).populate('favoriteChampionId', 'name imageUrl');
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching player', error: err.message });
    }
};

exports.findOpponent = async (req, res) => {
    const { currentPlayerId, eloRange } = req.query;
    const range = parseInt(eloRange, 10);

    if (!currentPlayerId || isNaN(range)) {
        return res.status(400).json({ message: 'Invalid parameters for finding opponent.' });
    }

    try {
        const currentPlayer = await Player.findById(currentPlayerId);
        if (!currentPlayer) {
            return res.status(404).json({ message: 'Current player not found' });
        }

        const lowerBound = currentPlayer.rating - range;
        const upperBound = currentPlayer.rating + range;

        const eligibleOpponents = await Player.find({
            _id: { $ne: currentPlayerId },
            rating: { $gte: lowerBound, $lte: upperBound }
        });

        if (eligibleOpponents.length > 0) {
            const randomIndex = Math.floor(Math.random() * eligibleOpponents.length);
            res.json(eligibleOpponents[randomIndex]);
        } else {
            res.json(null);
        }
    } catch (err) {
        res.status(500).json({ message: 'Error finding opponent', error: err.message });
    }
};