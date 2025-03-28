require('dotenv').config();
const axios = require('axios');

const getGeocoding = async (req, res) => {
    const { location } = req.query;
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

    console.log('📍 Geocoding request for location:', location);
    console.log('🔑 Google Maps API Key Loaded:', !!googleMapsApiKey);

    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    if (!googleMapsApiKey) {
        return res.status(500).json({ error: 'Google Maps API Key not configured' });
    }

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: { address: location, key: googleMapsApiKey }
        });

        if (response.data.status !== 'OK' || !response.data.results.length) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const { lat, lng } = response.data.results[0].geometry.location;
        console.log(' Geocoding result:', { lat, lng });

        res.json({ latitude: lat, longitude: lng });
    } catch (error) {
        console.error(' Error fetching geolocation:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch geolocation' });
    }
};

module.exports = { getGeocoding };
