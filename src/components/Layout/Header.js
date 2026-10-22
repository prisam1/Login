import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LayoutDashboard, LogOut, Map, Menu, Moon, Plus, Sun, X } from "lucide-react";
import { selectAuth } from "../../redux/authSlice";
import { endSession } from "../common/SessionWatcher";
import { firstName, initials } from "../../utils/format";
import { isTokenValid } from "../../utils/session";
import "../../style/header.css";

const Header = ({ theme, toggleTheme }) => {
  const { user, token } = useSelector(selectAuth);
  const loggedIn = isTokenValid(token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target) && !toggleRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    endSession(dispatch);
    toast.success("You've been logged out.", { toastId: "logged-out" });
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`;

  const links = loggedIn ? (
    <>
      <NavLink to="/dashboard" className={navClass}>
        <LayoutDashboard aria-hidden="true" /> Dashboard
      </NavLink>
      <NavLink to="/create" className={navClass}>
        <Plus aria-hidden="true" /> New itinerary
      </NavLink>
    </>
  ) : (
    <>
      <NavLink to="/" end className={navClass}>
        Home
      </NavLink>
      <NavLink to="/login" className={navClass}>
        Log in
      </NavLink>
    </>
  );

  const themeButton = (
    <button
      type="button"
      className="icon-button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to={loggedIn ? "/dashboard" : "/"} className="brand" aria-label="Itinerary home">
          <span className="brand-mark">
            <Map aria-hidden="true" />
          </span>
          <span className="brand-name">Itinerary</span>
        </Link>

        <nav className="nav-desktop" aria-label="Main">
          {links}
        </nav>

        <div className="header-actions">
          {themeButton}
          {loggedIn ? (
            <div className="user-chip-group">
              <Link to="/dashboard" className="user-chip" title={user || "Your account"}>
                <span className="avatar" aria-hidden="true">
                  {initials(user)}
                </span>
                <span className="user-chip-name">{firstName(user)}</span>
              </Link>
              <button type="button" className="btn btn-ghost btn-sm logout-btn" onClick={handleLogout}>
                <LogOut aria-hidden="true" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <Link to="/register" className="btn btn-primary btn-sm header-cta">
              Get started
            </Link>
          )}
          <button
            ref={toggleRef}
            type="button"
            className="icon-button menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" ref={menuRef} className="mobile-menu">
          <nav className="container mobile-menu-inner" aria-label="Mobile">
            {loggedIn && (
              <div className="mobile-user">
                <span className="avatar" aria-hidden="true">
                  {initials(user)}
                </span>
                <div>
                  <p className="mobile-user-label">Signed in as</p>
                  <p className="mobile-user-name">{user || "Traveller"}</p>
                </div>
              </div>
            )}
            {links}
            {loggedIn ? (
              <button type="button" className="nav-link nav-link-danger" onClick={handleLogout}>
                <LogOut aria-hidden="true" /> Log out
              </button>
            ) : (
              <Link to="/register" className="btn btn-primary btn-block">
                Create free account
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
