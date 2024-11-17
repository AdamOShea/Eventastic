const client = require('../api/client');  

const login = async (values) => {
  try {

    // Send the POST request with custom validation for the status
    const response = await client.post('/login-user', values, {
      validateStatus: (status) => status < 500 // Don't reject on 4xx or 5xx errors
    });

    if (response.status === 200 && response.data.success) {
      console.log("Login successful");
      return { message: 'User logged in', user: response.data.user };
    } else if (response.status === 404) {
      // Handle 404 errors manually
      return { message: 'Not logged in' };
    } else {
      // Handle other responses that are not 404 but still have success false
      return { message: 'Not logged in' };
    }
  } catch (error) {
    console.error("Login error:", error);
    // Handle unexpected errors
    return { message: 'Not logged in' };
  }
};

module.exports = { login };
