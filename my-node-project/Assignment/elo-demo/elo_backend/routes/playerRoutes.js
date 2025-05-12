const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');


router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);

module.exports = router;