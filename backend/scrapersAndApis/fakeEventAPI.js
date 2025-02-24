const { faker } = require('@faker-js/faker');
const { pool } = require('../models/db');

const generateFakeEvent = (keyword) => ({
    venue: faker.location.secondaryAddress(),
    eventLocation: `${faker.location.city()}, ${faker.location.country()}`,
    date: faker.date.future().toISOString(),
    time: '21:00:00+00:00',
    artist: faker.lorem.words(1),
    eventType: faker.lorem.words(1),
    genre: faker.lorem.words(1),
    price: faker.commerce.price(10, 100, 2, '€'),
    eventLink: faker.internet.url(),
    // image: faker.image.imageUrl(),
    title: `${faker.lorem.words(3)} ${keyword}` ,
  });

const fakeEventAPI = async (keyword) => {
    const events = Array.from({ length: 20 }, () => generateFakeEvent(keyword));
    console.log("Fetching from fakeEventAPI: " + keyword);

    try {
        const insertQuery = `
            INSERT INTO eventastic."Event" (venue, eventlocation, date, time, artist, eventtype, genre, price, eventlink, title)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (eventlink) DO NOTHING;
            `;
    

    await pool.query(insertQuery, [
        events.venue, events.eventLocation, events.date, events.time, events.artist,
        events.eventType, events.genre, events.price, events.eventLink, events.title,
      ]);

      return {message: 'Events from fakeEventAPI successfully fetched and saved to the database.'}
    } catch (error) {
        console.error('Error fetching or saving events from ticketmasterAPI:', error);
        throw new Error('An error occurred while processing the request for ticketmasterAPI.'); // Throw an error
    }
};

module.exports = fakeEventAPI;