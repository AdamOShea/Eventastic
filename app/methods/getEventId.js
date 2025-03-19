const client = require('../api/client');

const getEventId = async (eventlink) => {
    console.log("Payload sent to getEventId:", `"${eventlink}"`); 

    try {
      const apiResponse = await client.post('/get-event-id', { eventlink: `"${eventlink}"` });
      //console.log("Accomm API Response:", apiResponse.data);

      if (apiResponse.status === 200) {
        console.log("✅ getEventId successful");
        return apiResponse.data; // 🔥 Ensure function returns API data
      } else {
        console.log("❌ getEventId failed with status:", apiResponse.status);
        return null;
      }
    } catch (err) {
      console.error("❌ getEventId error:", err.response?.data || err.message);
      return null;
    }
};

module.exports = { getEventId };
