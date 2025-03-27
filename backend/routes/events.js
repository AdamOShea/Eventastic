const express = require('express');
const router = express.Router();

const { eventsFromDb, apiToDb, detectAPIs, getEventId, cleanEventsDB } = require('../controllers/events');

router.post('/events-from-db', eventsFromDb);
router.post('/api-to-db', apiToDb);
router.post('/detect-apis', detectAPIs);
router.post('/get-event-id', getEventId);
router.post('/clean-events', cleanEventsDB);

module.exports = router;