const client = require('../api/client');

const fetchFriend = async (values) => {
    console.log("Payload sent to fetchFriend:", values); 

    try {
      const apiResponse = await client.post('/fetch-friends', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 201) {
        console.log("✅ fetchFriend successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ fetchFriend failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error("❌ fetchFriend error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { fetchFriend };
