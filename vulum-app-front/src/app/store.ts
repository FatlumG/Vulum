import { configureStore } from "@reduxjs/toolkit";
import toggleState from "../features/toggle/toggleSlice";
import authSlice from "../features/store/authSlice";

const store = configureStore({
  reducer: {
    signToggle: toggleState,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
