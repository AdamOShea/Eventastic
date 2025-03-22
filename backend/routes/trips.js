const express = require('express');
const router = express.Router();

const { saveTrip, fetchSavedTrips, updateShareStatus, fetchSharedTrips } = require('../controllers/trips');

router.post('/save-trip', saveTrip);
router.post('/fetch-saved-trips', fetchSavedTrips);
router.post('/update-trip-sharing', updateShareStatus);
router.post('/fetch-shared-trips', fetchSharedTrips);


module.exports = router;