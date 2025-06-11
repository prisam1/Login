import { useDispatch } from "react-redux";
import { login as loginAction } from "../redux/authSlice";
import { login, register } from "../Services/auth/authServices";
import { useNavigate } from "react-router-dom";
//import { toast } from "sonner";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);

      const { token, name } = res.data.data;

      dispatch(loginAction({ token, user: name }));

      localStorage.setItem("token", token);

      return token;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      // toast.error(
      //   err.response?.data?.error ||
      //     "An unexpected error occurred. Please try again"
      // );
    } finally {
      setLoading(false);
    }
  };
  return { loginUser, loading, error };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (name, email, phone, password) => {
    setLoading(true);
    setError(null);

    try {
      await register(name, email, phone, password);
      // toast.success("Please login to continue");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An unexpected error occurred. Please try again"
      );
      // toast.error(
      //   err.response?.data?.error ||
      //     "An unexpected error occurred. Please try again"
      // );
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};
