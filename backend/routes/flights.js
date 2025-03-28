const express = require('express');
const router = express.Router();

const { flightsApis, detectAPIs, saveFlight, findNearestAirport } = require('../controllers/flights');

router.post('/flights-apis', flightsApis);
router.post('/detect-apis', detectAPIs);
router.post('/save-flight', saveFlight);
router.post('/find-nearest-airport', findNearestAirport);

module.exports = router;