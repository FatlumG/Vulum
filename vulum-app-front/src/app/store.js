import { configureStore } from "@reduxjs/toolkit";
import toggleState from "../features/toggle/toggleSlice";

const store = configureStore({
  reducer: {
    signToggle: toggleState,
  },
});

export default store;
