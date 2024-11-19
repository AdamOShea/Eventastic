const express = require('express');
const router = express.Router();

const { eventsFromDb, apiToDb } = require('../controllers/events');

router.post('/events-from-db', eventsFromDb);
router.post('/api-to-db', apiToDb);

module.exports = router;