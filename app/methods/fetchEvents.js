const client = require('../api/client');  

const fetchEvents = async (values) => {

    try {
        //console.log("value: " + values);
        const response = await client.post('/events-from-db', values);

        if (response.status === 200 && response.data.success) {
            console.log("fetch successful");
            return { message: 'Signed in', events: response.data.events };
      } else {
           
            console.log("fetch 404");
            return { message: "fail fetching events 404" };
      }
    } catch (error) {
        console.error("Login error:", error);
        // Handle unexpected errors
        return { message: 'unknown error' };
    };
}

module.exports = { fetchEvents};