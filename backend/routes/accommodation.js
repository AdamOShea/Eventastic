const express = require('express');
const router = express.Router();

const { accommApis, detectAPIs, saveAccomm } = require('../controllers/accommodation');

router.post('/accomm-apis', accommApis);
router.post('/detect-apis', detectAPIs);
router.post('/save-accomm', saveAccomm);

module.exports = router;