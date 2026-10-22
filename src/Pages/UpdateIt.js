import React, { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, FileQuestion, Lock } from "lucide-react";
import ItineraryForm from "../components/itinerary/ItineraryForm";
import EmptyState from "../components/common/EmptyState";
import { useSaveItinerary } from "../hooks/useCreateItinerary";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { selectAuth } from "../redux/authSlice";
import { getCachedItinerary, isOwnedBy } from "../utils/cache";
import "../style/itineraryForm.css";

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

const UpdateIt = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useSelector(selectAuth);
  const { save, loading, error } = useSaveItinerary();

  const itinerary = useMemo(() => {
    if (!OBJECT_ID_RE.test(id || "")) return null;
    const fromState = location.state?.itinerary;
    if (fromState?._id === id) return fromState;
    return getCachedItinerary(id);
  }, [id, location.state]);

  useDocumentTitle(itinerary ? `Edit ${itinerary.name || "itinerary"}` : "Edit itinerary");

  const back = (
    <Link to="/dashboard" className="back-link">
      <ArrowLeft aria-hidden="true" /> Back to dashboard
    </Link>
  );

  if (!itinerary) {
    return (
      <div className="container page">
        {back}
        <div className="card">
          <EmptyState
            icon={<FileQuestion />}
            title="Itinerary not found"
            description="We couldn't find this itinerary. It may have been removed, or the link is incorrect. Open it again from your dashboard."
            action={
              <Link to="/dashboard" className="btn btn-primary">
                Go to dashboard
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (!isOwnedBy(itinerary, userId)) {
    return (
      <div className="container page">
        {back}
        <div className="card">
          <EmptyState
            icon={<Lock />}
            title="You can't edit this itinerary"
            description="Only the person who created an itinerary can edit it."
            action={
              <Link to="/dashboard" className="btn btn-primary">
                Go to dashboard
              </Link>
            }
          />
        </div>
      </div>
    );
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
        saving={loading}
        serverError={error}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default UpdateIt;
