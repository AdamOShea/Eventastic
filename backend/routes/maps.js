const express = require('express');
const router = express.Router();
const { getGeocoding } = require('../controllers/maps');

router.get('/geocode', getGeocoding); //  New route for geocoding

module.exports = router;
