import API from "../api";

export const fetchItineraries = async ({ page = 1, limit = 10, search = "", sortBy = "date" } = {}, signal) => {
  const res = await API.get("/itinerary", {
    params: { page, limit, ...(search && { search }), sortBy },
    signal,
  });
  const body = res.data || {};
  return {
    data: Array.isArray(body.data) ? body.data : [],
    currentPage: Number(body.currentPage) || page,
    totalPages: Math.max(0, Number(body.totalPages) || 0),
  };
};

export const createItinerary = async (itinerary) => {
  const res = await API.post("/itinerary", itinerary);
  return res.data?.data;
};

// The API's PUT endpoint looks the itinerary up by the `userId` field, so the itinerary id is sent there.
export const updateItinerary = async (itineraryId, changes) => {
  const res = await API.put("/itinerary", { ...changes, userId: itineraryId });
  return res.data?.data;
};
