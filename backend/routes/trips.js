const express = require('express');
const router = express.Router();

const { saveTrip } = require('../controllers/trips');

router.post('/save-trip', saveTrip);


module.exports = router;