import API from "../api";

export const fetchItineraries = async ({ page = 1, limit = 10, search = "", sortBy = "date", order = "asc" } = {}, signal) => {
  const res = await API.get("/itinerary", {
    params: { page, limit, ...(search && { search }), sortBy, order },
    signal,
  });
  const body = res.data || {};
  const data = Array.isArray(body.data) ? body.data : [];
  return {
    data,
    currentPage: Number(body.currentPage) || page,
    totalPages: Math.max(0, Number(body.totalPages) || 0),
    total: Number.isFinite(Number(body.total)) ? Number(body.total) : null,
  };
};

export const fetchItinerary = async (id, signal) => {
  const res = await API.get(`/itinerary/${encodeURIComponent(id)}`, { signal });
  return res.data?.data;
};

export const createItinerary = async (itinerary) => {
  const res = await API.post("/itinerary", itinerary);
  return res.data?.data;
};

export const updateItinerary = async (itineraryId, changes) => {
  const res = await API.put(`/itinerary/${encodeURIComponent(itineraryId)}`, changes);
  return res.data?.data;
};

export const deleteItinerary = async (itineraryId) => {
  await API.delete(`/itinerary/${encodeURIComponent(itineraryId)}`);
};
