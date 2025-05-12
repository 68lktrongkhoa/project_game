// elo_backend/services/playerUpdateService.js
function getVisualRankFromElo(elo) {
    if (elo < 400) return { tier: 'Iron', division: 'IV', lp: elo < 0 ? 0 : elo % 100 };
    if (elo < 500) return { tier: 'Iron', division: 'III', lp: (elo - 400) % 100 };
    if (elo < 600) return { tier: 'Iron', division: 'II', lp: (elo - 500) % 100 };
    if (elo < 700) return { tier: 'Iron', division: 'I', lp: (elo - 600) % 100 };
    if (elo < 800) return { tier: 'Bronze', division: 'IV', lp: (elo - 700) % 100 };
    if (elo < 900) return { tier: 'Bronze', division: 'III', lp: (elo - 800) % 100 };
    if (elo < 1000) return { tier: 'Bronze', division: 'II', lp: (elo - 900) % 100 };
    if (elo < 1100) return { tier: 'Bronze', division: 'I', lp: (elo - 1000) % 100 };
    if (elo < 1200) return { tier: 'Silver', division: 'IV', lp: (elo - 1100) % 100 };
    if (elo < 1300) return { tier: 'Silver', division: 'III', lp: (elo - 1200) % 100 };
    if (elo < 1400) return { tier: 'Silver', division: 'II', lp: (elo - 1300) % 100 };
    if (elo < 1500) return { tier: 'Silver', division: 'I', lp: (elo - 1400) % 100 };
    if (elo < 1600) return { tier: 'Gold', division: 'IV', lp: (elo - 1500) % 100 };
    if (elo < 1700) return { tier: 'Gold', division: 'III', lp: (elo - 1600) % 100 };
    if (elo < 1800) return { tier: 'Gold', division: 'II', lp: (elo - 1700) % 100 };
    if (elo < 1900) return { tier: 'Gold', division: 'I', lp: (elo - 1800) % 100 };
    if (elo < 2000) return { tier: 'Platinum', division: 'IV', lp: (elo - 1900) % 100 };
    if (elo < 2100) return { tier: 'Platinum', division: 'III', lp: (elo - 2000) % 100 };
    if (elo < 2200) return { tier: 'Platinum', division: 'II', lp: (elo - 2100) % 100 };
    if (elo < 2300) return { tier: 'Platinum', division: 'I', lp: (elo - 2200) % 100 };
    if (elo < 2400) return { tier: 'Emerald', division: 'IV', lp: (elo - 2300) % 100 };
    if (elo < 2500) return { tier: 'Emerald', division: 'III', lp: (elo - 2400) % 100 };
    if (elo < 2600) return { tier: 'Emerald', division: 'II', lp: (elo - 2500) % 100 };
    if (elo < 2700) return { tier: 'Emerald', division: 'I', lp: (elo - 2600) % 100 };
    if (elo < 2800) return { tier: 'Diamond', division: 'IV', lp: (elo - 2700) % 100 };
    if (elo < 2900) return { tier: 'Diamond', division: 'III', lp: (elo - 2800) % 100 };
    if (elo < 3000) return { tier: 'Diamond', division: 'II', lp: (elo - 2900) % 100 };
    if (elo < 3100) return { tier: 'Diamond', division: 'I', lp: (elo - 3000) % 100 };
    if (elo < 3300) return { tier: 'Master', division: '', lp: elo - 3100 };
    if (elo < 3500) return { tier: 'Grandmaster', division: '', lp: elo - 3300 };
    if (elo >= 3500) return { tier: 'Challenger', division: '', lp: elo - 3500 };
    if (elo < 0) return { tier: 'Iron', division: 'IV', lp: 0 };
    return { tier: 'Unranked', division: '', lp: 0 };
}

module.exports = { getVisualRankFromElo };