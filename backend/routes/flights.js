const express = require('express');
const router = express.Router();

const { flightsApis, detectAPIs } = require('../controllers/flights');

router.post('/accomm-apis', flightsApis);
router.post('/detect-apis', detectAPIs);

module.exports = router;