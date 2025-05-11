const express = require('express');
const { EloService } = require('../src/app/elo.service.ts');

const app = express();
const port = 3000;
const eloService = new EloService();

// Endpoint to get all players
app.get('/api/players', (req, res) => {
  res.json(eloService.getPlayers());
});

// Endpoint to get all matches
app.get('/api/matches', (req, res) => {
  res.json(eloService.getMatches());
});

// Endpoint to get match history of a specific player
app.get('/api/players/:id/matches', (req, res) => {
  const playerId = parseInt(req.params.id, 10);
  res.json(eloService.getPlayerMatchHistory(playerId));
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});