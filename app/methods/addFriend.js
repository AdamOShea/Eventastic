const client = require('../api/client');

const addFriend = async (values) => {
    console.log("Payload sent to addFriend:", values); 

    try {
      const apiResponse = await client.post('/add-friend', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 201) {
        console.log(" addFriend successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ addFriend failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error("❌ addFriend error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { addFriend };
