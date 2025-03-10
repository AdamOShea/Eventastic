const { callPythonApi } = require('../methods/callPythonApi'); // Function to run Python scripts
const fs = require('fs');
const path = require('path');
const { mapGoogleFlights } = require('../mappers/flightsMappers'); //  Import API mappers

const apiDirectory = path.join(__dirname, '../flights-apis');

const apis = {};

// Load all Python API scripts from the accommodation-apis folder
fs.readdirSync(apiDirectory).forEach((file) => {
  if (file.endsWith('.py')) {
    const apiName = path.basename(file, '.py');
    apis[apiName] = path.join(apiDirectory, file); // Store full script path
  }
});

console.log('Loaded Flights APIs:', Object.keys(apis));

const flightsApis = async (req, res) => {
  const { departureDate, departureAirport, arrivalAirport, direction, apis: selectedAPIs } = req.body;

  console.log('🔎 Received payload at /flights-apis:', req.body); // Log request body

  if (!departureDate || !departureAirport || !arrivalAirport) {
    return res.status(400).json({ error: 'Missing required parameters: depatureDate, departureAirport, arrivalAirport,' });
  }

  if (!Array.isArray(selectedAPIs) || selectedAPIs.length === 0) {
    return res.status(400).json({ error: 'No valid APIs selected.' });
  }

  try {
    // Create an array of promises for calling selected API scripts
    const apiPromises = selectedAPIs.map((apiName) => {
      const scriptPath = apis[apiName];

      if (scriptPath) {
        console.log(`🚀 Calling API: ${apiName}`);
        return callPythonApi(scriptPath, [departureDate, departureAirport, arrivalAirport])
          .then((data) => ({ api: apiName, data })) // Return successful result
          .catch((error) => ({ api: apiName, error: error.message })); // Handle failure
      } else {
        console.log(`❌ API "${apiName}" not found.`);
        return Promise.resolve({ api: apiName, error: `API "${apiName}" does not exist.` });
      }
    });

    // Wait for all API calls to complete
    const results = await Promise.all(apiPromises);
    console.log(results);

    // Apply Mappers to API responses
    const mappedResults = results.map(({ api, data, error }) => {
      if (error) {
        console.error(`❌ ${api} failed:`, error);
        return { api, status: 'rejected', error, data: null };
      }

      console.log(` ${api} succeeded:`, data);
      
      // Map response using appropriate function
      let mappedData = [];
      switch (api) {
        case 'googleFlights':
          mappedData = mapGoogleFlights(data, direction);
          break;
        default:
          console.warn(`⚠️ No mapper available for API: ${api}`);
          mappedData = data;
      }

      return { api, status: 'fulfilled', data: mappedData };
    });

    // Send response with mapped results
    res.status(200).json({
      message: 'API calls completed.',
      results: mappedResults,
    });
  } catch (error) {
    console.error('❌ Error during API calls:', error);
    res.status(500).json({ error: 'An error occurred while processing the APIs.' });
  }
};

//Endpoint to detect available APIs
const detectAPIs = async (req, res) => {
  res.json({ apis: Object.keys(apis) });
};

module.exports = { flightsApis, detectAPIs };
