const { pool } = require('../models/db');
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.TICKETMASTER_API_KEY;

const eventsFromDb = async (req, res) => {
    const {keyword} = req.body;
    console.log(keyword);

    try {
        const query = `
            SELECT * FROM eventastic."Event"
            WHERE title ILIKE ($1)
            or artist ILIKE ($1)
            or eventtype ILIKE ($1)
            or genre ILIKE ($1);
            `;
        
        const values = [`%${keyword}%`];
        const result = await pool.query(query, values);

        console.log("returning from db: " +keyword);
        
        res.json({success: true, events: result.rows});
    } catch (err) {
        console.error(err);
    }
};

const apiToDb = async(req, res) => {
    const keyword = req.body.keyword;
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=200&keyword=${encodeURIComponent(keyword)}&apikey=${apiKey}`; // Replace with your API URL

  try {
    // Fetch data from the API
    const response = await axios.get(apiUrl);
    const events = response.data._embedded.events;
    console.log("fetching from api: " + keyword);

    //console.log(events[0] + '\n' + events[1]);

    // Prepare SQL insert statement
    const insertQuery = `
      INSERT INTO eventastic."Event" ( venue, eventlocation, date, time, artist, eventtype, genre, price, eventlink, title)
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
};


module.exports = { eventsFromDb, apiToDb};