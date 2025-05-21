const K_FACTOR = 32;

function calculateNewEloRatings(player1Rating, player2Rating, player1Wins) {
    const Ra = player1Rating;
    const Rb = player2Rating;
    const Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
    const Eb = 1 / (1 + Math.pow(10, (Ra - Rb) / 400));

    let newRating1, newRating2;
    if (player1Wins) {
        newRating1 = Math.round(Ra + K_FACTOR * (1 - Ea));
        newRating2 = Math.round(Rb + K_FACTOR * (0 - Eb));
    } else {
        newRating1 = Math.round(Ra + K_FACTOR * (0 - Ea));
        newRating2 = Math.round(Rb + K_FACTOR * (1 - Eb));
    }
    return { newRating1, newRating2 };
}

module.exports = { calculateNewEloRatings };