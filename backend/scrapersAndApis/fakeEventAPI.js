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
    image: faker.image.imageUrl(),
    title: `${keyword} ${faker.lorem.words(3)} ` ,
    seller: 'FakeEvents',
    description: faker.lorem.paragraph({min: 3, max: 8}),
  });

const fakeEventAPI = async (keyword) => {
    const events = Array.from({ length: 20 }, () => generateFakeEvent(keyword));
    console.log("Fetching from fakeEventAPI: " + keyword);


    try {
      const insertQuery = `
                  INSERT INTO eventastic."Event" (venue, eventlocation, seller, date, time, artist, eventtype, genre, price, eventlink, title, description, image)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                  ON CONFLICT (eventlink) DO NOTHING;
                  `;

      for (const event of events) {

        await pool.query(insertQuery, [
          event.venue,
          event.eventLocation,
          event.seller,
          event.date,
          event.time,
          event.artist,
          event.eventType,
          event.genre,
          event.price,
          event.eventLink,
          event.title,
          event.description,
          event.image
        ]);
      }
  
      return { message: 'Events from fakeEventAPI successfully fetched and saved to the database.' };
    } catch (error) {
      console.error('Error saving events from fakeEventAPI:', error);
      throw new Error('An error occurred while processing the request for fakeEventAPI.');
    }
};

module.exports = fakeEventAPI;