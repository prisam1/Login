import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, CloudOff, FileQuestion, Lock } from "lucide-react";
import ItineraryForm from "../components/itinerary/ItineraryForm";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import { useSaveItinerary } from "../hooks/useCreateItinerary";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { selectAuth } from "../redux/authSlice";
import { fetchItinerary } from "../Services/Itinerary/itineraryService";
import { getErrorMessage } from "../Services/errors";
import { cacheItineraries, getCachedItinerary, isOwnedBy } from "../utils/cache";
import "../style/itineraryForm.css";

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

const initialFor = (id, state) => {
  if (!OBJECT_ID_RE.test(id || "")) return null;
  if (state?.itinerary?._id === id) return state.itinerary;
  return getCachedItinerary(id);
};

const UpdateIt = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useSelector(selectAuth);
  const { save, loading: saving, error: saveError } = useSaveItinerary();

  const [itinerary, setItinerary] = useState(() => initialFor(id, location.state));
  const [status, setStatus] = useState(() => (!OBJECT_ID_RE.test(id || "") ? "notfound" : itinerary ? "ready" : "loading"));
  const [loadError, setLoadError] = useState(null);

  useDocumentTitle(itinerary ? `Edit ${itinerary.name || "itinerary"}` : "Edit itinerary");

  const load = useCallback(
    async (signal) => {
      setStatus("loading");
      try {
        const data = await fetchItinerary(id, signal);
        if (signal?.aborted) return;
        if (!data?._id) {
          setStatus("notfound");
          return;
        }
        cacheItineraries([data]);
        setItinerary(data);
        setStatus("ready");
      } catch (err) {
        if (signal?.aborted) return;
        const code = err?.response?.status;
        if (code === 404 || code === 400) setStatus("notfound");
        else {
          setLoadError(getErrorMessage(err, "Failed to load this itinerary."));
          setStatus("error");
        }
      }
    },
    [id]
  );

  useEffect(() => {
    const fresh = initialFor(id, location.state);
    if (fresh) {
      setItinerary(fresh);
      setStatus("ready");
      return;
    }
    if (!OBJECT_ID_RE.test(id || "")) {
      setStatus("notfound");
      return;
    }
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [id, location.state, load]);

  const back = (
    <Link to="/dashboard" className="back-link">
      <ArrowLeft aria-hidden="true" /> Back to dashboard
    </Link>
  );

  const message = (icon, title, description, action, tone) => (
    <div className="container page">
      {back}
      <div className="card">
        <EmptyState icon={icon} title={title} description={description} tone={tone} action={action} />
      </div>
    </div>
  );

  const dashboardButton = (
    <Link to="/dashboard" className="btn btn-primary">
      Go to dashboard
    </Link>
  );

  if (status === "loading") return <PageLoader label="Loading itinerary…" />;
  if (status === "notfound") {
    return message(
      <FileQuestion />,
      "Itinerary not found",
      "This itinerary doesn't exist or may have been deleted. Check the link or open it from your dashboard.",
      dashboardButton
    );
  }
  if (status === "error") {
    return message(
      <CloudOff />,
      "Couldn't load this itinerary",
      loadError,
      <button type="button" className="btn btn-primary" onClick={() => load()}>
        Try again
      </button>,
      "error"
    );
  }
  if (!isOwnedBy(itinerary, userId)) {
    return message(<Lock />, "You can't edit this itinerary", "Only the person who created an itinerary can edit it.", dashboardButton);
  }

  const handleSubmit = async (payload, allowNavigation) => {
    const saved = await save(payload, itinerary._id);
    if (!saved) return;
    toast.success("Changes saved!");
    allowNavigation();
    navigate("/dashboard", { state: { highlight: itinerary._id } });
  };

  return (
    <div className="container page">
      {back}
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit itinerary</h1>
          <p className="page-subtitle">Update the details of “{itinerary.name || "this trip"}”.</p>
        </div>
      </div>
      <ItineraryForm
        mode="edit"
        initial={itinerary}
        legacyDuration={itinerary.duration}
        saving={saving}
        serverError={saveError}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default UpdateIt;
