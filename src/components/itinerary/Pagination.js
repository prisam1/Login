import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageItems = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("start-gap");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("end-gap");
  items.push(total);
  return items;
};

const Pagination = ({ page, totalPages, onChange, disabled }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={disabled || page <= 1} aria-label="Previous page">
        <ChevronLeft aria-hidden="true" />
        <span className="pagination-label">Prev</span>
      </button>
      {pageItems(page, totalPages).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            disabled={disabled}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="pagination-ellipsis" aria-hidden="true">
            …
          </span>
        )
      )}
      <button type="button" onClick={() => onChange(page + 1)} disabled={disabled || page >= totalPages} aria-label="Next page">
        <span className="pagination-label">Next</span>
        <ChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
