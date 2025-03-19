const client = require('../api/client');

const saveTrip = async (values) => {
    console.log("Payload sent to saveTrip:", values); 

    try {
      const apiResponse = await client.post('/save-trip', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 200) {
        console.log("✅ saveTrip successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ saveTrip failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error("❌ saveTrip error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { saveTrip };
