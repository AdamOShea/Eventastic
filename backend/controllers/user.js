const { pool } = require('../models/db');

const createUser = async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;
  console.log(req.body);

  try {
    const query = `
      INSERT INTO public."User" (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING userid;
    `;
    const values = [username, password, email];
    const result = await pool.query(query, values);

    // UUID is returned here
    res.status(201).send({ message: 'User created successfully', userID: result.rows[0].userid });
  } catch (err) {
    console.error(err);
    res.status(500).send('some error occurred');
  }
};

const findOneUser = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  try {
    const query = `
      SELECT * FROM public."User" 
      WHERE email = ($1);
    `;
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'User not Found' });
    }

    // Return the UUID userID
    res.status(200).send({ message: 'User Found', userID: result.rows[0].userid });
  } catch (err) {
    console.error(err);
    res.status(500).send('some error occurred');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const query = `
      SELECT * FROM public."User" 
      WHERE email = ($1);
    `;
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not Found' });
    }

    const user = result.rows[0];

    if (user.email !== email || user.password !== password) {
      res.json({ success: false, message: 'Email or password is incorrect' });
    }
    res.json({ success: true, user, message: "Signed in" });
  } catch (err) {
    console.error(err);
    res.status(500).send('some error occurred');
  }
};

module.exports = {
  createUser,
  findOneUser,
  loginUser,
};
