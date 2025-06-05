import React, {useState} from "react"; 
import { useCreateItinerary } from "../hooks/useCreateItinerary";
import "../style/createIt.css";

const CreateIt = () => {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    from: "",
    to: "",
    date: "",
    location: "",
    hotelName: "",
    totalcost: "",
    duration: "",
  });

  const { create, loading, error} = useCreateItinerary();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create(formData);
    setFormData({
      userId: "",
      name: "",
      from: "",
      to: "",
      date: "",
      location: "",
      hotelName: "",
      totalcost: "",
      duration: "",
    });
  };
 
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="itform">
        <h4 className="title">Create Itinerary</h4>

        {[
          { name: "userId", placeholder: "UserId" },
          { name: "name", placeholder: "Name" },
          { name: "from", placeholder: "From" },
          { name: "to", placeholder: "To" },
          { name: "date", placeholder: "Date" },
          { name: "location", placeholder: "Location" },
          { name: "duration", placeholder: "Duration" },
          { name: "hotelName", placeholder: "Hotel Name" },
          { name: "totalcost", placeholder: "Total Cost" },
        ].map(({ name, placeholder }) => (
          <div className="mb-3" key={name}>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="form-control"
              placeholder={placeholder}
              required
            />
          </div>
        ))}

<button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateIt;
