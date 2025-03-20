const { faker } = require('@faker-js/faker');

const generateFakeEvent = (keyword) => ({
    eventVenue: faker.location.secondaryAddress(),
    eventLocation: `${faker.location.city()}, ${faker.location.country()}`,
    eventDate: faker.date.future().toISOString(),
    eventTime: '21:00:00+00:00',
    eventArtist: faker.lorem.words(1),
    eventType: faker.lorem.words(1),
    eventGenre: faker.lorem.words(1),
    eventPrice: faker.commerce.price(10, 100, 2, '€'),
    eventLink: faker.internet.url(),
    eventImages: faker.image.url(),
    eventTitle: `${keyword} ${faker.lorem.words(3)} ` ,
    eventSeller: 'FakeEvents',
    eventDescription: faker.lorem.paragraph({min: 3, max: 8}),
  });

module.exports = {generateFakeEvent};