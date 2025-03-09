const {ticketmasterMapper} = require('../mappers/eventsMappers');

const insertEvents = async (events)  => {
    
    const insertQuery = `
      INSERT INTO eventastic."Event" (
        venue, eventlocation, seller, date, time, artist, eventtype, genre, price, eventlink, title, description, image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (eventlink) DO NOTHING;
    `;

    for (const event of events) {
        ticketmasterMapper(event);
  
        try {
          await pool.query(insertQuery, [
            venue, eventLocation, seller, date, time, artist, eventType, genre, price, eventLink, title, description, image
          ]);
        } catch (dbError) {
          console.error(`Failed to insert event "${title}":`, dbError.message);
        }
    }
}

module.exports = {insertEvents};