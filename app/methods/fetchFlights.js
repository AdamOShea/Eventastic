const client = require('../api/client');

export const fetchFlightsAPI = async (values) => {
  try {
    const apiResponse = await client.post('/flights-apis', values);
    //console.log("Accomm API Response:", apiResponse.data);

    if (apiResponse.status === 200) {
      console.log(" fetchFlights successful");
      return apiResponse.data; // 🔥 Ensure function returns API data
    } else {
      console.log(" fetchFlights failed with status:", apiResponse.status);
      return null;
    }
  } catch (err) {
    console.error(" fetchflights error:", err.response?.data || err.message);
    return null;
  }
};