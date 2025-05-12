// elo_backend/index.js
const express = require('express');
const connectDB = require('./config/db'); // Đảm bảo file này export một hàm và hoạt động đúng
const cors = require('cors');
require('dotenv').config();

// --- ROUTERS ---
// Đảm bảo mỗi file này export một `express.Router()` instance
// Ví dụ: trong playerRoutes.js, dòng cuối phải là `module.exports = router;`
const playerRoutes = require('./routes/playerRoutes');
const championRoutes = require('./routes/championRoutes');
const matchRoutes = require('./routes/matchRoutes');

// --- MODELS --- (Cần cho seed data)
const Player = require('./models/Player'); // Sửa đường dẫn thư mục models -> model
const Champion = require('./models/Champion'); // Sửa đường dẫn thư mục models -> model
const Match = require('./models/Match'); // Sửa đường dẫn thư mục models -> model

// --- SERVICES ---
const { calculateNewEloRatings } = require('./services/eloCalculationService');

// --- SEED DATA ---
// Dữ liệu champion mẫu
// Đảm bảo file này export đúng cách, ví dụ: module.exports.LEAGUE_OF_LEGENDS_CHAMPIONS = [...]
const championDataModule = require('./data/champion.data.js');
const championSeedData = championDataModule.LEAGUE_OF_LEGENDS_CHAMPIONS; // Lấy mảng dữ liệu

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json()); // Middleware để parse JSON request bodies

// --- API ROUTES ---
// Các dòng này (quanh dòng 30, 31 cũ của bạn) chỉ hoạt động đúng
// nếu playerRoutes, championRoutes, matchRoutes là các router instance hợp lệ.
app.use('/api/players', playerRoutes);
// app.use('/api/champions', championRoutes);
// app.use('/api/matches', matchRoutes);

// --- DATABASE CONNECTION & SERVER START ---
connectDB().then(async () => {
    console.log('MongoDB Connected...');
    // Chỉ seed data nếu DB trống (hoặc theo logic của bạn)
    // Bạn có thể muốn có một biến môi trường để bật/tắt seed
    if (process.env.SEED_DB === 'true') { // Ví dụ kiểm tra biến môi trường
        await seedDatabase();
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));

}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Thoát nếu không kết nối được DB
});


// --- SEED DATABASE FUNCTION ---
async function seedDatabase() {
    try {
        console.log('Attempting to seed database...');
        // 1. Seed Champions
        const championCount = await Champion.countDocuments();
        let seededChampions = [];
        if (championCount === 0 && championSeedData && championSeedData.length > 0) {
            console.log('Seeding champions...');
            seededChampions = await Champion.insertMany(championSeedData);
            console.log(`${seededChampions.length} champions seeded.`);
        } else if (championCount > 0) {
            seededChampions = await Champion.find(); // Lấy champions đã có nếu DB không trống
            console.log('Champions already exist.');
        } else {
            console.log('No champion seed data provided or database is not empty for champions.');
        }

        // 2. Seed Players
        const playerCount = await Player.countDocuments();
        let seededPlayers = [];
        if (playerCount === 0 && seededChampions.length > 0) {
            console.log('Seeding players...');
            const playersToSeed = [];
            for (let i = 1; i <= 20; i++) { // Giả sử seed 20 players
                // Chọn ngẫu nhiên một champion đã được seed hoặc đã có trong DB
                const favoriteChampion = seededChampions[Math.floor(Math.random() * seededChampions.length)];
                playersToSeed.push({
                    name: `Player ${i}`,
                    // rating, attack etc. sẽ dùng default từ schema hoặc bạn có thể đặt giá trị ban đầu
                    favoriteChampionId: favoriteChampion._id,
                });
            }
            seededPlayers = await Player.create(playersToSeed); // .create có thể trigger pre('save') hook nếu có
            console.log(`${seededPlayers.length} players seeded.`);
        } else if (playerCount > 0) {
            seededPlayers = await Player.find(); // Lấy players đã có
            console.log('Players already exist.');
        } else {
            console.log('No players seeded: champions might be missing or database is not empty for players.');
        }

        // 3. Seed Matches
        const matchCount = await Match.countDocuments();
        if (matchCount === 0 && seededPlayers.length >= 2 && seededChampions.length > 0) {
            console.log('Seeding initial matches...');
            const numberOfMatchesToSeed = 50; // Ví dụ số trận đấu muốn seed
            for (let i = 0; i < numberOfMatchesToSeed; i++) {
                let p1Index = Math.floor(Math.random() * seededPlayers.length);
                let p2Index = Math.floor(Math.random() * seededPlayers.length);
                while (p1Index === p2Index) { // Đảm bảo hai người chơi khác nhau
                    p2Index = Math.floor(Math.random() * seededPlayers.length);
                }

                // Lấy lại player từ DB để đảm bảo có rating mới nhất nếu nhiều trận được tạo liên tiếp
                let player1 = await Player.findById(seededPlayers[p1Index]._id);
                let player2 = await Player.findById(seededPlayers[p2Index]._id);

                // Đảm bảo player1 và player2 không null (có thể xảy ra nếu _id không hợp lệ)
                if (!player1 || !player2) {
                    console.warn(`Skipping match seed due to null player for indices ${p1Index}, ${p2Index}`);
                    continue;
                }

                const champ1 = seededChampions[Math.floor(Math.random() * seededChampions.length)];
                const champ2 = seededChampions[Math.floor(Math.random() * seededChampions.length)];

                const p1EloBefore = player1.rating;
                const p2EloBefore = player2.rating;
                const p1Wins = Math.random() > 0.5; // 50% cơ hội player1 thắng
                const winner = p1Wins ? player1 : player2;
                const loser = p1Wins ? player2 : player1;

                const { newRating1, newRating2 } = calculateNewEloRatings(
                    p1EloBefore,
                    p2EloBefore,
                    p1Wins
                );

                const kda = () => ({
                    kills: Math.floor(Math.random() * 10),
                    deaths: Math.floor(Math.random() * 10),
                    assists: Math.floor(Math.random() * 15)
                });

                const matchData = {
                    player1Info: { player: player1._id, championUsed: champ1._id, eloBeforeMatch: p1EloBefore, eloChange: newRating1 - p1EloBefore, kda: kda() },
                    player2Info: { player: player2._id, championUsed: champ2._id, eloBeforeMatch: p2EloBefore, eloChange: newRating2 - p2EloBefore, kda: kda() },
                    winnerId: winner._id,
                    date: new Date(new Date().getTime() - (numberOfMatchesToSeed - i) * 1000 * 60 * 30) // Giả sử các trận cách nhau 30 phút
                };
                await Match.create(matchData);

                // Cập nhật thông tin người chơi sau trận đấu
                winner.rating = p1Wins ? newRating1 : newRating2;
                winner.wins = (winner.wins || 0) + 1; // Đảm bảo wins không phải NaN
                winner.matchesPlayed = (winner.matchesPlayed || 0) + 1;
                await winner.save();

                loser.rating = p1Wins ? newRating2 : newRating1;
                loser.losses = (loser.losses || 0) + 1; // Đảm bảo losses không phải NaN
                loser.matchesPlayed = (loser.matchesPlayed || 0) + 1;
                await loser.save();
            }
            console.log(`${numberOfMatchesToSeed} matches seeded.`);
        } else {
            console.log('Matches already exist or not enough players/champions for seeding.');
        }
        console.log('Database seeding process finished.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}