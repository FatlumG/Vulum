import jsPDF from 'jspdf';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  customerName: string;
  customerAddress: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  stripePaymentId?: string;
  paymentDate?: string;
  currency?: string;
}

export const generateInvoicePdf = (data: InvoiceData) => {
  const doc = new jsPDF();

  const lineHeight = 10;
  let y = 10;

  doc.setFontSize(16);
  doc.text('INVOICE', 105, y, { align: 'center' });
  y += lineHeight * 2;

  doc.setFontSize(12);
  doc.text(`Invoice #: ${data.invoiceNumber}`, 10, y);
  y += lineHeight;
  doc.text(`Customer: ${data.customerName}`, 10, y);
  y += lineHeight;
  doc.text(`Address: ${data.customerAddress}`, 10, y);
  y += lineHeight;

  if (data.stripePaymentId) {
    doc.text(`Stripe Payment ID: ${data.stripePaymentId}`, 10, y);
    y += lineHeight;
  }

  if (data.paymentDate) {
    doc.text(`Payment Date: ${data.paymentDate}`, 10, y);
    y += lineHeight;
  }

  y += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Description', 10, y);
  doc.text('Qty', 100, y);
  doc.text('Price', 130, y);
  doc.text('Total', 160, y);
  y += lineHeight;

  doc.setFont('helvetica', 'normal');
  let totalAmount = 0;
  data.items.forEach((item) => {
    const total = item.quantity * item.price;
    totalAmount += total;

    doc.text(item.description, 10, y);
    doc.text(item.quantity.toString(), 100, y);
    doc.text((item.price! / 100).toFixed(2), 130, y);
    doc.text(total.toFixed(2), 160, y);

    y += lineHeight;
  });

  y += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', 130, y);
  doc.text(`${totalAmount.toFixed(2)} ${data.currency || ''}`, 160, y);

  doc.save(`invoice-${data.invoiceNumber}.pdf`);
};
