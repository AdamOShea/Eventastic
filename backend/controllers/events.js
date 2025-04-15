const { pool } = require('../models/db');
const fs = require('fs');
const path = require('path');

const apiDirectory = path.join(__dirname, '../events-apis')

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
  const { apis: selectedAPIs } = req.body;

  console.log('🔎 Received payload at /api-to-db:', req.body); //  Check entire body

  if (Array.isArray(selectedAPIs) && selectedAPIs.length > 0) {
    try {
      // Create an array of promises by calling each API function
      const apiPromises = selectedAPIs.map((api) => {
        if (apis[api]) {
          console.log(`Calling API: ${api}`);
          return apis[api](req.body);  // Return the promise from each API call
        } else {
          console.log(`API "${api}" not found.`);
          return Promise.resolve({message: `API "${api}" failed in its duties`}); // Resolve with null if the API is not found
        }
      });

      // Wait for all API calls to complete asynchronously in parallel
      const results = await Promise.allSettled(apiPromises);

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
  const { keyword, location, date, apis } = req.body;

  try {
    let query = `SELECT * FROM eventastic."Event"`;
    let conditions = [];
    let values = [];

    if (keyword) {
      conditions.push(`(
        "eventTitle" ILIKE $${values.length + 1} OR
        "eventArtist" ILIKE $${values.length + 1} OR
        "eventType" ILIKE $${values.length + 1} OR
        "eventGenre" ILIKE $${values.length + 1}
      )`);
      values.push(`%${keyword}%`);
    }

    if (location) {
      conditions.push(`("eventLocation" ILIKE $${values.length + 1} OR "eventVenue" ILIKE $${values.length + 1})`);

      values.push(`%${location}%`);
    }

    if (date) {
      conditions.push(`DATE("eventDate") = $${values.length + 1}::date`);
      values.push(date);
    }

    if (Array.isArray(apis) && apis.length > 0) {
      const apiPlaceholders = apis.map((_, i) => `$${values.length + i + 1}`);
      conditions.push(`"eventSeller" IN (${apiPlaceholders.join(', ')})`);
      values.push(...apis);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY "eventDate" ASC;`;

    //console.log(query, values);


    const result = await pool.query(query, values);
        
        res.json({
          success: true,
          events: Array.isArray(result.rows) ? result.rows : [], // Ensure events is always an array
        });
    } catch (err) {
        console.error(err);
    }
};

const getEventId = async (req, res) => {
  const {eventLink} = req.body;
  console.log(eventLink);

  try {
    const query = `
        SELECT * FROM eventastic."Event"
        WHERE "eventLink" ILIKE $1;
        `;
    
    const values = [`%${eventLink}%`];
    const result = await pool.query(query, values);

    res.json({
      success: true,
      eventId: result.rows[0].eventId, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
}

const cleanEventsDB = async (req, res) => {
  

  try {
    const query = `
      DELETE FROM eventastic."Event"
      WHERE "eventDate" < CURRENT_DATE;
    `;
    
    const result = await pool.query(query);

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
}

module.exports = { eventsFromDb, apiToDb, detectAPIs, getEventId, cleanEventsDB};