import React from "react";
import { ArrowRight, CalendarDays, Clock, Copy, CopyPlus, Hotel, MapPin, Pencil, Wallet } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../common/Modal";
import { StatusBadge } from "./ItineraryCard";
import { display, formatCurrency, formatDate, formatDuration, formatWeekday } from "../../utils/format";

const summaryText = (it) =>
  [
    display(it.name),
    `${display(it.from)} → ${display(it.to)}`,
    `Date: ${formatDate(it.date)}`,
    `Duration: ${formatDuration(it.duration)}`,
    `Location: ${display(it.location)}`,
    `Hotel: ${display(it.hotelName)}`,
    `Total cost: ${formatCurrency(it.totalcost)}`,
  ].join("\n");

const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      if (!ok) throw new Error("copy failed");
    }
    toast.success("Trip details copied to clipboard.");
  } catch {
    toast.error("Couldn't copy. Please copy the details manually.");
  }
};

const ItineraryDetails = ({ itinerary, isMine, onClose, onEdit, onDuplicate }) => {
  if (!itinerary) return null;
  const it = itinerary;
  const weekday = formatWeekday(it.date);
  const updated = it.updatedAt && it.updatedAt !== it.createdAt ? it.updatedAt : null;

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={display(it.name) === "—" ? "Untitled trip" : display(it.name)}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={() => copyToClipboard(summaryText(it))}>
            <Copy aria-hidden="true" /> Copy
          </button>
          <button type="button" className="btn btn-secondary" onClick={onDuplicate}>
            <CopyPlus aria-hidden="true" /> Duplicate
          </button>
          {isMine && (
            <button type="button" className="btn btn-primary" onClick={onEdit} data-autofocus>
              <Pencil aria-hidden="true" /> Edit
            </button>
          )}
        </>
      }
    >
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <StatusBadge date={it.date} />
        {isMine && <span className="badge badge-info">Yours</span>}
      </div>

      <div className="details-route">
        <div>
          <p>From</p>
          <p>{display(it.from)}</p>
        </div>
        <ArrowRight aria-hidden="true" />
        <div style={{ textAlign: "right" }}>
          <p>To</p>
          <p>{display(it.to)}</p>
        </div>
      </div>

      <dl className="details-list">
        <div>
          <dt>
            <CalendarDays aria-hidden="true" /> Date
          </dt>
          <dd>
            {formatDate(it.date)}
            {weekday && <span style={{ fontWeight: 400, color: "var(--text-muted)" }}> · {weekday}</span>}
          </dd>
        </div>
        <div>
          <dt>
            <Clock aria-hidden="true" /> Duration
          </dt>
          <dd>{formatDuration(it.duration)}</dd>
        </div>
        <div>
          <dt>
            <MapPin aria-hidden="true" /> Location
          </dt>
          <dd>{display(it.location)}</dd>
        </div>
        <div>
          <dt>
            <Hotel aria-hidden="true" /> Hotel
          </dt>
          <dd>{display(it.hotelName)}</dd>
        </div>
        <div className="span-2">
          <dt>
            <Wallet aria-hidden="true" /> Total cost
          </dt>
          <dd style={{ fontSize: "1.35rem", fontWeight: 800 }}>{formatCurrency(it.totalcost)}</dd>
        </div>
      </dl>

      {(it.createdAt || updated) && (
        <p className="details-meta">
          {it.createdAt && <>Created {formatDate(it.createdAt)}</>}
          {updated && <> · Last updated {formatDate(updated)}</>}
        </p>
      )}
    </Modal>
  );
};

export default ItineraryDetails;
