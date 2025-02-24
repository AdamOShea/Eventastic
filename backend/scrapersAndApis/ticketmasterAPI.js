require('dotenv').config();
const axios = require('axios');
const { pool } = require('../models/db'); // Assuming the pool object is correctly imported

const apiKey = process.env.TICKETMASTER_API_KEY;

const ticketmasterAPI = async (keyword) => {
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=200&keyword=${encodeURIComponent(keyword)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const events = response.data._embedded.events;
    console.log("Fetching from ticketmasterAPI: " + keyword);

    const insertQuery = `
      INSERT INTO eventastic."Event" (venue, eventlocation, date, time, artist, eventtype, genre, price, eventlink, title)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (eventlink) DO NOTHING;
    `;

    for (const event of events) {
      const venue = event._embedded?.venues?.[0]?.name || 'unknown venue';
      const eventLocation = event._embedded?.venues?.[0]?.city?.name || 'Unknown city';
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
        venue, eventLocation, date, time, artist,
        eventType, genre, price, eventLink, title,
      ]);
    }

    return { message: 'Events from ticketmasterAPI successfully fetched and saved to the database.' }; // Return a result
  } catch (error) {
    console.error('Error fetching or saving events from ticketmasterAPI:', error);
    throw new Error('An error occurred while processing the request for ticketmasterAPI.'); // Throw an error
  }
};

// Directly export the function
module.exports = ticketmasterAPI;
