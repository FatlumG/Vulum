import { configureStore } from "@reduxjs/toolkit";
import toggleState from "../features/toggle/toggleSlice";
import authSlice from "../features/store/authSlice";
import productSlice from "../features/products/productSlice";
import loadingSlice from "../features/loading/loadingSlice";
import favoriteSlice from "../features/products/favoriteSlice";
import userSlice from "../features/user/userSlice";

const store = configureStore({
  reducer: {
    signToggle: toggleState,
    auth: authSlice,
    loading: loadingSlice,
    products: productSlice,
    favorites: favoriteSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
