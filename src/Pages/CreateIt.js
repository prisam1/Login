import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import ItineraryForm from "../components/itinerary/ItineraryForm";
import { useSaveItinerary } from "../hooks/useCreateItinerary";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { LIMITS } from "../utils/validation";
import "../style/itineraryForm.css";

const CreateIt = () => {
  useDocumentTitle("New itinerary");
  const navigate = useNavigate();
  const location = useLocation();
  const { save, loading, error } = useSaveItinerary();
  const template = location.state?.template;

  const initial = useMemo(() => {
    if (!template) return {};
    const name = `Copy of ${template.name || "trip"}`.slice(0, LIMITS.tripName);
    return { ...template, name, date: "" };
  }, [template]);

  const handleSubmit = async (payload, allowNavigation) => {
    const saved = await save(payload);
    if (!saved) return;
    toast.success(`“${payload.name}” created!`);
    allowNavigation();
    navigate("/dashboard", { state: { highlight: saved._id } });
  };

  return (
    <div className="container page">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft aria-hidden="true" /> Back to dashboard
      </Link>
      <div className="page-header">
        <div>
          <h1 className="page-title">{template ? "Duplicate itinerary" : "Create a new itinerary"}</h1>
          <p className="page-subtitle">
            {template ? "We've copied the details — just pick a new date." : "Fill in the details of your trip. All fields are required."}
          </p>
        </div>
      </div>
      <ItineraryForm
        mode="create"
        initial={initial}
        saving={loading}
        serverError={error}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default CreateIt;
