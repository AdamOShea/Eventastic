const client = require('../api/client');

const eventsFromDb = async (values) => {


    try {
    const dbResponse = await client.post('/events-from-db', values);
    //console.log("DB response data:", dbResponse.data); 

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

module.exports = { eventsFromDb };
