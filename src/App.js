import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Pagenotfound from "./Pages/PageNotFound";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import Dashboard from "./Pages/Dashboard";
import CreateIt from "./Pages/CreateIt";
import ProtectedRoute from "./routes/ProtectedRoute";

import "../src/App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} /> 
         <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> 
        <Route
          path="/Create"
          element={
            <ProtectedRoute>
              <CreateIt />
            </ProtectedRoute>
          }
        /> 
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

 