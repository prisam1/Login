import { useState, useEffect } from "react";
import { fetchItineraries } from "../Services/Itinerary/itineraryService";

export const useItineraries = (initialPage = 1, limit = 10) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (page) => {
    setLoading(true);
    try {
      const res = await fetchItineraries(page, limit);
      setData(res.data);
      setTotalPages(res.totalPages);
      setCurrentPage(res.currentPage);
    } catch (err) {
      setError(err.message || "Failed to fetch");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  return {
    data,
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    reload: () => loadData(currentPage),
  };
};
