const express = require('express');
const router = express.Router();

const { flightsApis, detectAPIs, saveFlight } = require('../controllers/flights');

router.post('/flights-apis', flightsApis);
router.post('/detect-apis', detectAPIs);
router.post('/save-flight', saveFlight);

module.exports = router;