import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvoiceInterface } from "../../interfaces/InvoiceInterface";

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: [] as InvoiceInterface[],
  reducers: {
    setInvoices: (state, action: PayloadAction<InvoiceInterface[]>) => {
      return action.payload;
    },
    addInvoice: (state, action: PayloadAction<InvoiceInterface>) => {
      state.push(action.payload);
    },
    updateInvoiceStatus: (
      state,
      action: PayloadAction<{ id: number; status: string }>
    ) => {
      const invoice = state.find((inv) => inv.id === action.payload.id);
      if (invoice) {
        invoice.status = action.payload.status;
      }
    },
    deleteInvoice: (state, action: PayloadAction<number>) => {
      return state.filter((inv) => inv.id !== action.payload);
    },
  },
});

export const { setInvoices, addInvoice, updateInvoiceStatus, deleteInvoice } =
  invoiceSlice.actions;
export default invoiceSlice.reducer;
