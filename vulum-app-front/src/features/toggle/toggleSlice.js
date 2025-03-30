import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "signToggle",
  initialState: { onSignIn: false },
  reducers: {
    toggleState: (state) => {
      state.onSignIn = !state.onSignIn;
    },
  },
});

export const { toggleState } = toggleSlice.actions;
export default toggleSlice.reducer;
