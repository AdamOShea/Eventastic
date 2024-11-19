const client = require('../api/client');  

const fetchEvents = async (values) => {
    try {
        const apiResponse = await client.post('/api-to-db', values);

        if (apiResponse.status === 200) {
            console.log("fetch from api successful");
        } else {
            console.log("fetch api failed");
        }
    } catch (err) {
        console.log("fetch api error: " + err);
    };

    try {
        
        const dbResponse = await client.post('/events-from-db', values);

        if (dbResponse.status === 200 && dbResponse.data.success && dbResponse.data.events[0].title) {
            
            return { message: 'fetched from db', events: dbResponse.data.events };
      } else {
           
            console.log("fetch db 404");
            return { message: "fail fetching from db 404" };
      }
    } catch (error) {
        console.log("fetch from db error:" + error);
        // Handle unexpected errors
        return { message: "fetch from db error: " + error };
    };

    
}

module.exports = { fetchEvents};