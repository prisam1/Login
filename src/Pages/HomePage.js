import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, CalendarCheck, Hotel, Route, Search, ShieldCheck, Wallet } from "lucide-react";
import { selectAuth } from "../redux/authSlice";
import { isTokenValid } from "../utils/session";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ItineraryCard from "../components/itinerary/ItineraryCard";
import "../style/home.css";
import "../style/dashboard.css";

const features = [
  { icon: Route, title: "Plan the route", text: "Record where you're starting from and where you're headed." },
  { icon: CalendarCheck, title: "Stay on schedule", text: "See which trips are coming up, happening today, or done." },
  { icon: Hotel, title: "Keep stays together", text: "Hotels and locations live right next to each trip." },
  { icon: Wallet, title: "Know the cost", text: "Track the total spend of every itinerary in rupees." },
  { icon: Search, title: "Find anything fast", text: "Search by trip name or location and sort the way you like." },
  { icon: ShieldCheck, title: "Private & secure", text: "Your session is protected and expires automatically." },
];

const toInput = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const sample = {
  name: "Goa beach getaway",
  from: "Kolkata",
  to: "Goa",
  date: toInput(12),
  duration: "4 days",
  location: "Baga Beach",
  hotelName: "Sea Breeze Resort",
  totalcost: 38500,
};

const HomePage = () => {
  useDocumentTitle("Plan your trips");
  const { token } = useSelector(selectAuth);
  const loggedIn = isTokenValid(token);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-pill">✈️ Your personal trip planner</span>
            <h1>
              Every trip, <span>perfectly planned.</span>
            </h1>
            <p>Itinerary keeps your routes, travel dates, stays and budgets in one clean dashboard — so you can focus on the journey.</p>
            <div className="hero-actions">
              {loggedIn ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    Go to dashboard <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/create" className="btn btn-secondary btn-lg">
                    New itinerary
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get started free <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">
                    I have an account
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-glow" />
            <ItineraryCard itinerary={sample} preview />
          </div>
        </div>
      </section>

      <section className="container features" aria-labelledby="features-title">
        <p className="eyebrow">Features</p>
        <h2 id="features-title">Everything you need to organise a trip</h2>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card feature-card">
              <span className="feature-icon">
                <Icon aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {!loggedIn && (
        <section className="container">
          <div className="cta-band">
            <div>
              <h2>Ready for your next adventure?</h2>
              <p>Create a free account and plan your first itinerary in under a minute.</p>
            </div>
            <Link to="/register" className="btn btn-lg cta-button">
              Create account <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;
