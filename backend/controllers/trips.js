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
    const { userid } = req.body;

    try {
        const query = `
        SELECT 
    trip.tripid,
    trip.userid,
    
    -- Event Details
    e.eventid, e.title, e.date, e.venue, e.eventlocation, e.eventlink,

    -- Accommodation Details
    a.accommid, a.name AS accom_name, a.price AS accom_price, a.rating AS accom_rating, a.imageurl AS accom_image,

    -- Outbound Flight Details
    f1.flightid AS outflightid, f1.airline AS out_airline, f1.departureairport AS out_departure, f1.arrivalairport AS out_arrival, f1.duration AS out_duration, f1.price AS out_price,

    -- Return Flight Details
    f2.flightid AS returnflightid, f2.airline AS return_airline, f2.departureairport AS return_departure, f2.arrivalairport AS return_arrival, f2.duration AS return_duration, f2.price AS return_price

    FROM eventastic."SavedTrip" trip
    LEFT JOIN eventastic."Event" e ON trip.eventid = e.eventid
    LEFT JOIN eventastic."Accommodation" a ON trip.accommid = a.accommid
    LEFT JOIN eventastic."Flights" f1 ON trip.outflightid = f1.flightid
    LEFT JOIN eventastic."Flights" f2 ON trip.returnflightid = f2.flightid

    WHERE trip.userid = $1;  -- ✅ Replace with User ID
    `;

        const values = [userid];
        const result = await pool.query(query, values);

        res.json({
            success: true,
            trips: Array.isArray(result.rows) ? result.rows : [], // Ensure events is always an array
          });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

module.exports = { saveTrip, fetchSavedTrips };