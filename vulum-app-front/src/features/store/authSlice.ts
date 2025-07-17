import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

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

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch {
    return false;
  }
}

const token = localStorage.getItem("token");
const valid = isTokenValid(token);

const initialState: AuthState = {
  user: null,
  token: valid ? token : null,
  isAuthenticated: valid,
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
