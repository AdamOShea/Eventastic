require('dotenv').config();
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;


const getGoogleMapsEmbedUrl = (req, res) => {
    const { location } = req.query; // Get the location from the request
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    console.log('📍 Incoming location request:', location);
    console.log('🔑 Google Maps API Key Loaded:', !!googleMapsApiKey);

    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    if (!googleMapsApiKey) {
        console.error('❌ Google Maps API Key is missing!');
        return res.status(500).json({ error: 'Google Maps API Key not configured' });
    }

    // Load API key from .env
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(location)}`;

    res.json({ embedUrl });
};

module.exports = { getGoogleMapsEmbedUrl };
