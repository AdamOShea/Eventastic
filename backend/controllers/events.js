const { pool } = require('../models/db');
const fs = require('fs');
const path = require('path');

const apiDirectory = path.join(__dirname, '../scrapersAndApis')

const apis = {};

// import all APIs from the API folder
fs.readdirSync(apiDirectory).forEach((file) => {
  const filePath = path.join(apiDirectory, file);

  if (file.endsWith('.js')) {
    const apiName = path.basename(file, '.js');
    apis[apiName] = require(filePath);
  }
});

console.log('loaded APIs: ', apis);

const apiToDb = async (req, res) => {
  const { keyword } = req.body;
  const { selectedAPIs } = req.body;

  console.log('selectedAPIs:', selectedAPIs);

  if (Array.isArray(selectedAPIs) && selectedAPIs.length > 0) {
    try {
      // Create an array of promises by calling each API function
      const apiPromises = selectedAPIs.map((api) => {
        if (apis[api]) {
          console.log(`Calling API: ${api}`);
          return apis[api](keyword);  // Return the promise from each API call
        } else {
          console.log(`API "${api}" not found.`);
          return Promise.resolve({message: `API "${api}" failed in its duties`}); // Resolve with null if the API is not found
        }
      });

      // Wait for all API calls to complete asynchronously in parallel
      const results = await Promise.allSettled(apiPromises);

      // Optionally, you can log results or process them
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`${selectedAPIs[index]} succeeded:`, result.value);
        } else {
          console.error(`${selectedAPIs[index]} failed:`, result.reason);
        }
      });

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
      console.error('Error during API calls:', error);
      res.status(500).send('An error occurred while processing the APIs.');
    }
  } else {
    console.log('No valid APIs selected or selectedAPIs is not an array.');
    res.status(400).send('No valid APIs selected.');
  }
};

const detectAPIs = async (req, res) => {
  const apiNames = Object.keys(apis);
  res.json({apis: apiNames});
  
}


const eventsFromDb = async (req, res) => {
    const {keyword} = req.body;
    console.log(keyword);

    try {
        const query = `
            SELECT * FROM eventastic."Event"
            WHERE title ILIKE ($1)
            or artist ILIKE ($1)
            or eventtype ILIKE ($1)
            or genre ILIKE ($1);
            `;
        
        const values = [`%${keyword}%`];
        const result = await pool.query(query, values);

        console.log("returning from db: " +keyword);
        
        res.json({success: true, events: result.rows});
    } catch (err) {
        console.error(err);
    }
};


module.exports = { eventsFromDb, apiToDb, detectAPIs};