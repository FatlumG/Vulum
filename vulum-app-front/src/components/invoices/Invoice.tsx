import { FC } from "react";
import { Button } from "../ui/button";
import { InvoiceInterface } from "../../interfaces/InvoiceInterface";

interface InvoiceProps extends InvoiceInterface {
  onPreview: () => void;
}

const Invoice: FC<InvoiceProps> = ({ order, onPreview }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-sm transition-shadow">
      <img
        className="h-14 w-14 rounded-lg object-cover shrink-0"
        src={order.orderItems[0].productsList.productImages[0].image_url}
        alt={`Image of ${order.name}`}
      />
      <div className="flex-1 min-w-0">
        <h2 className="font-medium text-foreground truncate">{order.name}</h2>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onPreview}>
          Preview
        </Button>
        <Button size="sm" className="bg-primaryBlue hover:bg-darkBlue text-white">
          Download
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
