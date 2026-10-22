import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../redux/authSlice";
import { login, register } from "../Services/auth/authServices";
import { getErrorMessage, isDuplicateEmailError } from "../Services/errors";
import { isTokenValid } from "../utils/session";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlight = useRef(false);
  const dispatch = useDispatch();

  const loginUser = useCallback(
    async (email, password) => {
      if (inFlight.current) return false;
      inFlight.current = true;
      setLoading(true);
      setError(null);
      try {
        const res = await login(email.trim(), password);
        const { token, name, userId } = res?.data || {};
        if (!isTokenValid(token)) throw new Error("We couldn't start your session. Please try again.");
        localStorage.removeItem("token");
        dispatch(loginAction({ token, user: name, userId }));
        return true;
      } catch (err) {
        setError(getErrorMessage(err, "Login failed. Please try again."));
        return false;
      } finally {
        inFlight.current = false;
        setLoading(false);
      }
    },
    [dispatch]
  );

  return { loginUser, loading, error, clearError: () => setError(null) };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlight = useRef(false);

  const handleRegister = useCallback(async ({ name, email, phone, password }) => {
    if (inFlight.current) return { ok: false };
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      await register(name, email, phone, password);
      return { ok: true };
    } catch (err) {
      if (isDuplicateEmailError(err)) {
        return { ok: false, field: "email", message: "An account with this email already exists." };
      }
      setError(getErrorMessage(err, "Registration failed. Please try again."));
      return { ok: false };
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, []);

  return { handleRegister, loading, error, clearError: () => setError(null) };
};
