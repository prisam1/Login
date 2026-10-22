import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, selectAuth } from "../../redux/authSlice";
import { store } from "../../redux/store";
import { clearItineraryCache } from "../../utils/cache";
import { isTokenValid, tokenExpiry } from "../../utils/session";

const MAX_TIMEOUT = 2147483647;

export const endSession = (dispatch, reason) => {
  if (!store.getState().auth?.token) return;
  dispatch(logout());
  clearItineraryCache();
  try {
    localStorage.removeItem("token");
  } catch {
    /* storage unavailable */
  }
  if (reason === "expired") {
    toast.warn("Your session has expired. Please log in again.", { toastId: "session-expired" });
  }
};

const SessionWatcher = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(selectAuth);

  useEffect(() => {
    if (!token) return;
    if (!isTokenValid(token)) {
      endSession(dispatch, "expired");
      return;
    }
    const expiry = tokenExpiry(token);
    if (!expiry) return;
    const timer = setTimeout(() => endSession(dispatch, "expired"), Math.min(expiry - Date.now(), MAX_TIMEOUT));
    return () => clearTimeout(timer);
  }, [token, dispatch]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== "persist:root") return;
      let otherToken = null;
      try {
        const root = JSON.parse(e.newValue || "{}");
        otherToken = JSON.parse(root.auth || "{}").token || null;
      } catch {
        otherToken = null;
      }
      if (!otherToken && store.getState().auth?.token) {
        dispatch(logout());
        toast.info("You were logged out in another tab.", { toastId: "logged-out-elsewhere" });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  return null;
};

export default SessionWatcher;
