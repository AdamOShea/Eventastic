const express = require('express');
const router = express.Router();

const { eventsFromDb } = require('../controllers/events');

router.post('/eventsFromDb', eventsFromDb);

module.exports = router;