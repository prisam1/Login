import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createItinerary, deleteItinerary, updateItinerary } from "../Services/Itinerary/itineraryService";
import { getErrorMessage } from "../Services/errors";
import { selectAuth } from "../redux/authSlice";
import { cacheItineraries, forgetItinerary, rememberOwned } from "../utils/cache";

export const useSaveItinerary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlight = useRef(false);
  const { userId } = useSelector(selectAuth);

  const save = useCallback(
    async (values, existingId) => {
      if (inFlight.current) return null;
      if (!userId) {
        setError("We couldn't identify your account. Please log out and log in again.");
        return null;
      }
      inFlight.current = true;
      setLoading(true);
      setError(null);
      try {
        const saved = existingId
          ? await updateItinerary(existingId, values)
          : await createItinerary({ ...values, userId });
        const result = saved && saved._id ? saved : { ...values, _id: existingId, userId };
        rememberOwned(userId, result._id);
        cacheItineraries([result]);
        return result;
      } catch (err) {
        setError(getErrorMessage(err, existingId ? "Failed to update itinerary." : "Failed to create itinerary."));
        return null;
      } finally {
        inFlight.current = false;
        setLoading(false);
      }
    },
    [userId]
  );

  return { save, loading, error, clearError: () => setError(null) };
};

export const useDeleteItinerary = () => {
  const [deletingId, setDeletingId] = useState(null);

  const remove = useCallback(async (itinerary) => {
    setDeletingId(itinerary._id);
    try {
      await deleteItinerary(itinerary._id);
      forgetItinerary(itinerary._id);
      return { ok: true };
    } catch (err) {
      const notFound = err?.response?.status === 404;
      if (notFound) forgetItinerary(itinerary._id);
      return { ok: notFound, message: notFound ? null : getErrorMessage(err, "Failed to delete itinerary.") };
    } finally {
      setDeletingId(null);
    }
  }, []);

  return { remove, deletingId };
};
