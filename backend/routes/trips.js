const express = require('express');
const router = express.Router();

const { saveTrip, fetchSavedTrips } = require('../controllers/trips');

router.post('/save-trip', saveTrip);
router.post('/fetch-saved-trips', fetchSavedTrips);


module.exports = router;