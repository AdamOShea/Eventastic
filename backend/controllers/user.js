const bcrypt = require('bcrypt');
const { pool } = require('../models/db');

const createUser = async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;
  console.log(req.body);

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO eventastic."User" (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING userid;
    `;
    const values = [username, hashedPassword, email];
    const result = await pool.query(query, values);

    res.status(201).send({ message: 'User created successfully', userID: result.rows[0].userid });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
};

const findOneUser = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  try {
    const query = `
      SELECT * FROM eventastic."User" 
      WHERE email = $1;
    `;
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'User not Found' });
    }

    res.status(200).send({ message: 'User Found', userID: result.rows[0].userid });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
};

const searchUsers = async (req, res) => {
  const { username } = req.body;
  console.log(req.body);

  try {
    const query = `
      SELECT * FROM eventastic."User" 
      WHERE username ILIKE $1;
    `;
    const values = [`%${username}%`];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Users not Found' });
    }

    res.status(200).send({ 
      message: 'Users Found', 
      users: Array.isArray(result.rows) ? result.rows : [] 
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const query = `
      SELECT * FROM eventastic."User" 
      WHERE email = $1;
    `;
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

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
  searchUsers
};