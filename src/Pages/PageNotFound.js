import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import notfound from "../Images/404.png";
import { selectAuth } from "../redux/authSlice";
import { isTokenValid } from "../utils/session";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "../style/pageNotFound.css";

const PageNotFound = () => {
  useDocumentTitle("Page not found");
  const navigate = useNavigate();
  const { token } = useSelector(selectAuth);
  const loggedIn = isTokenValid(token);

  return (
    <div className="container pnf">
      <img src={notfound} alt="" className="pnf-img" width="160" height="160" />
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <div className="pnf-actions">
        {window.history.length > 1 && (
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft aria-hidden="true" /> Go back
          </button>
        )}
        <Link to={loggedIn ? "/dashboard" : "/"} className="btn btn-primary">
          {loggedIn ? "Go to dashboard" : "Go home"}
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
