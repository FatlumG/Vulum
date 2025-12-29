import api from "../auth/api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setInvoices } from "../features/invoices/invoiceSlice";
import { InvoiceInterface } from "../interfaces/InvoiceInterface";

interface PaginationResponse {
  items: InvoiceInterface[];
  total: number;
  page: number;
  totalPages: number;
}

export const getMyInvoices = (page: number = 1, limit: number = 10) => {
  const [invoices, setLocalInvoices] = useState<InvoiceInterface[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchInvoices() {
      setLoading(true);
      try {
        const res = await api.get("/invoices/get-my-invoices", {
          params: { page, limit },
        });
        setLocalInvoices(res.data.items);
        setPagination({
          total: res.data.total,
          page: res.data.page,
          totalPages: res.data.totalPages,
        });
        dispatch(setInvoices(res.data.items));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [dispatch, page, limit]);

  return { invoices, loading, pagination };
};
