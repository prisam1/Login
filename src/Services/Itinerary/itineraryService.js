import API from "../api";

export const fetchItineraries = async (page = 1, limit = 10) => {
  const res = await API.get("/itinerary", {
    params: { page, limit },
  });
  return res.data;
};
