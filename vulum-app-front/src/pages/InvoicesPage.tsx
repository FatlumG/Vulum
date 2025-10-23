import { FC } from "react";
import Invoice from "../components/invoices/Invoice";

const InvoicesPage: FC = () => {
  return (
    <div className="col-span-10 py-5 px-10 font-NunitoSans">
      <h1 className="text-2xl font-semibold">Invoices</h1>
      <Invoice />
      <Invoice />
      <Invoice />
    </div>
  );
};

export default InvoicesPage;
