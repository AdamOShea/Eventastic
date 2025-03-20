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
        SELECT * from eventastic."SavedTrip"
        WHERE userid = $1;
        `;

        const values = [`%${userid}%`];
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