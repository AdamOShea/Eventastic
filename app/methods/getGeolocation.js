const client = require('../api/client');

const getGeolocation = async (location) => {
    try {
        console.log('🌍 Fetching geolocation for:', location);

        const response = await client.get('/geocode', { params: { location } });

        console.log(' Geolocation fetched successfully:', response.data);
        return response.data; // { latitude, longitude }
    } catch (error) {
        console.error(' Error fetching geolocation:', error.response?.data || error.message);
        return null;
    }
};

module.exports = { getGeolocation };
