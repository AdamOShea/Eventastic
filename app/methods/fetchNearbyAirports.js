const client = require('../api/client');

const fetchNearbyAirports = async (values) => {
    console.log("Payload sent to fetchNearbyAirports:", values); 

    try {
      const apiResponse = await client.post('/find-nearest-airport', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 200) {
        console.log(" fetchNearbyAirports successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log(" fetchNearbyAirports failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error(" fetchNearbyAirports error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { fetchNearbyAirports };
