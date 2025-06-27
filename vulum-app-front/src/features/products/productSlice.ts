import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductInterface } from "@/interfaces/ProductInterface";

const productsSlice = createSlice({
  name: "products",
  initialState: [] as ProductInterface[],
  reducers: {
    setProducts: (state, action: PayloadAction<ProductInterface[]>) => {
      return action.payload;
    },
    addProduct: (state, action: PayloadAction<ProductInterface>) => {
      state.push(action.payload);
    },
  },
});

export const { setProducts, addProduct } = productsSlice.actions;
export default productsSlice.reducer;
