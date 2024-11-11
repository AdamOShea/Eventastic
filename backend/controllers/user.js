const db = require('../models/db');

exports.createUser = async (req, res) => {
    const {username, password, email} = req.body;
    console.log(req.body);
    
    try {
      const query = `
        INSERT INTO public."User" (username, password, email)
        VALUES ($1, $2, $3)
        RETURNING userid;
        `;
      const values = [username, password, email];
      const result = await  db.pool.query(query, values);
      res.status(201).send({ message: 'user stored', userID: result.rows[0].id });
    } catch (err) {
      console.error(err);
      res.status(500).send('some error occurred');
    }
};

exports.loginUser = async (req, res) => {
    try{
        const query = ``;
    } catch (err) {
        console.error(err);
    }
};