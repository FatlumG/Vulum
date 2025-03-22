import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "signToggle",
  initialState: { onSignIn: false }, // Fix the typo here
  reducers: {
    toggleState: (state) => {
      state.onSignIn = !state.onSignIn;
    },
  },
});

export const { toggleState } = toggleSlice.actions;
export default toggleSlice.reducer; // Fix the export here
