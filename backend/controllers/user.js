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

  // Validate the request body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const query = `
      SELECT * FROM public."User" 
      WHERE email = $1;
    `;
    const values = [email];
    const result = await pool.query(query, values);

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Validate user credentials
    if (user.password !== password) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    // Successful login
    res.status(200).json({ success: true, user, message: 'Signed in' });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
};


module.exports = {
  createUser,
  findOneUser,
  loginUser,
};
