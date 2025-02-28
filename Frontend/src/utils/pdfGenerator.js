import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateLedgerPDF = (supplier, dateRange) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Supplier Ledger', 14, 20);
  
  // Add supplier details
  doc.setFontSize(12);
  doc.text(`Supplier: ${supplier.name}`, 14, 30);
  doc.text(`Address: ${supplier.address || 'N/A'}`, 14, 37);
  
  // Add date range
  if (dateRange?.[0] && dateRange?.[1]) {
    doc.text(
      `Period: ${format(dateRange[0], 'dd/MM/yyyy')} - ${format(dateRange[1], 'dd/MM/yyyy')}`,
      14, 44
    );
  }
  
  // Calculate opening balance
  const openingBalance = supplier.openingBalance || 0;
  doc.text(`Opening Balance: ₹${openingBalance.toLocaleString()}`, 14, 51);

  // Prepare table data
  const tableData = supplier.transactions?.map(t => [
    format(new Date(t.date), 'dd/MM/yyyy'),
    t.description,
    t.debit ? `₹${t.debit.toLocaleString()}` : '-',
    t.credit ? `₹${t.credit.toLocaleString()}` : '-',
    `₹${t.balance.toLocaleString()}`
  ]) || [];

  // Add table
  doc.autoTable({
    startY: 60,
    head: [['Date', 'Description', 'Debit', 'Credit', 'Balance']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 166] }
  });

  // Add summary at the bottom
  const totalDebit = supplier.transactions?.reduce((sum, t) => sum + (t.debit || 0), 0) || 0;
  const totalCredit = supplier.transactions?.reduce((sum, t) => sum + (t.credit || 0), 0) || 0;
  const closingBalance = openingBalance + totalDebit - totalCredit;

  const finalY = doc.lastAutoTable.finalY || 150;
  doc.text(`Total Debit: ₹${totalDebit.toLocaleString()}`, 14, finalY + 10);
  doc.text(`Total Credit: ₹${totalCredit.toLocaleString()}`, 14, finalY + 17);
  doc.text(`Closing Balance: ₹${closingBalance.toLocaleString()}`, 14, finalY + 24);

  // Save the PDF
  doc.save(`${supplier.name}_ledger_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
};
