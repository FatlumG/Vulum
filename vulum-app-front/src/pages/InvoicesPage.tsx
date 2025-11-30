import { FC } from "react";
import Invoice from "../components/invoices/Invoice";
import { getMyInvoices } from "../hooks-apiCalls/getMyInvoices";

const InvoicesPage: FC = () => {
  const invoices = getMyInvoices();

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
        />
      ))}
    </div>
  );
};

export default InvoicesPage;
