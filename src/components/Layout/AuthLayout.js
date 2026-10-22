import React from "react";
import { CalendarCheck, Hotel, Route, Wallet } from "lucide-react";
import "../../style/auth.css";

const points = [
  { icon: Route, text: "Map every route from start to destination" },
  { icon: CalendarCheck, text: "Know what's coming up and what's done" },
  { icon: Hotel, text: "Keep stays and locations in one place" },
  { icon: Wallet, text: "Track the total cost of every trip" },
];

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="auth-page">
    <aside className="auth-aside" aria-hidden="true">
      <div className="auth-aside-content">
        <h2>Your trips, beautifully organised.</h2>
        <p>Plan itineraries, keep track of dates, stays and budgets — all in one simple dashboard.</p>
        <ul className="auth-points">
          {points.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
    <div className="auth-main">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
        {footer && <p className="auth-switch">{footer}</p>}
      </div>
    </div>
  </div>
);

export default AuthLayout;
