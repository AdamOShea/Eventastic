require('dotenv').config();
const axios = require('axios');
const { pool } = require('../models/db'); // Assuming the pool object is correctly imported

const apiKey = process.env.TICKETMASTER_API_KEY;

const ticketmasterAPI = async (keyword) => {
  console.log(`🎫 ticketmasterAPI called with keyword: "${keyword}"`);
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=200&keyword=${encodeURIComponent(keyword)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const events = response.data._embedded.events;
    console.log("Fetching from ticketmasterAPI: " + keyword);

    if (!response.data || !response.data._embedded) {
      console.warn('⚠️ No events found or unexpected response format.');
      return { message: 'No events found from Ticketmaster.' };
    }

    console.log('✅ Ticketmaster API response received:', response.data._embedded.events);

    const insertQuery = `
      INSERT INTO eventastic."Event" (venue, eventlocation, seller, date, time, artist, eventtype, genre, price, eventlink, title)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (eventlink) DO NOTHING;
    `;

    for (const event of events) {
      const venue = event._embedded?.venues?.[0]?.name || 'unknown venue';
      const eventLocation = event._embedded?.venues?.[0]?.city?.name || 'Unknown city';
      const seller = 'Ticketmaster'
      const date = event.dates?.start?.localDate || null;
      const time = event.dates?.start?.localTime || null;
      const artist = event._embedded?.attractions?.[0]?.name || 'Unknown';
      const eventType = event.classifications?.[0]?.segment?.name || 'Unknown';
      const genre = event.classifications?.[0]?.genre?.name || 'Unknown';
      const price = event.priceRanges?.[0]?.min || 0;
      const eventLink = event.url || 'Unknown';
      const title = event.name || 'Untitled';

      // Insert into database
      await pool.query(insertQuery, [
        venue, eventLocation, seller, date, time, artist,
        eventType, genre, price, eventLink, title,
      ]);
    }

    return { message: 'Events from ticketmasterAPI successfully fetched and saved to the database.' }; // Return a result
  } catch (error) {

    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status ?? null,
      statusText: error.response?.statusText ?? null,
      responseData: error.response?.data ?? null,
      requestUrl: error.config?.url ?? null,
      requestMethod: error.config?.method ?? null,
    };

    console.error('Error fetching or saving events from ticketmasterAPI:', errorDetails);
    throw new Error(JSON.stringify(errorDetails)); // Throw an error
  }
};

// Directly export the function
module.exports = ticketmasterAPI;
