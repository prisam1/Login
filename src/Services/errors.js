import axios from "axios";

export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (axios.isCancel(error)) return null;
  if (!axios.isAxiosError(error)) return error?.message || fallback;

  if (error.code === "ECONNABORTED") {
    return "The server is taking too long to respond. It may be waking up — please try again in a moment.";
  }
  if (!error.response) {
    return navigator.onLine
      ? "Can't reach the server right now. Please try again shortly."
      : "You're offline. Check your internet connection and try again.";
  }

  const { status, data } = error.response;
  const raw = [data?.message, data?.msg, data?.error, data?.Message].find((m) => typeof m === "string" && m.trim());

  if (raw && /E11000|duplicate key/i.test(raw)) {
    return /email/i.test(raw) ? "An account with this email already exists." : "This record already exists.";
  }
  if (raw && /Cast to|ValidationError|ObjectId|Cannot read|undefined|TypeError/i.test(raw)) {
    return fallback;
  }
  if (raw) return raw;
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status >= 500) return "The server ran into a problem. Please try again later.";
  return fallback;
};

export const isDuplicateEmailError = (error) => {
  const data = error?.response?.data;
  const raw = [data?.message, data?.msg, data?.error].find((m) => typeof m === "string") || "";
  return /E11000|duplicate key/i.test(raw) && /email/i.test(raw);
};
