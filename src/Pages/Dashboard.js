import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useItineraries } from "../hooks/useItineraries";
import "../style/dashboard.css";

const Dashboard = () => {
  const { data, loading, error, currentPage, totalPages, setCurrentPage } =
    useItineraries();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="Dashboard-home">
      <div className="topcontent">
        <Link to="/create">
          <button className="dashcontent">Create Itinerary</button>
        </Link>
        <button className="dashcontent">Itinerary Update</button>
        <button className="dashcontent">Itinerary Data</button>
      </div>

      <div className="datacontent">
        <div className="table-container">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : data.length === 0 ? (
            <p className="not-found">No Data Found</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>To</th>
                  <th>From</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Duration</th>
                  <th>Hotel Name</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, index) => (
                  <tr key={index}>
                    <td>{d.name}</td>
                    <td>{d.to}</td>
                    <td>{d.from}</td>
                    <td>{formatDate(d.date)}</td>
                    <td>{d.location}</td>
                    <td>{d.duration}</td>
                    <td>{d.hotelName}</td>
                    <td>{d.totalcost}₹</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrev} disabled={currentPage === 1}>
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
