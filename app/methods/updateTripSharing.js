const client = require('../api/client');

const updateTripSharing = async (values) => {
    console.log("Payload sent to updateTripSharing:", values); 

    try {
      const apiResponse = await client.post('/update-trip-sharing', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 200) {
        console.log(" updateTripSharing successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log(" updateTripSharing failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error(" updateTripSharing error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { updateTripSharing };
