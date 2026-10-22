import React from "react";
import { CircleAlert } from "lucide-react";

const Field = ({ id, label, optional, error, hint, counter, children }) => (
  <div className="field">
    {label && (
      <label htmlFor={id} className="field-label">
        <span>
          {label} {optional && <span className="optional">(optional)</span>}
        </span>
      </label>
    )}
    {children}
    {(error || hint || counter) && (
      <div className="field-row">
        {error ? (
          <p id={`${id}-error`} className="field-error" role="alert">
            <CircleAlert aria-hidden="true" />
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="field-hint">
            {hint}
          </p>
        ) : (
          <span />
        )}
        {counter}
      </div>
    )}
  </div>
);

export const Counter = ({ value, max }) => {
  const length = (value || "").length;
  return (
    <span className={`counter ${length >= max ? "is-limit" : ""}`} aria-hidden="true">
      {length}/{max}
    </span>
  );
};

export const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export default Field;
