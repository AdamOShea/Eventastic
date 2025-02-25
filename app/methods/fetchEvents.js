const client = require('../api/client');

const fetchEvents = async (values) => {
    console.log("Payload sent to fetchEvents:", values); 
  
    try {
      const apiResponse = await client.post('/api-to-db', values);
      console.log("API-to-DB response:", apiResponse.data);
  
      if (apiResponse.status === 200) {
        console.log("fetch from api successful");
      } else {
        console.log("fetch api failed");
      }
    } catch (err) {
      console.log("fetch api error:", err.response?.data || err.message); 
    }
  
    try {
      const dbResponse = await client.post('/events-from-db', values);
      console.log("DB response data:", dbResponse.data); 
  
      if (
        dbResponse.status === 200 &&
        dbResponse.data?.success &&
        Array.isArray(dbResponse.data.events) &&
        dbResponse.data.events.length > 0
      ) {
        return { message: 'fetched from db', events: dbResponse.data.events };
      } else {
        console.log("fetch db returned no events or invalid response");
        return { message: "No events found", events: [] };
      }
    } catch (error) {
      console.log("fetch from db error:", error.response?.data || error.message); 
      return { message: "fetch from db error: " + error, events: [] };
    }
  };
  

module.exports = { fetchEvents };
