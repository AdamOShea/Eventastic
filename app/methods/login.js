const client = require('../api/client');  

const login = async (values) => {
  try {

    // Send the POST request with custom validation for the status
    const response = await client.post('/login-user', values, {
      validateStatus: (status) => status < 500 // Don't reject on 4xx or 5xx errors
    });

    if (response.status === 200 && response.data.success) {
      console.log("Login successful");
      return { message: 'Signed in', user: response.data.user };
    } else {
      console.log("login 404");
      return { message: response.data.message };
    }
  } catch (error) {
    console.error("Login error:", error);
    // Handle unexpected errors
    return { message: 'unknown error' };
  }
};

module.exports = { login };
