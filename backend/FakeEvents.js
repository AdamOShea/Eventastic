const { pool } = require('./models/db');
const { insertEvents } = require('./methods/insertEvent');
const {generateFakeEvent} = require('./methods/generateFakeEvent');


const FakeEvents = async (values) => {
    const {keyword} = values;
    const events = Array.from({ length: 20 }, () => generateFakeEvent(keyword));
    console.log("Fetching from fakeEventAPI: " + keyword);

    try {
      insertEvents(events);
  
      return { message: 'Events from fakeEventAPI successfully fetched and saved to the database.' };
    } catch (error) {
      console.error('Error saving events from fakeEventAPI:', error);
      throw new Error('An error occurred while processing the request for fakeEventAPI.');
    }
};

module.exports = FakeEvents;