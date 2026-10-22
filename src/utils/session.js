import jwtDecode from "jwt-decode";

export const decodeToken = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenValid = (token) => {
  const payload = decodeToken(token);
  if (!payload) return false;
  return !payload.exp || payload.exp * 1000 > Date.now() + 5000;
};

export const tokenExpiry = (token) => {
  const payload = decodeToken(token);
  return payload?.exp ? payload.exp * 1000 : null;
};

export const safeRedirect = (path, fallback = "/dashboard") =>
  typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? path : fallback;
