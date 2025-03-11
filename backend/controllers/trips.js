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

module.exports = { saveTrip};