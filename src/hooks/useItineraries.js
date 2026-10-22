import { useState, useEffect, useCallback, useRef } from "react";
import { fetchItineraries } from "../Services/Itinerary/itineraryService";
import { getErrorMessage } from "../Services/errors";
import { cacheItineraries } from "../utils/cache";

export const useItineraries = ({ page, limit, search, sortBy, order }) => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastLoaded, setLastLoaded] = useState(null);
  const controllerRef = useRef(null);
  const loadedOnce = useRef(false);

  const loadData = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (loadedOnce.current) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetchItineraries({ page, limit, search, sortBy, order }, controller.signal);
      if (controller.signal.aborted) return;
      setData(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
      setError(null);
      setLastLoaded(new Date());
      cacheItineraries(res.data);
      loadedOnce.current = true;
    } catch (err) {
      if (controller.signal.aborted) return;
      const message = getErrorMessage(err, "Failed to load itineraries.");
      if (message) setError(message);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [page, limit, search, sortBy, order]);

  useEffect(() => {
    loadData();
    return () => controllerRef.current?.abort();
  }, [loadData]);

  return {
    data,
    totalPages,
    total,
    loading,
    refreshing,
    error,
    lastLoaded,
    reload: loadData,
  };
};
