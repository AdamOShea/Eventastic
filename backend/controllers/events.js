const { pool } = require('../models/db');

const eventsFromDb = async (req, res) => {
    const {input} = req.body;
    console.log(input);

    try {
        const query = `
            SELECT * FROM public."Event"
            WHERE title ILIKE ($1)
            or artist ILIKE ($1)
            or eventtype ILIKE ($1)
            or genre ILIKE ($1);
            `;
        
        const values = [`%${input}%`];
        const result = await pool.query(query, values);
        
        res.json({success: true, events: result.rows});
    } catch (err) {
        console.error(err);
    }
};

module.exports = { eventsFromDb};