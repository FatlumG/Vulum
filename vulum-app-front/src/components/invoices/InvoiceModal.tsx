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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold">Invoice #{invoice.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium capitalize">{invoice.status}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Amount Due</p>
                <p className="font-medium">
                  ${(invoice.amount_due / 100).toFixed(2)}{" "}
                  {invoice.currency?.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Order Details</h3>
              <p>
                <span className="text-gray-500">Order:</span>{" "}
                {invoice.order?.name}
              </p>
              <p>
                <span className="text-gray-500">Total:</span> $
                {invoice.order?.amount}
              </p>
            </div>

            {/* Products */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Products</h3>
              <div className="space-y-3">
                {invoice.order?.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.productsList?.productImages?.[0]?.image_url}
                      alt={item.productsList?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.productsList?.name}</p>
                      <p className="text-gray-500 text-sm">
                        ${item.productsList?.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
              Download
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceModal;
