import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

const RouteError = () => {
  const error = useRouteError();
  if (process.env.NODE_ENV !== "production") console.error(error);

  return (
    <div className="container page">
      <div className="card">
        <div className="empty-state" role="alert">
          <div className="empty-state-icon is-error">
            <TriangleAlert />
          </div>
          <h3>Something went wrong</h3>
          <p>An unexpected error occurred while showing this page. Reloading usually fixes it.</p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <Link to="/" className="btn btn-secondary" reloadDocument>
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteError;
