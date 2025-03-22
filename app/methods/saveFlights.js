const client = require('../api/client');

const saveFlights = async (values) => {
    console.log("Payload sent to saveFlights:", values); 

    try {
      const apiResponse = await client.post('/save-flight', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 201) {
        console.log("✅ saveFlights successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ saveFlights failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error("❌ saveFlights error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { saveFlights };
