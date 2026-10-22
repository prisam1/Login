import React from "react";
import { ArrowRight, CalendarDays, Clock, Eye, Hotel, LoaderCircle, MapPin, Pencil, Trash2 } from "lucide-react";
import { display, formatCurrency, formatDate, formatDuration, tripStatus } from "../../utils/format";

export const StatusBadge = ({ date }) => {
  const status = tripStatus(date);
  if (!status) return <span className="badge badge-neutral">No date</span>;
  return <span className={`badge badge-${status.tone}`}>{status.label}</span>;
};

const ItineraryCard = ({ itinerary, isMine, onView, onEdit, onDelete, deleting, highlight, preview }) => {
  const { name, from, to, date, duration, location, hotelName, totalcost } = itinerary;
  const title = display(name) === "—" ? "Untitled trip" : display(name);

  return (
    <article className={`trip-card card ${highlight ? "is-highlighted" : ""} ${preview ? "is-preview" : ""}`}>
      <div className="trip-card-top">
        <StatusBadge date={date} />
      </div>

      <h3 className="trip-card-title" title={title}>
        {onView ? (
          <button type="button" className="trip-card-link" onClick={onView}>
            {title}
          </button>
        ) : (
          title
        )}
      </h3>

      <div className="trip-route" aria-label={`From ${display(from)} to ${display(to)}`}>
        <span className="trip-route-place" title={display(from)}>
          {display(from)}
        </span>
        <ArrowRight aria-hidden="true" />
        <span className="trip-route-place" title={display(to)}>
          {display(to)}
        </span>
      </div>

      <dl className="trip-meta">
        <div>
          <dt>
            <CalendarDays aria-hidden="true" />
            <span className="sr-only">Date</span>
          </dt>
          <dd>{formatDate(date)}</dd>
        </div>
        <div>
          <dt>
            <Clock aria-hidden="true" />
            <span className="sr-only">Duration</span>
          </dt>
          <dd>{formatDuration(duration)}</dd>
        </div>
        <div>
          <dt>
            <MapPin aria-hidden="true" />
            <span className="sr-only">Location</span>
          </dt>
          <dd title={display(location)}>{display(location)}</dd>
        </div>
        <div>
          <dt>
            <Hotel aria-hidden="true" />
            <span className="sr-only">Hotel</span>
          </dt>
          <dd title={display(hotelName)}>{display(hotelName)}</dd>
        </div>
      </dl>

      <div className="trip-card-footer">
        <div>
          <p className="trip-cost-label">Total cost</p>
          <p className="trip-cost">{formatCurrency(totalcost)}</p>
        </div>
        {!preview && (
          <div className="trip-actions">
            {onView && (
              <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={onView} aria-label={`View ${title}`} title="View details">
                <Eye />
              </button>
            )}
            {isMine && onDelete && (
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm btn-ghost-danger"
                onClick={onDelete}
                disabled={deleting}
                aria-label={`Delete ${title}`}
                title="Delete"
              >
                {deleting ? <LoaderCircle className="spin" /> : <Trash2 />}
              </button>
            )}
            {isMine && onEdit && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={onEdit} disabled={deleting} aria-label={`Edit ${title}`}>
                <Pencil /> Edit
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ItineraryCard;
