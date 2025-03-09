const { faker } = require('@faker-js/faker');

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
    image: faker.image.url(),
    title: `${keyword} ${faker.lorem.words(3)} ` ,
    seller: 'FakeEvents',
    description: faker.lorem.paragraph({min: 3, max: 8}),
  });

module.exports = {generateFakeEvent};