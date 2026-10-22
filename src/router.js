import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Dashboard from "./Pages/Dashboard";
import CreateIt from "./Pages/CreateIt";
import UpdateIt from "./Pages/UpdateIt";
import PageNotFound from "./Pages/PageNotFound";
import ProtectedRoute, { GuestRoute } from "./routes/ProtectedRoute";
import RouteError from "./components/common/RouteError";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <RouteError />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/login", element: <GuestRoute><Login /></GuestRoute> },
          { path: "/register", element: <GuestRoute><Register /></GuestRoute> },
          { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
          { path: "/create", element: <ProtectedRoute><CreateIt /></ProtectedRoute> },
          { path: "/itinerary/:id/edit", element: <ProtectedRoute><UpdateIt /></ProtectedRoute> },
          { path: "/home", element: <Navigate to="/" replace /> },
          { path: "*", element: <PageNotFound /> },
        ],
      },
    ],
  },
]);

export default router;
