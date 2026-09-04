import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserUpdateInterface } from "../../interfaces/UserUpdateInterface";

const initialState: UserUpdateInterface = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  bio: "",
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