const { pool } = require('../models/db');

const insertEvents = async (events, mapper) => {
  let mappedEvents;
  if (mapper === undefined) {
    mappedEvents = events;
  } else {
    mappedEvents = mapper(events);
  }
  

  const insertQuery = `
    INSERT INTO eventastic."Event" (
      venue, eventlocation, seller, date, time, artist, eventtype, genre, price, eventlink, title, description, image
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT (eventlink) DO NOTHING;
  `;

  for (const event of mappedEvents) {
    try {
      await pool.query(insertQuery, [
        event.venue, event.eventLocation, event.seller, event.date, event.time, 
        event.artist, event.eventType, event.genre, event.price, event.eventLink, 
        event.title, event.description, event.image
      ]);
    } catch (dbError) {
      console.error(`Failed to insert event "${event.title}":`, dbError.message);
    }
  }
};

module.exports = { insertEvents };
