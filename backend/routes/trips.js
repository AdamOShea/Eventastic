const express = require('express');
const router = express.Router();

const { saveTrip, fetchSavedTrips, updateShareStatus } = require('../controllers/trips');

router.post('/save-trip', saveTrip);
router.post('/fetch-saved-trips', fetchSavedTrips);
router.post('/update-trip-sharing', updateShareStatus);


module.exports = router;