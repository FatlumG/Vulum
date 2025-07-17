import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserUpdateInterface } from "../../interfaces/UserUpdateInterface";

const initialState: UserUpdateInterface = {
  Username: "",
  FName: "",
  LName: "",
  Email: "",
  Phone: "",
  Address: "",
  Bio: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state, action: PayloadAction<UserUpdateInterface>) => {
      return { ...state, ...action.payload };
    },
  },
});


export const { getUser } = userSlice.actions;
export default userSlice.reducer;