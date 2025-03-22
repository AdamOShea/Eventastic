const client = require('../api/client');

const searchUsers = async (values) => {
    console.log("Payload sent to searchUsers:", values); 

    try {
      const apiResponse = await client.post('/search-users', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 200) {
        console.log("✅ searchUsers successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ searchUsers failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error("❌ searchUsers error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { searchUsers };
