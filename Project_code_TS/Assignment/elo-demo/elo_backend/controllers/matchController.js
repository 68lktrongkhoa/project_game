const Match = require('../models/Match');
const Player = require('../models/Player');
const Champion = require('../models/Champion');
const { calculateNewEloRatings } = require('../services/eloCalculationService');

exports.createMatch = async (req, res) => {
    const { player1Id, player2Id, winnerId, champion1Id, champion2Id, kdaP1, kdaP2 } = req.body;

    try {
        const player1 = await Player.findById(player1Id);
        const player2 = await Player.findById(player2Id);
        const champion1 = await Champion.findById(champion1Id);
        const champion2 = await Champion.findById(champion2Id);

        if (!player1 || !player2) {
            return res.status(404).json({ message: 'One or more players not found' });
        }
        if (!champion1 || !champion2) {
            return res.status(404).json({ message: 'One or more champions not found' });
        }
        if (winnerId !== player1Id && winnerId !== player2Id) {
             return res.status(400).json({ message: 'Winner must be one of the two players' });
        }

        const player1EloBefore = player1.rating;
        const player2EloBefore = player2.rating;

        const player1Wins = winnerId === player1Id;
        const { newRating1, newRating2 } = calculateNewEloRatings(player1EloBefore, player2EloBefore, player1Wins);

        const player1InfoForMatch = {
            player: player1._id, 
            championUsed: champion1._id,
            eloBeforeMatch: player1EloBefore,
            eloChange: newRating1 - player1EloBefore,
            kda: kdaP1
        };
        const player2InfoForMatch = {
            player: player2._id,
            championUsed: champion2._id,
            eloBeforeMatch: player2EloBefore,
            eloChange: newRating2 - player2EloBefore,
            kda: kdaP2
        };

        player1.rating = newRating1;
        player1.updateVisualRank();
        await player1.save();

        player2.rating = newRating2;
        player2.updateVisualRank();
        await player2.save();

        const match = new Match({
            player1Info: player1InfoForMatch,
            player2Info: player2InfoForMatch,
            winnerId: winnerId, 
            date: new Date()
        });

        const newMatch = await match.save();
        res.status(201).json(newMatch);

    } catch (err) {
        console.error("Error creating match:", err);
        res.status(500).json({ message: 'Server error creating match', error: err.message });
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .sort({ date: -1 })
            .limit(100) // Giới hạn 100 trận mới nhất
            .populate('player1Info.player', 'name rating visualRank') // Populate thông tin cần thiết
            .populate('player1Info.championUsed', 'name imageUrl')
            .populate('player2Info.player', 'name rating visualRank')
            .populate('player2Info.championUsed', 'name imageUrl');
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};