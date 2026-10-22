import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import SessionWatcher from "./components/common/SessionWatcher";
import OfflineBanner from "./components/common/OfflineBanner";
import { useTheme } from "./hooks/useTheme";

function App() {
  const themeState = useTheme();

  return (
    <div className="layout-container">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SessionWatcher />
      <Header {...themeState} />
      <main id="main" className="layout-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <OfflineBanner />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        limit={4}
        theme={themeState.theme === "dark" ? "dark" : "light"}
      />
      <ScrollRestoration />
    </div>
  );
}

export default App;
