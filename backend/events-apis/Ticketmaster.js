require('dotenv').config();
const axios = require('axios');
const { pool } = require('../models/db');
const {insertEvents} = require('../methods/insertEvent');
const {ticketmasterMapper} = require('../mappers/eventsMappers');

const apiKey = process.env.TICKETMASTER_API_KEY;

if (!apiKey) {
  console.error('TICKETMASTER_API_KEY is not defined in the environment variables.');
  process.exit(1); // Exit if the API key is missing
}

const Ticketmaster = async (keyword) => {
  console.log(`ticketmasterAPI called with keyword: "${keyword}"`);

  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=200&keyword=${encodeURIComponent(keyword)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);

    const events = response.data?._embedded?.events;

    if (!events || !Array.isArray(events)) {
      console.warn('No events found in Ticketmaster response.');
      return { message: 'No events found from Ticketmaster.' };
    }

    console.log(`Found ${events.length} events. Saving to the database...`);

    insertEvents(events, ticketmasterMapper);

    console.log('All events saved successfully.');
    return { message: 'Events successfully fetched and saved to the database.' };

  } catch (error) {
    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status ?? null,
      statusText: error.response?.statusText ?? null,
      responseData: error.response?.data ?? null,
      requestUrl: error.config?.url ?? null,
      requestMethod: error.config?.method ?? null,
    };

    console.error('❌ Error fetching or saving events from Ticketmaster:', errorDetails);
    throw new Error(JSON.stringify(errorDetails));
  }
};

module.exports = Ticketmaster;
