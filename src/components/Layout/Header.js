import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import "../../style/header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  return (
    <div className="top">
      <h1 className="h1">Itinerary</h1>
      <div className="navbar-nav">
        {!localStorage.getItem("token") ? (
          <>
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
          </>
        ) : (
          <>
            <div className="user">
              {localStorage.getItem("token") && (
                <div className="user-name">
                  Welcome,{" "}
                  <Link to="/Dashboard" className="nav-link-reg">
                    {localStorage.getItem("name")}
                  </Link>
                </div>
              )}
            </div>
            <div>
              <Link onClick={handleLogout} className="logout">
                Logout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
