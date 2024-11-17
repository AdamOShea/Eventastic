const client = require('../api/client');  



const register = async (values) => {
  try {
    // First, try to find the user
    console.log("first try ");
    const response = await client.post('/find-one-user', values);

    // If the user exists, return their userID
    if (response.status === 200 && response.data.userID) {
      return { message: 'User already exists', userID: response.data.userID };
    }

  } catch (error) {
    // Handle specific 500 status error from /find-one-user API
    if (error.response && error.response.status === 500) {
      console.error('Internal server error from /find-one-user:', error);
      throw new Error('Internal server error occurred while checking user');
    }
    
    // Handle 404 (user not found) or any other error from /find-one-user
    if (error.response && error.response.status === 404) {
      // User not found, proceed to user creation logic
        try {
          console.log("404 try");
            const createResponse = await client.post('/create-user', values);

            if (createResponse.status === 201) {
                return { message: createResponse.data.message, userID: createResponse.data.userID };
            } else {
              console.log("404 else")
              return {message : createResponse.data.message}
            }
        } catch (error) {
            console.error(error);
            console.log("404 catch")
        }
    } else {
      // Any other unexpected error, general catch-all
      console.error(error);
      throw new Error('some error occurred');
    }
  }

  
};

module.exports = { register };
