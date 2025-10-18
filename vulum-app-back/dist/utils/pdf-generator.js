"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePdf = void 0;
const jspdf_1 = __importDefault(require("jspdf"));
const generateInvoicePdf = (data) => {
    const doc = new jspdf_1.default();
    const lineHeight = 10;
    let y = 10;
    doc.setFontSize(16);
    doc.text('VULUM INVOICE', 105, y, { align: 'center' });
    y += lineHeight * 2;
    doc.setFontSize(12);
    doc.text(`Invoice #: ${Date.now()}`, 10, y);
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
    console.log('Invoice items:', data.items);
    data.items.forEach((item) => {
        const total = item.quantity * item.price;
        totalAmount += total;
        doc.text(item.description, 10, y);
        doc.text(item.quantity.toString(), 100, y);
        doc.text(Number(item.price).toFixed(2), 130, y);
        doc.text(total.toFixed(2), 160, y);
        y += lineHeight;
    });
    y += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', 130, y);
    doc.text(`${totalAmount.toFixed(2)} ${data.currency || ''}`, 160, y);
    doc.save(`invoice-${Date.now()}.pdf`);
};
exports.generateInvoicePdf = generateInvoicePdf;
//# sourceMappingURL=pdf-generator.js.map