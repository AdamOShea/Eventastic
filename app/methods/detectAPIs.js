const client = require('../api/client');  

const detectAPIs = async () => {
  try {

    // Send the POST request with custom validation for the status
    const response = await client.post('/detect-apis', {
      validateStatus: (status) => status < 500 // Don't reject on 4xx or 5xx errors
    });

    const data = await response.json();
    return data.apis;
  } catch (error) {
    console.error("API detection error:", error);
    // Handle unexpected errors
    return { message: 'API detection error' };
  }
};

module.exports = { detectAPIs };
