require('dotenv').config();
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;


const getGoogleMapsEmbedUrl = (req, res) => {
  const { location } = req.query; // Get the location from the request

  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; // Load API key from .env
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(location)}`;

  res.json({ embedUrl });
};

module.exports = { getGoogleMapsEmbedUrl };
