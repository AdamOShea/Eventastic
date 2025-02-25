const axios = require('axios').default; // Explicitly use `.default`

const client = axios.create({
  baseURL: 'http://eventastic.tech:3000',
});

module.exports = client;
