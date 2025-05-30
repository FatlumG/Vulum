import { createSlice } from "@reduxjs/toolkit";

interface ToggleState {
  onSignIn: boolean;
}

const initialState: ToggleState = {
  onSignIn: false,
};

const toggleSlice = createSlice({
  name: "signToggle",
  initialState,
  reducers: {
    toggleState: (state) => {
      state.onSignIn = !state.onSignIn;
    },
  },
});

export const { toggleState } = toggleSlice.actions;
export default toggleSlice.reducer;
