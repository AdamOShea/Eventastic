const client = require('../api/client');  // CommonJS import for the HTTP client


const login = async (values) => {
    try {
      const res = await client.post('/login-user', {
      ...values
      });
      console.log(res.data);
    }catch (err) {
      console.error(err);
    }
  }