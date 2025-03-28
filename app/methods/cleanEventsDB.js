const client = require('../api/client');

const cleanEventsDB = async (values) => {
    console.log("Cleaning old events from db"); 

    try {
      const apiResponse = await client.post('/clean-events', values);
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 201) {
        console.log(" cleanEventsDB successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log(" cleanEventsDB failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error(" cleanEventsDB error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { cleanEventsDB };
