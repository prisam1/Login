import { createSlice } from "@reduxjs/toolkit";
import { decodeToken } from "../utils/session";

const initialState = {
  user: null,
  userId: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, user, userId } = action.payload || {};
      const payload = decodeToken(token);
      state.token = token || null;
      state.user = user || payload?.name || null;
      state.userId = userId || payload?.userId || null;
    },
    logout() {
      return initialState;
    },
  },
});

export const selectAuth = (state) => {
  const { token, user, userId } = state.auth || {};
  if (!token) return { token: null, user: null, userId: null };
  const payload = decodeToken(token);
  return { token, user: user || payload?.name || null, userId: userId || payload?.userId || null };
};

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
