import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { configureApi } from "./Services/api";
import { endSession } from "./components/common/SessionWatcher";
import PageLoader from "./components/common/PageLoader";
import router from "./router";

configureApi({
  tokenGetter: () => store.getState().auth?.token,
  unauthorizedHandler: () => endSession(store.dispatch, "expired"),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
