const client = require('../api/client');

const fetchFriends = async (values) => {
    console.log("Payload sent to fetchFriends:", values); 

    try {
      const apiResponse = await client.post('/fetch-friends', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 200) {
        console.log("✅ fetchFriends successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ fetchFriend failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.log("❌ fetchFriend error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { fetchFriends };
