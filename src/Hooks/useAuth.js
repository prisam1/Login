import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import api from "../Services/api";

const useAuth = () => {
  const dispatch = useDispatch();

  const loginUser = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { token, name } = res.data.data;
  
    dispatch(login({ token, user: name }));

    localStorage.setItem("token", token); 

    return token;
  };

  return { loginUser };
};

export default useAuth;
