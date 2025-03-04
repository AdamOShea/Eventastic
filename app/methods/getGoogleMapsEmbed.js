const client = require('../api/client');

const getGoogleMapsEmbed = async (location) => {
  try {
    const response = await client.get('/maps-embed', location);
    return response.data.embedUrl; // Return the secured embed URL
  } catch (error) {
    console.error('Error fetching Google Maps Embed URL:', error);
    return null; // Return null if there's an error
  }
};

module.exports = { getGoogleMapsEmbed };
