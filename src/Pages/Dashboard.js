import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CloudOff, Compass, Eye, LayoutGrid, List, LoaderCircle, Pencil, Plus, RefreshCw, Search, SearchX, Trash2, X } from "lucide-react";
import { useItineraries } from "../hooks/useItineraries";
import { useDebounce } from "../hooks/useDebounce";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { selectAuth } from "../redux/authSlice";
import ItineraryCard, { StatusBadge } from "../components/itinerary/ItineraryCard";
import ItineraryDetails from "../components/itinerary/ItineraryDetails";
import Pagination from "../components/itinerary/Pagination";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useDeleteItinerary } from "../hooks/useCreateItinerary";
import { isOwnedBy } from "../utils/cache";
import { display, firstName, formatCurrency, formatDate, formatDuration } from "../utils/format";
import "../style/dashboard.css";

const SORTS = [
  { value: "date:asc", label: "Soonest" },
  { value: "date:desc", label: "Latest" },
  { value: "createdAt:desc", label: "Newest" },
  { value: "name:asc", label: "Name A–Z" },
  { value: "totalcost:desc", label: "Highest cost" },
  { value: "totalcost:asc", label: "Lowest cost" },
];
const DEFAULT_SORT = "date:asc";
const PAGE_SIZES = [6, 12, 24, 48];
const DEFAULT_LIMIT = 12;

