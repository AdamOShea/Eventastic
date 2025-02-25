const client = require('../api/client');  

const detectAPIs = async () => {
  try {

    // Send the POST request with custom validation for the status
    const response = await client.post('/detect-apis', {
      validateStatus: (status) => status < 500 // Don't reject on 4xx or 5xx errors
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Ensure this returns a JSON object
    if (!data || !Array.isArray(data.apis)) {
      throw new Error('Invalid data format received from the server.');
    }

    return data.apis; // Should be an array like ["API 1", "API 2"]
  } catch (err) {
    console.error('API detection error:', err);
    return []; // Return an empty array to prevent crashes on the frontend
  }
};

module.exports = { detectAPIs };
