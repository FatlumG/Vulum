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
    updateProdStatus: (state, action) => {
      console.log("Reducer called with:", action.payload);
      const product = state.find((p) => p.id === action.payload.id);
      if (product) {
        // self-ignored
        product.Status = action.payload.status;
        console.log(
          `Updated product ${product.id} status to ${product.Status}`
        );
      }
    },
  },
});

export const { setProducts, addProduct, updateProdStatus } =
  productsSlice.actions;
export default productsSlice.reducer;
