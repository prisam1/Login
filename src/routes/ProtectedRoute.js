import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectAuth } from "../redux/authSlice";
import { isTokenValid, safeRedirect } from "../utils/session";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(selectAuth);
  const location = useLocation();

  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return children;
};

export const GuestRoute = ({ children }) => {
  const { token } = useSelector(selectAuth);
  const location = useLocation();
  return isTokenValid(token) ? <Navigate to={safeRedirect(location.state?.from)} replace /> : children;
};

export default ProtectedRoute;
