const express = require('express');
const router = express.Router();
const { getGoogleMapsEmbedUrl } = require('../controllers/maps');

router.get('/maps-embed', getGoogleMapsEmbedUrl);

module.exports = router;
