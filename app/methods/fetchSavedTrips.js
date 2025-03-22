import client from "../api/client";

export const fetchSavedTrips = async (values) => {
  try {
    const response = await client.post("/fetch-saved-trips", values);
    if (response.status === 200 && response.data.success) {
        return response.data.trips || [];
    } else {
      console.warn("❌ Failed to fetch trips.");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching trips:", error);
    return [];
  }
};
