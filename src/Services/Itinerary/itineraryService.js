import API from "../api";

export const fetchItineraries = async (page = 1, limit = 10) => {
  const res = await API.get("/itinerary", {
    params: { page, limit },
  });
  return res.data;
};

export const createItinerary = async (
  userId,
  name,
  from,
  to,
  date,
  location,
  duration,
  hotelName,
  totalcost
) => {
  const res = await API.post("/itinerary", {
    userId,
    name,
    from,
    to,
    date,
    location,
    duration,
    hotelName,
    totalcost,
  });
  return res.data;
};
