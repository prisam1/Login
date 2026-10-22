import api from "../api";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const register = async (name, email, phone, password) => {
  const { data } = await api.post("/auth/Register", {
    name,
    email,
    phone,
    password,
  });
  return data;
};
