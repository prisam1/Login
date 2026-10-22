import React from "react";

const EmptyState = ({ icon, title, description, action, tone }) => (
  <div className="empty-state" role={tone === "error" ? "alert" : undefined}>
    <div className={`empty-state-icon ${tone === "error" ? "is-error" : ""}`}>{icon}</div>
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {action}
  </div>
);

export default EmptyState;
