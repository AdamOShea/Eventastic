const { pool } = require('../models/db');

const saveTrip = async (req, res) => {
    const { userid, eventid, accommid, outflightid, returnflightid } = req.body;

    try {
        const query = `
        INSERT INTO eventastic."SavedTrip" (userid, eventid, accommid, outflightid, returnflightid)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING tripid;
    `;
        const values = [userid, eventid, accommid, outflightid, returnflightid];
        const result = await pool.query(query, values);

        res.status(201).send({ message: 'Trip stored successfully', tripid: result.rows[0].tripid })
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }

};

const fetchSavedTrips = async (req, res) => {
    const { userId } = req.body;

    try {
        const query = `
    SELECT 
        trip."tripid",
        trip."userid",
        
        -- Event Details
        e."eventId", e."eventTitle", e."eventDate", e."eventVenue", e."eventLocation", e."eventLink",

        -- Accommodation Details
        a."accommId", a."accommName" AS "accommName", a."accommPrice" AS "accommPrice", a."accommRating" AS "accommRating", a."accommImages" AS "accommImages",

        -- Outbound Flight Details
        f1."flightId" AS "outflightId", f1."flightAirline" AS "outFlightAirline", f1."flightDepartureAirport" AS "outFlightDeparture", 
        f1."flightArrivalAirport" AS "outFlightArrival", f1."flightDuration" AS "outFlightDuration", f1."flightPrice" AS "outFlightPrice",

        -- Return Flight Details
        f2."flightId" AS "returnflightId", f2."flightAirline" AS "returnFlightAirline", f2."flightDepartureAirport" AS "returnFlightDeparture", 
        f2."flightArrivalAirport" AS "returnFlightArrival", f2."flightDuration" AS "returnFlightDuration", f2."flightPrice" AS "returnFlightPrice"

        FROM eventastic."SavedTrip" trip
        LEFT JOIN eventastic."Event" e ON trip."eventid" = e."eventId"
        LEFT JOIN eventastic."Accommodation" a ON trip."accommid" = a."accommId"
        LEFT JOIN eventastic."Flights" f1 ON trip."outflightid" = f1."flightId"
        LEFT JOIN eventastic."Flights" f2 ON trip."returnflightid" = f2."flightId"

        WHERE trip."userid" = $1;  
    `;


        const values = [userId];
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

module.exports = { saveTrip, fetchSavedTrips };