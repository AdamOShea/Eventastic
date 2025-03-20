import client from "../api/client";

export const fetchSavedTrips = async () => {
  try {
    const response = await client.get("/fetch-saved-trips");
    if (response.status === 200) {
      console.log("✅ Saved trips fetched:", response.data);
      return response.data;
    } else {
      console.warn("❌ Failed to fetch trips.");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching trips:", error);
    return [];
  }
};
