import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useSelector } from "react-redux";
import "../../style/header.css";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  return (
    <div className="header">
      {!localStorage.getItem("token") ? (
        <div className="navbar-nav-container">
          <Link to="/" className="h1">
            Itinerary
          </Link>

          <div className="navbar-nav-2">
            <div>
              <Link to="/" className="nav-link-home">
                Home
              </Link>
            </div>
            <div>
              <Link to="/Register" className="nav-link-reg">
                Register
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/login" className="nav-link-log">
                Login
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="navbar-nav-container">
          <Link to="/Dashboard" className="h1">
            Itinerary
          </Link>
          <div className="navbar-nav">
            <div className="user">
              {localStorage.getItem("token") && (
                <div className="user-name">
                  Welcome{" "}
                  <Link to="/Dashboard" className="logout">
                    {user}
                  </Link>
                </div>
              )}
            </div>
            <Link onClick={handleLogout} className="logout">
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
