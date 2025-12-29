import { FC, useState, useEffect } from "react";
import Invoice from "../components/invoices/Invoice";
import { getMyInvoices } from "../hooks-apiCalls/getMyInvoices";
import { InvoiceInterface } from "@/interfaces/InvoiceInterface";
import InvoiceModal from "../components/invoices/InvoiceModal";
import { Button } from "../components/ui/button";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const InvoicesPage: FC = () => {
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { invoices, loading, pagination } = getMyInvoices(currentPage, 10);

  useEffect(() => {
    const totalPages = pagination?.totalPages ?? 1;
    setCurrentPage((prev) => clamp(prev, 1, totalPages));
  }, [pagination?.totalPages]);

  const goToPage = (page: number) => {
    const totalPages = pagination?.totalPages ?? 1;
    setCurrentPage(clamp(page, 1, totalPages));
  };

  const handlePreview = (invoice: InvoiceInterface) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="col-span-10 py-5 px-10 h-screen font-NunitoSans">
      <h1 className="text-2xl font-semibold">Invoices</h1>
      <div className="relative flex flex-col justify-center mt-5 gap-6">
        {invoices.length === 0 && (
          <div className="flex items-center justify-center min-h-[200px] text-gray-500">
            No invoices found
          </div>
        )}
        <div className=" relative flex flex-col justify-center mt-5 gap-6">
          {invoices &&
            invoices.map((invoice) => (
              <Invoice
                key={invoice.id}
                id={invoice.id}
                stripe_invoice_id={invoice.stripe_invoice_id}
                stripe_customer_id={invoice.stripe_customer_id}
                status={invoice.status}
                amount_due={invoice.amount_due}
                currency={invoice.currency}
                order={invoice.order}
                onPreview={handlePreview.bind(null, invoice)}
              />
            ))}
        </div>
      </div>
      {isModalOpen && selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={closeModal} />
      )}

      {invoices.length > 0 && (
        <div className="mt-10 py-10 border-t">
          <p className="text-center">Showing {invoices.length} invoices</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="bg-gray-300 px-4 py-2 rounded-l text-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            <div className="px-4 py-2 rounded-l font-semibold">
              Page {currentPage} of {pagination.totalPages}
            </div>

            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages || loading}
              className="bg-gray-300 px-4 py-2 rounded-l text-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
