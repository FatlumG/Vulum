import { FC, useState } from "react";
import Invoice from "../components/invoices/Invoice";
import { getMyInvoices } from "../hooks-apiCalls/getMyInvoices";
import { InvoiceInterface } from "@/interfaces/InvoiceInterface";
import InvoiceModal from "../components/invoices/InvoiceModal";

const InvoicesPage: FC = () => {
  const invoices = getMyInvoices();

  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreview = (invoice: InvoiceInterface) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="col-span-10 py-5 px-10 font-NunitoSans">
      <h1 className="text-2xl font-semibold">Invoices</h1>
      {invoices.map((invoice) => (
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

      {/* debug why when users click preview is not working */}
      {isModalOpen && selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={closeModal} />
      )}
    </div>
  );
};

export default InvoicesPage;
