import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/dashboard.css";

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://cust-rks8.onrender.com/ItinararyGet", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setData(json.data);
      });
  }, [navigate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="Dashboard-home">
      <div className="topcontent">
        <Link to="/CreateIt">
          <button className="dashcontent">Create Itinerary</button>
        </Link>
        <button className="dashcontent">Itinerary Update</button>
        <button className="dashcontent">Itinerary Data</button>
      </div>

      <div className="datacontent">
        <div className="table-container">
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
              {currentItems.map((d, index) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrev} disabled={currentPage === 1}>
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>
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
