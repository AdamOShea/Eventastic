const { pool } = require('../models/db');

const addFriend = async (req, res) => {
    const { userId_1, userId_2 } = req.body;
    console.log(req.body);

    try {
        const query = `
        INSERT INTO eventastic."Friends" ("userId_1", "userId_2")
        VALUES ($1, $2);
        `;
        const values = [userId_1, userId_2];
        const result = await pool.query(query, values);

        res.status(201).send({ message: 'Friendship created successfully'});
  } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
  }
};

const fetchFriends = async (req, res) => {
    const {userId_1} = req.body;

    try {
        const query = `
        SELECT * FROM eventastic."Friends"
        WHERE "userId_1" = $1;
        `;

        const values = [userId_1];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No friends found' });
        }

        res.status(200).send({ 
            message: 'Friends Found', 
            friends: Array.isArray(result.rows) ? result.rows : [] 
          });

    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

module.exports = {
    addFriend,
    fetchFriends
  };