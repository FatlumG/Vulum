import api from "../auth/api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setInvoices } from "../features/invoices/invoiceSlice";
import { InvoiceInterface } from "../interfaces/InvoiceInterface";

export const getMyInvoices = () => {
  const [invoices, setLocalInvoices] = useState<InvoiceInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await api.get("/invoices/get-my-invoices");
        setLocalInvoices(res.data.items);
        dispatch(setInvoices(res.data.items));
        console.log(res.data.items);
      } catch (error) {
        console.error(error);
      }
    }
    fetchInvoices();
  }, [dispatch]);

  return invoices;
};
