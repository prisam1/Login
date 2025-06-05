import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItinerary } from "../Services/Itinerary/itineraryService";
import { toast } from "react-toastify";

export const useCreateItinerary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const create = async ({
    userId,
    name,
    from,
    to,
    date,
    location,
    duration,
    hotelName,
    totalcost,
  }) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      await createItinerary(
        userId,
        name,
        from,
        to,
        date,
        location,
        duration,
        hotelName,
        totalcost
      );
      toast.success("Itinerary created successfully!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error creating itinerary:", error);
      toast.error("Failed to create itinerary. Try again.");
    }
  };

  return { create, loading, error };
};
