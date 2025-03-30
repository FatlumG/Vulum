import { configureStore } from "@reduxjs/toolkit";
import toggleState from "../features/toggle/toggleSlice";

const store = configureStore({
  reducer: {
    signToggle: toggleState,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
