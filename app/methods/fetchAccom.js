const client = require('../api/client');

const fetchAccom = async (values) => {
    console.log("Payload sent to fetchAccom:", values); 

    try {
      const apiResponse = await client.post('/accomm-apis', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 200) {
        console.log("✅ fetchAccom successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ fetchAccom failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error("❌ fetchAccom error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { fetchAccom };
