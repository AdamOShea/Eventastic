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
      eventVenue, eventLocation, eventSeller, eventDate, eventTime, eventArtist, eventType, eventGenre, eventPrice, eventLink, eventTitle, eventDescription, eventImages
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT (eventlink) DO NOTHING;
  `;

  for (const event of mappedEvents) {
    try {
      await pool.query(insertQuery, [
        event.eventVenue, event.eventLocation, event.eventSeller, event.eventDate, event.eventTime, 
        event.eventArtist, event.eventType, event.eventGenre, event.eventPrice, event.eventLink, 
        event.eventTitle, event.eventDescription, event.eventImage
      ]);
    } catch (dbError) {
      console.error(`Failed to insert event "${event.eventTitle}":`, dbError.message);
    }
  }
};

module.exports = { insertEvents };
