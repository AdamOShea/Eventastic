const Fuse = require('fuse.js');
const airportEnum = require('../data/airports.json'); // Adjust path as needed

// Convert enum to user-friendly searchable array
const airportList = Object.entries(airportEnum).map(([enumName, code]) => ({
  name: enumName
    .replace(/_/g, ' ')
    .replace(/\bINTERNATIONAL\b/, '') // optional cleanup
    .replace(/\s+AIRPORT$/, ' Airport') // normalize casing
    .trim(),
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
  console.log("🧠 Fuzzy match input:", input);
  if (result.length) {
    console.log("✅ Match found:", result[0].item.name, "→", result[0].item.code);
    return result[0].item.code;
  } else {
    console.warn("❌ No match found for:", input);
    return null;
  }
}

module.exports = { airportCodeMatcher };
