const Fuse = require('fuse.js');
const airportEnum = require('../data/airports.json'); // Adjust path as needed

// Clean extra info from names
function normalizeAirportName(name) {
  return name
    .replace(/\(.*?\)/g, '') // remove parentheticals
    .replace(/(terminal|building|departures|arrivals|work|office|center|centre)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build airport list
const airportList = Object.entries(airportEnum).map(([enumName, code]) => ({
  name: enumName
    .replace(/_/g, ' ')
    .replace(/\bINTERNATIONAL\b/, '')
    .replace(/\s+AIRPORT$/, ' Airport')
    .trim(),
  code
}));

const fuse = new Fuse(airportList, {
  keys: ['name'],
  threshold: 0.3,
});

function airportCodeMatcher(input) {
  const cleanedInput = normalizeAirportName(input);
  const result = fuse.search(cleanedInput);

  console.log("🧠 Cleaned input:", cleanedInput);

  if (result.length) {
    console.log("✅ Match found:", result[0].item.name, "→", result[0].item.code);
    return result[0].item.code;
  } else {
    console.warn("❌ No match found for:", input);
    return null;
  }
}

module.exports = { airportCodeMatcher };
