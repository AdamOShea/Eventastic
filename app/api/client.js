const axios = require('axios').default; // Explicitly use `.default`

const client = axios.create({
  baseURL: 'http://192.168.1.33:3000',
});

module.exports = client;
