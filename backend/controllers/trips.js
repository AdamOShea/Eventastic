const { pool } = require('../models/db');

const saveTrip = async (req, res) => {
    const { userid, eventid, accommid, outflightid, returnflightid } = req.body;
    const shared = false;
    try {
        const query = `
        INSERT INTO eventastic."SavedTrip" (userid, eventid, accommid, outflightid, returnflightid, shared)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING tripid;
    `;
        const values = [userid, eventid, accommid, outflightid, returnflightid, shared];
        const result = await pool.query(query, values);

        res.status(201).send({ message: 'Trip stored successfully', tripid: result.rows[0].tripid })
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }

};

const fetchSavedTrips = async (req, res) => {
    const { userid } = req.body;

    try {
        const query = `
    SELECT 
        trip."tripid",
        trip."userid",
        trip."shared",
        
        -- Event Details
        e."eventId", e."eventTitle", e."eventDate", e."eventVenue", e."eventLocation", e."eventLink", e."eventImages", e."eventSeller", 
        e."eventArtist", e."eventGenre", e."eventPrice", e."eventDescription", e."eventImages",

        -- Accommodation Details
        a."accommId", a."accommName" AS "accommName", a."accommPrice" AS "accommPrice", a."accommRating" AS "accommRating", a."accommImages" AS "accommImages",
        a."accommUrl" AS "accommUrl", 

        -- Outbound Flight Details
        f1."flightId" AS "outflightId", f1."flightAirline" AS "outFlightAirline", f1."flightDepartureAirport" AS "outFlightDeparture", 
        f1."flightArrivalAirport" AS "outFlightArrival", f1."flightDuration" AS "outFlightDuration", f1."flightPrice" AS "outFlightPrice",
        f1."flightDepartureTime" AS "outFlightDepartureTime", f1."flightArrivalTime" AS "outFlightArrivalTime", f1."flightUrl" AS "outFlightUrl",

        -- Return Flight Details
        f2."flightId" AS "returnflightId", f2."flightAirline" AS "returnFlightAirline", f2."flightDepartureAirport" AS "returnFlightDeparture", 
        f2."flightArrivalAirport" AS "returnFlightArrival", f2."flightDuration" AS "returnFlightDuration", f2."flightPrice" AS "returnFlightPrice",
        f2."flightDepartureTime" AS "returnFlightDepartureTime", f2."flightArrivalTime" AS "returnFlightArrivalTime", f2."flightUrl" as "returnFlightUrl"

        FROM eventastic."SavedTrip" trip
        LEFT JOIN eventastic."Event" e ON trip."eventid" = e."eventId"
        LEFT JOIN eventastic."Accommodation" a ON trip."accommid" = a."accommId"
        LEFT JOIN eventastic."Flights" f1 ON trip."outflightid" = f1."flightId"
        LEFT JOIN eventastic."Flights" f2 ON trip."returnflightid" = f2."flightId"

        WHERE trip."userid" = $1 AND trip."shared" = true;  
    `;


        const values = [userid];
        const result = await pool.query(query, values);
        console.log(result);

        res.json({
            success: true,
            trips: Array.isArray(result.rows) ? result.rows : [],
          });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

const updateShareStatus = async (req, res) => {
    const { tripid, shared } = req.body;
  
    if (!tripid || typeof shared !== 'boolean') {
      return res.status(400).json({ message: 'Missing or invalid parameters' });
    }
  
    try {
      const query = `
        UPDATE eventastic."SavedTrip"
        SET shared = $1
        WHERE tripid = $2
        RETURNING *;
      `;
      const values = [shared, tripid];
      const result = await pool.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Trip not found' });
      }
  
      res.status(200).json({ message: 'Trip sharing status updated', trip: result.rows[0] });
    } catch (err) {
      console.error('Error updating share status:', err);
      res.status(500).send('Server error');
    }
  };


module.exports = { saveTrip, fetchSavedTrips, updateShareStatus };