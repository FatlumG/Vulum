import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  userId: number;
  email: string;
  role_id: number;
  role: string;
  plan_id: number;
  iat: number;
  exp: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user: User }>) {
      (state.token = action.payload.token),
        (state.user = action.payload.user),
        (state.isAuthenticated = true),
        localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      (state.token = null),
        (state.user = null),
        (state.isAuthenticated = false),
        localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
