// elo_backend/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
router.get('/', async (req, res) => {
    try {
      const matches = await Match.find()
        .populate('player1Info.player', 'name rating') 
        .populate('player1Info.championUsed')       
        .populate('player2Info.player', 'name rating') 
        .populate('player2Info.championUsed')       
        .populate('winnerId', 'name')  
        .sort({ date: -1 })
        .limit(100);
      res.json(matches);
    } catch (err) {
      console.error('Error fetching matches:', err.message, err.stack);
      res.status(500).send('Server Error when getting matches');
    }
  });
router.post('/', async (req, res) => {
    // ... (logic tạo trận đấu của bạn ở đây, tương tự như trong EloService frontend cũ)
    // Ví dụ:
    const { player1Id, player2Id, winnerId, champion1Id, champion2Id, kdaP1, kdaP2 } = req.body;
    // ... (lấy player, champion từ DB)
    // ... (tính toán ELO mới)
    // ... (tạo và lưu Match mới)
    // ... (cập nhật Player)
    // res.json(newMatch);
    try {
        // ... (logic của bạn để tạo trận đấu, tính ELO, cập nhật player)
        // Đây là một ví dụ rất đơn giản, bạn cần hoàn thiện nó dựa trên service backend
        const { player1Id, player2Id, winnerId /* ... các trường khác */ } = req.body;

        // Logic này nên được chuyển vào một service hoặc controller riêng
        // Ví dụ: lấy ELO trước trận, tính ELO mới, ...

        const newMatch = new Match({
            player1Info: { player: player1Id, /* ... */ eloBeforeMatch: 1200, eloChange: 10 },
            player2Info: { player: player2Id, /* ... */ eloBeforeMatch: 1200, eloChange: -10 },
            winnerId: winnerId,
            date: new Date()
        });
        await newMatch.save();

        // Cập nhật ELO người chơi (ví dụ đơn giản)
        // await Player.findByIdAndUpdate(player1Id, { $inc: { rating: 10, matchesPlayed: 1 }, $cond: { if: { $eq: [winnerId, player1Id] }, then: { $inc: { wins: 1 } }, else: { $inc: { losses: 1 } }} });
        // await Player.findByIdAndUpdate(player2Id, { $inc: { rating: -10, matchesPlayed: 1 }, $cond: { if: { $eq: [winnerId, player2Id] }, then: { $inc: { wins: 1 } }, else: { $inc: { losses: 1 } }} });

        res.status(201).json(newMatch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error when creating match');
    }
});


// @route   GET /api/matches/player/:playerId
// @desc    Get match history for a specific player
// @access  Public
router.get('/player/:playerId', async (req, res) => {
    try {
        const playerId = req.params.playerId;
        const matches = await Match.find({
            $or: [
                { 'player1Info.player': playerId },
                { 'player2Info.player': playerId }
            ]
        })
        .populate('player1Info.player', 'name')
        .populate('player1Info.championUsed', 'name icon')
        .populate('player2Info.player', 'name')
        .populate('player2Info.championUsed', 'name icon')
        .populate('winnerId', 'name')
        .sort({ date: -1 });

        if (!matches) {
            return res.status(404).json({ msg: 'No matches found for this player' });
        }
        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;