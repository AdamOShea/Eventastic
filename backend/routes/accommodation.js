const express = require('express');
const router = express.Router();

const { accommApis, detectAPIs } = require('../controllers/accommodation');

router.post('/accomm-apis', accommApis);
router.post('/detect-apis', detectAPIs);

module.exports = router;