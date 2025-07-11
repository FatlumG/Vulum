import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductInterface } from "../../interfaces/ProductInterface";

interface FavoriteState {
  favoriteItems: ProductInterface[];
  favoriteIds: number[];
}

const initialState: FavoriteState = {
  favoriteItems: [],
  favoriteIds: [],
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<ProductInterface[]>) => {
      state.favoriteItems = action.payload; // update property, don't return
    },
    setFavoriteIds: (state, action: PayloadAction<number[]>) => {
      state.favoriteIds = action.payload;
    },

    // Add a favorite ID (only if not exists)
    addFavorite: (state, action: PayloadAction<number>) => {
      if (!state.favoriteIds.includes(action.payload)) {
        state.favoriteIds.push(action.payload); // push to favoriteIds array
      }
    },

    // Remove a favorite ID
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favoriteIds = state.favoriteIds.filter(
        (id: number) => id !== action.payload
      );
    },
  },
});

export const { setFavorites, setFavoriteIds, addFavorite, removeFavorite } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
