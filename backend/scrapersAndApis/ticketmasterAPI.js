require('dotenv').config();
const axios = require('axios');
const { pool } = require('../models/db');

const apiKey = process.env.TICKETMASTER_API_KEY;

if (!apiKey) {
  console.error('TICKETMASTER_API_KEY is not defined in the environment variables.');
  process.exit(1); // Exit if the API key is missing
}

const ticketmasterAPI = async (keyword) => {
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

    const insertQuery = `
      INSERT INTO eventastic."Event" (
        venue, eventlocation, seller, date, time, artist, eventtype, genre, price, eventlink, title, description, image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (eventlink) DO NOTHING;
    `;

    for (const event of events) {
      const venue = event._embedded?.venues?.[0]?.name || 'Unknown Venue';
      const eventLocation = event._embedded?.venues?.[0]?.city?.name || 'Unknown City';
      const seller = 'Ticketmaster';
      const date = event.dates?.start?.localDate || null;
      const time = event.dates?.start?.localTime || null;
      const artist = event._embedded?.attractions?.[0]?.name || 'Unknown Artist';
      const eventType = event.classifications?.[0]?.segment?.name || 'Unknown Type';
      const genre = event.classifications?.[0]?.genre?.name || 'Unknown Genre';
      const price = event.priceRanges?.[0]?.min ?? 0;
      const eventLink = event.url || 'No Link';
      const title = event.name || 'Untitled Event';
      const description = event.info || event.description || 'No event description found :/';
      const image = event.images?.[0]?.url || null;

      try {
        await pool.query(insertQuery, [
          venue, eventLocation, seller, date, time, artist, eventType, genre, price, eventLink, title, description, image
        ]);
      } catch (dbError) {
        console.error(`Failed to insert event "${title}":`, dbError.message);
      }
    }

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

module.exports = ticketmasterAPI;
