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
    <div className="py-6 page-enter">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">
        Invoices
      </h1>

      <div className="flex flex-col gap-4">
        {invoices.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No invoices</h3>
            <p className="text-sm text-muted-foreground">
              Your invoices will appear here.
            </p>
          </div>
        )}

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

      {isModalOpen && selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={closeModal} />
      )}

      {invoices.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Showing {invoices.length} invoices
          </p>
          <div className="flex justify-center items-center gap-3">
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-foreground px-4">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages || loading}
              variant="outline"
              size="sm"
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
