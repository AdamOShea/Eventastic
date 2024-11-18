const { pool } = require('../models/db');

const eventsFromDb = async (req, res) => {
    const {searchQuery} = req.body;
    console.log(req.body);

    try {
        const query = `
            SELECT * FROM public."events"
            WHERE title ILIKE '%($1)%'
            or artists ILIKE '%($1)%'
            or eventtype ILIKE '%($1)%'
            or genre ILIKE '%($1)%';
            `;
        
        const values = [searchQuery];
        const result = await pool.query(query, values);
        const event = res.json(result.rows[0]);
        res.json({success: true, event});
    } catch (err) {
        console.error(err);
    }
};