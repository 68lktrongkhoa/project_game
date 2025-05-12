const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const playerRoutes = require('./routes/playerRoutes');
const championRoutes = require('./routes/championRoutes');
const matchRoutes = require('./routes/matchRoutes');
const Player = require('./models/Player');
const Champion = require('./models/Champion');
const Match = require('./models/Match'); 
const { calculateNewEloRatings } = require('./services/eloCalculationService');
const championDataModule = require('./data/champion.data.js');
const championSeedData = championDataModule.LEAGUE_OF_LEGENDS_CHAMPIONS;

const app = express();
app.use(cors());
app.use(express.json()); 

app.use('/api/players', playerRoutes);
app.use('/api/champions', championRoutes);
app.use('/api/matches', matchRoutes);
connectDB().then(async () => {
    console.log('MongoDB Connected...');
    if (process.env.SEED_DB === 'true') {
        await seedDatabase();
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));

}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

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
            seededChampions = await Champion.find(); 
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
            for (let i = 1; i <= 100; i++) { 
                const favoriteChampion = seededChampions[Math.floor(Math.random() * seededChampions.length)];
                playersToSeed.push({
                    name: `Player ${i}`,
                    favoriteChampionId: favoriteChampion._id,
                });
            }
            seededPlayers = await Player.create(playersToSeed); 
            console.log(`${seededPlayers.length} players seeded.`);
        } else if (playerCount > 0) {
            seededPlayers = await Player.find();
            console.log('Players already exist.');
        } else {
            console.log('No players seeded: champions might be missing or database is not empty for players.');
        }

        // 3. Seed Matches
        const matchCount = await Match.countDocuments();
        if (matchCount === 0 && seededPlayers.length >= 2 && seededChampions.length > 0) {
            console.log('Seeding initial matches...');
            const numberOfMatchesToSeed = 100;
            for (let i = 0; i < numberOfMatchesToSeed; i++) {
                let p1Index = Math.floor(Math.random() * seededPlayers.length);
                let p2Index = Math.floor(Math.random() * seededPlayers.length);
                while (p1Index === p2Index) { 
                    p2Index = Math.floor(Math.random() * seededPlayers.length);
                }
                let player1 = await Player.findById(seededPlayers[p1Index]._id);
                let player2 = await Player.findById(seededPlayers[p2Index]._id);
                if (!player1 || !player2) {
                    console.warn(`Skipping match seed due to null player for indices ${p1Index}, ${p2Index}`);
                    continue;
                }

                const champ1 = seededChampions[Math.floor(Math.random() * seededChampions.length)];
                const champ2 = seededChampions[Math.floor(Math.random() * seededChampions.length)];

                const p1EloBefore = player1.rating;
                const p2EloBefore = player2.rating;
                const p1Wins = Math.random() > 0.5;
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
                    date: new Date(new Date().getTime() - (numberOfMatchesToSeed - i) * 1000 * 60 * 30)
                };
                await Match.create(matchData);

                winner.rating = p1Wins ? newRating1 : newRating2;
                winner.wins = (winner.wins || 0) + 1; 
                winner.matchesPlayed = (winner.matchesPlayed || 0) + 1;
                await winner.save();

                loser.rating = p1Wins ? newRating2 : newRating1;
                loser.losses = (loser.losses || 0) + 1; 
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