const { callPythonApi } = require("../methods/callPythonApi");
const fs = require("fs");
const path = require("path");
const { mapGoogleFlights } = require("../mappers/flightsMappers");
const { pool } = require('../models/db');
require('dotenv').config();
const fetch = require('node-fetch');
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const { airportCodeMatcher } = require('../methods/airportCodeMatcher');

const apiDirectory = path.join(__dirname, "../flights-apis");

const apis = {};

// Load all Python API scripts
fs.readdirSync(apiDirectory).forEach((file) => {
  if (file.endsWith(".py")) {
    const apiName = path.basename(file, ".py");
    apis[apiName] = path.join(apiDirectory, file);
  }
});

console.log("Loaded Flights APIs:", Object.keys(apis));

const flightsApis = async (req, res) => {
  const { departureDate, departureAirport, arrivalAirport, direction, direct, apis: selectedAPIs } = req.body;

  console.log("🔎 Received payload at /flights-apis:", req.body);

  if (!departureDate || !departureAirport || !arrivalAirport) {
    return res.status(400).json({ error: "Missing required parameters: departureDate, departureAirport, arrivalAirport" });
  }

  if (!Array.isArray(selectedAPIs) || selectedAPIs.length === 0) {
    return res.status(400).json({ error: "No valid APIs selected." });
  }

  try {
    // Call each selected API
    const apiPromises = selectedAPIs.map((apiName) => {
      const scriptPath = apis[apiName];

      if (scriptPath) {
        console.log(`🚀 Calling API: ${apiName}`);
        return callPythonApi(scriptPath, [departureDate, departureAirport, arrivalAirport, direct])
          .then((data) => ({ api: apiName, data }))
          .catch((error) => ({ api: apiName, error: error.message }));
      } else {
        console.log(`❌ API "${apiName}" not found.`);
        return Promise.resolve({ api: apiName, error: `API "${apiName}" does not exist.` });
      }
    });

    // Wait for all API calls to complete
    const results = await Promise.all(apiPromises);

    //console.log(`📦 Raw API Results:`, results); //  Debug

    // Apply Mappers to API responses
    const mappedResults = results.map(({ api, data, error }) => {
      if (error) {
        console.error(`❌ ${api} failed:`, error);
        return { api, status: "rejected", error, data: null };
      }

      //console.log(`🎯 ${api} succeeded:`, JSON.stringify(data, null, 2)); //  Debug JSON

      let mappedData = [];
      switch (api) {
        case "googleFlights":
          mappedData = mapGoogleFlights(data, direction);
          break;
        default:
          console.warn(`⚠️ No mapper available for API: ${api}`);
          mappedData = data;
      }

      //console.log(` Mapped Data for ${api}:`, JSON.stringify(mappedData, null, 2)); //  Debug mapped data

      return { api, status: "fulfilled", data: mappedData };
    });

    // Send response with mapped results
    res.status(200).json({
      message: "API calls completed.",
      results: mappedResults,
    });
  } catch (error) {
    console.error("❌ Error during API calls:", error);
    res.status(500).json({ error: "An error occurred while processing the APIs." });
  }
};

// Endpoint to detect available APIs
const detectAPIs = async (req, res) => {
  res.json({ apis: Object.keys(apis) });
};

const saveFlight = async (req, res) => {
  const {flightAirline, flightPrice, flightDepartureTime, flightDepartureAirport, flightDuration, flightStops, flightArrivalTime, flightArrivalAirport, flightUrl, flightDepartureCode, flightArrivalCode} = req.body;

  try {
    const query = `
      INSERT INTO eventastic."Flights" ("flightAirline", "flightPrice", "flightDepartureTime", "flightDepartureAirport", "flightDuration", "flightStops", "flightArrivalTime", "flightArrivalAirport", "flightUrl", "flightDepartureCode", "flightArrivalCode")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING "flightId";
    `;

    const values = [flightAirline, flightPrice, flightDepartureTime, flightDepartureAirport, flightDuration, flightStops, flightArrivalTime, flightArrivalAirport, flightUrl, flightDepartureCode, flightArrivalCode ];
    const result = await pool.query(query, values);

    res.status(201).send({ message: 'Flight stored successfully', flightId: result.rows[0].flightId })
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
};

const findNearestAirport = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const googleResponse = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.location',
      },
      body: JSON.stringify({
        includedTypes: ['international_airport'],
        maxResultCount: 20,
        rankPreference: 'DISTANCE',
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude
            },
            radius: 50000 // in meters
          }
        }
      })
    });

    const data = await googleResponse.json();

    if (!googleResponse.ok) {
      return res.status(googleResponse.status).json({
        error: 'Failed to fetch airport',
        details: data,
      });
    }

    const nearestName = data?.places?.[0]?.displayName?.text || null;
    const iataCode = nearestName ? airportCodeMatcher(nearestName) : null;


    if (!nearest) {
      return res.status(404).json({ error: 'No airport found near location' });
    }

    res.status(200).json({ airport: nearestName, iata: iataCode });
  } catch (err) {
    console.error('❌ Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { flightsApis, detectAPIs, saveFlight, findNearestAirport  };
