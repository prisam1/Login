import React from "react";
import { Link } from "react-router-dom";
import { Map } from "lucide-react";
import "../../style/footer.css";

const socials = [
  { label: "Facebook", href: "https://www.facebook.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
];

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <Link to="/" className="footer-logo">
          <Map aria-hidden="true" /> Itinerary
        </Link>
        <p>Plan every trip, stay on budget.</p>
      </div>
      <nav className="footer-links" aria-label="Social media">
        {socials.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer">
            {label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </nav>
      <p className="footer-copy">© {new Date().getFullYear()} Itinerary. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
