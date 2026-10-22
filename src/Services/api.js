import axios from "axios";

const API = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "https://cust-rks8.onrender.com/api").replace(/\/+$/, ""),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let getToken = () => null;
let onUnauthorized = () => {};

export const configureApi = ({ tokenGetter, unauthorizedHandler }) => {
  getToken = tokenGetter;
  onUnauthorized = unauthorizedHandler;
};

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !/\/auth\//i.test(url)) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default API;
