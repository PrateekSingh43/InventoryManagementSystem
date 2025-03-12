import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateLedgerPDF = (supplier) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text('Supplier Ledger', 105, 15, { align: 'center' });
  
  // Add supplier info
  doc.setFontSize(12);
  doc.text(`Supplier: ${supplier.name}`, 15, 30);
  doc.text(`Address: ${supplier.address || 'N/A'}`, 15, 37);
  doc.text(`Contact: ${supplier.contact || 'N/A'}`, 15, 44);
  doc.text(`Opening Balance: ₹${supplier.openingBalance || 0}`, 15, 51);

  // Add transactions table
  const tableData = (supplier.transactions || []).map(t => ([
    format(new Date(t.date), 'dd/MM/yyyy'),
    t.description,
    t.debit ? `₹${t.debit}` : '-',
    t.credit ? `₹${t.credit}` : '-',
    `₹${t.balance}`
  ]));

  doc.autoTable({
    startY: 60,
    head: [['Date', 'Description', 'Debit', 'Credit', 'Balance']],
    body: tableData,
    theme: 'grid'
  });

  // Save PDF
  doc.save(`${supplier.name}_ledger_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
};
