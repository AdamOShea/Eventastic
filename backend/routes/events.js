const express = require('express');
const router = express.Router();

const { eventsFromDb, apiToDb, detectAPIs } = require('../controllers/events');

router.post('/events-from-db', eventsFromDb);
router.post('/api-to-db', apiToDb);
router.post('/detect-apis', detectAPIs);

module.exports = router;