const readInt = (value, fallback, { min = 1, max = Infinity, allowed } = {}) => {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < min || n > max) return fallback;
  if (allowed && !allowed.includes(n)) return fallback;
  return n;
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const SkeletonGrid = ({ count }) => (
  <div className="trip-grid" aria-hidden="true">
    {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
      <div key={i} className="card trip-card-skeleton">
        <div className="skeleton" style={{ height: 20, width: 80 }} />
        <div className="skeleton" style={{ height: 22, width: "70%" }} />
        <div className="skeleton" style={{ height: 40 }} />
        <div className="skeleton" style={{ height: 40 }} />
        <div className="skeleton" style={{ height: 28, width: "45%" }} />
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  useDocumentTitle("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userId } = useSelector(selectAuth);
  const [params, setParams] = useSearchParams();

  const page = readInt(params.get("page"), 1);
  const limit = readInt(params.get("limit"), DEFAULT_LIMIT, { allowed: PAGE_SIZES });
  const sort = SORTS.some((s) => s.value === params.get("sort")) ? params.get("sort") : DEFAULT_SORT;
  const [sortBy, order] = sort.split(":");
  const view = params.get("view") === "table" ? "table" : "grid";
  const urlQuery = (params.get("q") || "").slice(0, 80);

  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(query.trim(), 400);
  const [selected, setSelected] = useState(null);
  const [highlight, setHighlight] = useState(location.state?.highlight || null);

  const updateParams = useCallback(
    (changes, { resetPage = true } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(changes).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") next.delete(key);
            else next.set(key, String(value));
          });
          if (resetPage && !("page" in changes)) next.delete("page");
          if (next.get("page") === "1") next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const syncedQuery = useRef(urlQuery);

  useEffect(() => {
    if (urlQuery !== syncedQuery.current) {
      syncedQuery.current = urlQuery;
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    if (debouncedQuery !== syncedQuery.current.trim()) {
      syncedQuery.current = debouncedQuery;
      updateParams({ q: debouncedQuery });
    }
  }, [debouncedQuery, updateParams]);

  useEffect(() => {
    if (!highlight) return;
    window.history.replaceState({ ...window.history.state, usr: undefined }, "");
    const t = setTimeout(() => setHighlight(null), 4000);
    return () => clearTimeout(t);
  }, [highlight]);

  const search = urlQuery.trim();
  const { data, totalPages, total, loading, refreshing, error, lastLoaded, reload } = useItineraries({ page, limit, search, sortBy, order });
  const { remove, deletingId } = useDeleteItinerary();
  const [pendingDelete, setPendingDelete] = useState(null);

  const confirmDelete = async () => {
    const target = pendingDelete;
    setPendingDelete(null);
    if (!target) return;
    const result = await remove(target);
    if (result.ok) {
      toast.success(`“${display(target.name)}” deleted.`);
      if (selected?._id === target._id) setSelected(null);
      reload();
    } else {
      toast.error(result.message);
    }
  };

  useEffect(() => {
    if (!loading && !error && totalPages > 0 && page > totalPages) updateParams({ page: totalPages }, { resetPage: false });
  }, [loading, error, page, totalPages, updateParams]);

  const items = useMemo(() => data.map((it) => ({ it, mine: isOwnedBy(it, userId) })), [data, userId]);
  const hasSearch = !!urlQuery.trim();

  const goToPage = (p) => {
    updateParams({ page: p }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (it) => navigate(`/itinerary/${it._id}/edit`, { state: { itinerary: it } });
  const duplicate = (it) => navigate("/create", { state: { template: it } });

  const clearSearch = () => {
    setQuery("");
    syncedQuery.current = "";
    updateParams({ q: "" });
  };

  let content;
  if (loading) {
    content = <SkeletonGrid count={limit} />;
  } else if (error && !data.length) {
    content = (
      <div className="card">
        <EmptyState
          tone="error"
          icon={<CloudOff />}
          title="Couldn't load your itineraries"
          description={error}
          action={
            <button type="button" className="btn btn-primary" onClick={reload} disabled={refreshing}>
              <RefreshCw className={refreshing ? "spin" : ""} aria-hidden="true" /> Try again
            </button>
          }
        />
      </div>
    );
  } else if (!data.length && hasSearch) {
    content = (
      <div className="card">
        <EmptyState
          icon={<SearchX />}
          title="No matching itineraries"
          description={`Nothing matches “${urlQuery.trim()}”. Try a different trip name or location.`}
          action={
            <button type="button" className="btn btn-secondary" onClick={clearSearch}>
              Clear search
            </button>
          }
        />
      </div>
    );
  } else if (!data.length) {
    content = (
      <div className="card">
        <EmptyState
          icon={<Compass />}
          title="No itineraries yet"
          description="Plan your first trip — add the route, dates, stay and budget in one place."
          action={
            <Link to="/create" className="btn btn-primary">
              <Plus aria-hidden="true" /> Create your first itinerary
            </Link>
          }
        />
      </div>
    );
  } else if (view === "table") {
    content = (
      <div className={`card trip-table-wrap ${refreshing ? "is-refreshing" : ""}`}>
        <table className="trip-table">
          <caption className="sr-only">Itineraries</caption>
          <thead>
            <tr>
              <th scope="col">Trip</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Date</th>
              <th scope="col">Duration</th>
              <th scope="col">Hotel</th>
              <th scope="col" className="cell-num">
                Total
              </th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ it, mine }, i) => (
              <tr key={it._id || i} className={highlight && it._id === highlight ? "is-highlighted" : ""}>
                <td className="cell-strong" title={display(it.name)}>
                  {display(it.name)}
                </td>
                <td title={display(it.from)}>{display(it.from)}</td>
                <td title={display(it.to)}>{display(it.to)}</td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", alignItems: "flex-start" }}>
                    {formatDate(it.date)}
                    <StatusBadge date={it.date} />
                  </div>
                </td>
                <td>{formatDuration(it.duration)}</td>
                <td title={display(it.hotelName)}>{display(it.hotelName)}</td>
                <td className="cell-num">{formatCurrency(it.totalcost)}</td>
                <td className="cell-actions">
                  <div>
                    <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelected(it)} aria-label={`View ${display(it.name)}`}>
                      <Eye />
                    </button>
                    {mine && (
                      <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(it)} aria-label={`Edit ${display(it.name)}`}>
                        <Pencil />
                      </button>
                    )}
                    {mine && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm btn-ghost-danger"
                        onClick={() => setPendingDelete(it)}
                        disabled={deletingId === it._id}
                        aria-label={`Delete ${display(it.name)}`}
                      >
                        {deletingId === it._id ? <LoaderCircle className="spin" /> : <Trash2 />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    content = (
      <div className={`trip-grid ${refreshing ? "is-refreshing" : ""}`}>
        {items.map(({ it, mine }, i) => (
          <ItineraryCard
            key={it._id || i}
            itinerary={it}
            isMine={mine}
            highlight={highlight && it._id === highlight}
            onView={() => setSelected(it)}
            onEdit={() => openEdit(it)}
            onDelete={() => setPendingDelete(it)}
            deleting={deletingId === it._id}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="dash-hero">
        <div>
          <p className="eyebrow">{greeting()}</p>
          <h1 className="page-title">Welcome, {firstName(user)}</h1>
          <p className="page-subtitle">
            {total === null || loading
              ? "Plan, search and manage your trips."
              : total === 0
              ? "You haven't planned any trips yet."
              : `You have ${total} ${total === 1 ? "itinerary" : "itineraries"}.`}
          </p>
        </div>
        <div className="dash-hero-actions">
          {lastLoaded && (
            <span className="last-updated" aria-live="polite">
              Updated {lastLoaded.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button type="button" className="btn btn-secondary" onClick={reload} disabled={loading || refreshing} aria-label="Refresh itineraries">
            <RefreshCw className={refreshing ? "spin" : ""} aria-hidden="true" />
            <span>Refresh</span>
          </button>
          <Link to="/create" className="btn btn-primary">
            <Plus aria-hidden="true" /> New itinerary
          </Link>
        </div>
      </div>

      <div className="card toolbar" role="search">
        <div className="toolbar-search">
          <Search className="input-icon" aria-hidden="true" />
          <label htmlFor="search" className="sr-only">
            Search itineraries
          </label>
          <input
            id="search"
            type="search"
            className="input"
            placeholder="Search trips, places or hotels"
            value={query}
            maxLength={80}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                clearSearch();
              }
            }}
          />
          {query && (
            <button type="button" className="input-action" onClick={clearSearch} aria-label="Clear search">
              <X />
            </button>
          )}
        </div>
        <div className="toolbar-controls">
          <label className="sr-only" htmlFor="sort">
            Sort by
          </label>
          <select id="sort" className="input" value={sort} onChange={(e) => updateParams({ sort: e.target.value === DEFAULT_SORT ? "" : e.target.value })}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="limit">
            Items per page
          </label>
          <select id="limit" className="input" value={limit} onChange={(e) => updateParams({ limit: Number(e.target.value) === DEFAULT_LIMIT ? "" : e.target.value })}>
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
          <div className="view-toggle" role="group" aria-label="Layout">
            <button type="button" aria-pressed={view === "grid"} onClick={() => updateParams({ view: "" }, { resetPage: false })} aria-label="Grid view" title="Grid view">
              <LayoutGrid />
            </button>
            <button type="button" aria-pressed={view === "table"} onClick={() => updateParams({ view: "table" }, { resetPage: false })} aria-label="Table view" title="Table view">
              <List />
            </button>
          </div>
        </div>
      </div>

      {!loading && data.length > 0 && (
        <div className="results-meta" aria-live="polite">
          <span>
            {hasSearch ? (
              <>
                {total !== null && (
                  <>
                    <strong>{total}</strong> {total === 1 ? "result" : "results"}{" "}
                  </>
                )}
                for <strong>“{urlQuery.trim()}”</strong> ·{" "}
              </>
            ) : null}
            Page <strong>{Math.min(page, Math.max(totalPages, 1))}</strong> of <strong>{Math.max(totalPages, 1)}</strong>
          </span>
          {hasSearch && (
            <button type="button" className="link-button" onClick={clearSearch}>
              <X aria-hidden="true" /> Clear search
            </button>
          )}
        </div>
      )}

      {error && data.length > 0 && (
        <div className="alert alert-warning" role="alert" style={{ marginBottom: "1rem" }}>
          <CloudOff aria-hidden="true" />
          <span>
            {error} Showing the last loaded results.{" "}
            <button type="button" className="link-button" onClick={reload}>
              Retry
            </button>
          </span>
        </div>
      )}

      {content}

      {!loading && data.length > 0 && <Pagination page={page} totalPages={totalPages} onChange={goToPage} disabled={refreshing} />}

      <ItineraryDetails
        itinerary={selected}
        isMine={selected ? isOwnedBy(selected, userId) : false}
        onClose={() => setSelected(null)}
        onEdit={() => openEdit(selected)}
        onDuplicate={() => duplicate(selected)}
        onDelete={() => setPendingDelete(selected)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this itinerary?"
        description={`“${display(pendingDelete?.name)}” will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default Dashboard;
