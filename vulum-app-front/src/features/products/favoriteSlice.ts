import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductInterface } from "../../interfaces/ProductInterface";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: [] as ProductInterface[],
  reducers: {
    setFavorites: (state, action: PayloadAction<ProductInterface[]>) => {
      return action.payload;
    },
    addFavorite: (state, action: PayloadAction<ProductInterface>) => {
      state.push(action.payload);
    },
  },
});

export const { setFavorites, addFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
