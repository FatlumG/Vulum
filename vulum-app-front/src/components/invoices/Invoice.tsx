import { FC } from "react";
import { Button } from "../ui/button";
import { InvoiceInterface } from "../../interfaces/InvoiceInterface";

interface InvoiceProps extends InvoiceInterface {
  onPreview: () => void;
}

const Invoice: FC<InvoiceProps> = ({ order, onPreview }) => {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="px-10 bg-gray-300 w-full h-24 rounded-lg flex items-center justify-between">
        <img
          className="h-16 rounded-lg"
          src={order.orderItems[0].productsList.productImages[0].image_url}
          alt={`Image of ${order.name}`}
        />
        <h2 className="">{order.name} </h2>
        <div className="flex gap-5">
          <Button variant="outline" onClick={onPreview}>
            Preview
          </Button>
          <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
