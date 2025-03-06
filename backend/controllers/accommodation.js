const { callPythonApi } = require('../methods/callPythonApi'); // Import the function to run Python scripts
const fs = require('fs');
const path = require('path');

const apiDirectory = path.join(__dirname, '../accommodation-apis');

const apis = {};

// Import all Python API scripts from the accommodation-apis folder
fs.readdirSync(apiDirectory).forEach((file) => {
  if (file.endsWith('.py')) {
    const apiName = path.basename(file, '.py');
    apis[apiName] = path.join(apiDirectory, file); // Store full script path
  }
});

console.log('✅ Loaded Accommodation APIs:', Object.keys(apis));

const accommApis = async (req, res) => {
  const { latitude, longitude, checkIn, checkOut, apis: selectedAPIs } = req.body;

  console.log('🔎 Received payload at /accomm-apis:', req.body); // Log request body

  if (!latitude || !longitude || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required parameters: latitude, longitude, checkIn, checkOut' });
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
        return callPythonApi(scriptPath, [latitude, longitude, checkIn, checkOut]); // Run Python script with arguments
      } else {
        console.log(`❌ API "${apiName}" not found.`);
        return Promise.resolve({ error: `API "${apiName}" does not exist.` });
      }
    });

    // Wait for all API calls to complete
    const results = await Promise.allSettled(apiPromises);

    // Process results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ ${selectedAPIs[index]} succeeded:`, result.value);
      } else {
        console.error(`❌ ${selectedAPIs[index]} failed:`, result.reason);
      }
    });

    // Send response
    res.status(200).json({
      message: 'API calls completed.',
      results: results.map((result, index) => ({
        api: selectedAPIs[index],
        status: result.status,
        data: result.value || null,
        error: result.reason || null,
      })),
    });
  } catch (error) {
    console.error('❌ Error during API calls:', error);
    res.status(500).json({ error: 'An error occurred while processing the APIs.' });
  }
};

const detectAPIs = async (req, res) => {
  res.json({ apis: Object.keys(apis) });
};

module.exports = { accommApis, detectAPIs };
