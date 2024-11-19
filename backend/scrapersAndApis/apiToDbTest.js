const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432, // Default PostgreSQL port
});

// Endpoint to fetch and save events
app.get('/fetch-events', async (req, res) => {
  const apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&city=Dublin&countryCode=IE&apikey=ZtosAxJhw16nAepNAh2DwX8LGRB01mVG'; // Replace with your API URL

  try {
    // Fetch data from the API
    const response = await axios.get(apiUrl);
    const events = response.data._embedded.events;

    // Prepare SQL insert statement
    const insertQuery = `
      INSERT INTO public."Event" ( venue, eventlocation, date, time, artist, eventtype, genre, price, eventlink, title)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (eventlink) DO NOTHING; -- Prevent duplicate entries
    `;

    // Iterate through the events and extract relevant attributes
    for (const event of events) {
      
      const venue = event._embedded?.venues?.[0]?.name || 'Unknown';
      const eventLocation = event._embedded?.venues?.[0]?.city?.name || 'Unknown';
      const date = event.dates?.start?.localDate || null;
      const time = event.dates?.start?.localTime || null;
      const artist = event._embedded?.attractions?.[0]?.name || 'Unknown';
      const eventType = event.classifications?.[0]?.segment?.name || 'Unknown';
      const genre = event.classifications?.[0]?.genre?.name || 'Unknown';
      const price = event.priceRanges?.[0]?.min || 0;
      const eventLink = event.url || 'Unknown';
      const title = event.name || 'Untitled';

      // Insert the event into the database
      await pool.query(insertQuery, [
        venue, eventLocation, date, time, artist,
        eventType, genre, price, eventLink, title,
      ]);
    }

    res.status(200).send('Events successfully fetched and saved to the database.');
  } catch (error) {
    console.error('Error fetching or saving events:', error);
    res.status(500).send('An error occurred while processing the request.');
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
