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

const Ticketmaster = async (values) => {
  console.log(`ticketmasterAPI called with keyword: "${values}"`);

  const { keyword, location, date, } = values;

  const params = new URLSearchParams({
    size: 200,
    apikey: apiKey,
  });

  if (keyword) params.append("keyword", keyword);
  if (location) params.append("city", location); // or `postalCode`, `countryCode`, etc. depending on the API
  if (date) params.append("startDateTime", date + "T14:00:00Z"); // ISO 8601 format
  

  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;


  try {
    const response = await axios.get(apiUrl);

    const events = response.data?._embedded?.events;

    if (!events || !Array.isArray(events)) {
      console.warn('No events found in Ticketmaster response.');
      return { message: 'No events found from Ticketmaster.' };
    }

    console.log(`Found ${events.length} events. Saving to the database...`);
    console.log(events);

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
