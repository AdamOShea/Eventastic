const client = require('../api/client');

const saveAccomm = async (values) => {
    console.log("Payload sent to saveAccomm:", values); 

    try {
      const apiResponse = await client.post('/save-accomm', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 201) {
        console.log("✅ saveAccomm successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ saveAccomm failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error("❌ saveAccomm error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { saveAccomm };
