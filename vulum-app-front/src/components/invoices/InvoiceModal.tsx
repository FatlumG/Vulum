import { FC } from "react";
import { InvoiceInterface } from "../../interfaces/InvoiceInterface";
import { Button } from "../ui/button";

interface InvoiceModalProps {
  invoice: InvoiceInterface;
  onClose: () => void;
}

const InvoiceModal: FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-border shadow-elevated">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Invoice #{invoice.id}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent"
            >
              &times;
            </button>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Status</p>
                <p className="font-medium capitalize text-foreground">{invoice.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Amount Due</p>
                <p className="font-medium text-foreground">
                  ${(invoice.amount_due / 100).toFixed(2)}{" "}
                  {invoice.currency?.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-2 text-foreground">Order Details</h3>
              <p className="text-foreground">
                <span className="text-muted-foreground">Order:</span>{" "}
                {invoice.order?.name}
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Total:</span> $
                {invoice.order?.amount}
              </p>
            </div>

            {/* Products */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-2 text-foreground">Products</h3>
              <div className="space-y-3">
                {invoice.order?.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.productsList?.productImages?.[0]?.image_url}
                      alt={item.productsList?.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div>
                      <p className="font-medium text-foreground">{item.productsList?.name}</p>
                      <p className="text-muted-foreground text-sm">
                        ${item.productsList?.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-primaryBlue hover:bg-darkBlue text-white">
              Download
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceModal;
