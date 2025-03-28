const Fuse = require('fuse.js');
const airportEnum = require('../data/airports.json'); // Adjust path as needed

// Convert enum to searchable array
const airportList = Object.entries(airportEnum).map(([enumName, code]) => ({
  name: enumName.replace(/_/g, ' ').replace(/ AIRPORT$/, ''), // Clean name
  code
}));

const fuse = new Fuse(airportList, {
  keys: ['name'],
  threshold: 0.3,
});

/**
 * Fuzzy match an airport name to its IATA code.
 * @param {string} input - Airport name to match.
 * @returns {string|null} IATA code or null if not found.
 */
function airportCodeMatcher(input) {
  const result = fuse.search(input);
  return result.length ? result[0].item.code : null;
}

module.exports = { airportCodeMatcher };
