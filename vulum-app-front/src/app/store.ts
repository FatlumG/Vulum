import { configureStore } from "@reduxjs/toolkit";
import toggleState from "../features/toggle/toggleSlice";
import authSlice from "../features/store/authSlice";
import productSlice from "../features/products/productSlice";
import loadingSlice from "../features/products/productSlice";
import favoriteSlice from "../features/products/favoriteSlice";

const store = configureStore({
  reducer: {
    signToggle: toggleState,
    auth: authSlice,
    loading: loadingSlice,
    products: productSlice,
    favorites: favoriteSlice, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
