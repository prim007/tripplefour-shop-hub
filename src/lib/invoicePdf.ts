import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "@/assets/tripple444-logo.png";

export const INVOICE_BANK = {
  accountName: "P.M",
  bank: "FNB",
  branchCode: "250655",
  accountNumber: "63203398862",
  accountType: "Cheque",
};

export type InvoiceStatus = "unpaid" | "paid" | "overdue";

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  orderRef: string;
  date?: string | Date;
  dueDate?: string | Date | null;
  status: InvoiceStatus;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  deliveryZoneName?: string | null;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  deliveryFee: number;
  total: number;
  notes?: string;
}

const STATUS_COLOR: Record<InvoiceStatus, [number, number, number]> = {
  paid: [22, 130, 68],
  unpaid: [190, 140, 20],
  overdue: [180, 40, 40],
};

async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const fmtDate = (d?: string | Date | null) =>
  d ? new Date(d).toLocaleDateString("en-ZA") : "—";

/** Builds the branded Tripplefour invoice and returns the jsPDF document. */
export async function buildInvoicePdf(data: InvoiceData): Promise<jsPDF> {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // Header band with logo
  doc.setFillColor(13, 13, 13);
  doc.rect(0, 0, pageW, 34, "F");
  const logo = await loadLogo();
  if (logo) {
    try {
      doc.addImage(logo, "PNG", 14, 7, 44, 22);
    } catch {
      /* logo optional */
    }
  }
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(16);
  doc.text("TAX INVOICE", pageW - 14, 17, { align: "right" });
  doc.setTextColor(235, 235, 235);
  doc.setFontSize(9);
  doc.text("TRIPPLEFOUR · tripplefourshophub.online", pageW - 14, 25, { align: "right" });

  // Status stamp
  const color = STATUS_COLOR[data.status] ?? STATUS_COLOR.unpaid;
  doc.setDrawColor(...color);
  doc.setTextColor(...color);
  doc.setLineWidth(0.8);
  doc.roundedRect(pageW - 56, 40, 42, 12, 2, 2, "S");
  doc.setFontSize(12);
  doc.text(data.status.toUpperCase(), pageW - 35, 48, { align: "center" });

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(10);
  doc.text(`Invoice no: ${data.orderRef}`, 14, 44);
  doc.text(`Date: ${fmtDate(data.date ?? new Date())}`, 14, 50);
  doc.text(`Due date: ${fmtDate(data.dueDate)}`, 14, 56);

  doc.text(
    [
      "BILL TO",
      data.customerName || "-",
      data.customerEmail || "-",
      data.customerPhone || "-",
      ...doc.splitTextToSize(data.deliveryAddress || "-", 110),
      data.deliveryZoneName ? `Delivery zone: ${data.deliveryZoneName}` : "",
    ].filter(Boolean),
    14,
    68,
  );

  autoTable(doc, {
    startY: 108,
    head: [["Item", "Unit (R)", "Qty", "Line total (R)"]],
    body: data.items.length
      ? data.items.map((i) => [
          i.name,
          i.price.toFixed(2),
          String(i.quantity),
          (i.price * i.quantity).toFixed(2),
        ])
      : [["No items", "-", "-", "-"]],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [13, 13, 13], textColor: [212, 175, 55] },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error lastAutoTable is added by jspdf-autotable
  let y = (doc.lastAutoTable?.finalY ?? 120) + 10;
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text(`Subtotal: R${data.subtotal.toFixed(2)}`, 14, y);
  y += 6;
  if (data.discount && data.discount > 0) {
    doc.text(`Discount: -R${data.discount.toFixed(2)}`, 14, y);
    y += 6;
  }
  doc.text(`Delivery fee: R${data.deliveryFee.toFixed(2)}`, 14, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(`Total due: R${data.total.toFixed(2)}`, 14, y);
  y += 10;

  if (data.notes?.trim()) {
    doc.setFontSize(10);
    const wrapped = doc.splitTextToSize(data.notes.trim(), 180);
    doc.text(wrapped, 14, y);
    y += wrapped.length * 5 + 4;
  }

  if (y > 205) {
    doc.addPage();
    y = 24;
  }

  // Banking details
  doc.setDrawColor(212, 175, 55);
  doc.setFillColor(250, 247, 236);
  doc.roundedRect(14, y, pageW - 28, 56, 2, 2, "FD");
  doc.setFontSize(11);
  doc.setTextColor(13, 13, 13);
  doc.text("EFT BANKING DETAILS", 20, y + 9);
  doc.setFontSize(10);
  const rows: [string, string][] = [
    ["Account name", INVOICE_BANK.accountName],
    ["Bank", INVOICE_BANK.bank],
    ["Branch code", INVOICE_BANK.branchCode],
    ["Account no.", INVOICE_BANK.accountNumber],
    ["Type", INVOICE_BANK.accountType],
    ["Reference", data.orderRef],
  ];
  rows.forEach(([label, value], i) => {
    const ry = y + 17 + i * 6.5;
    doc.setTextColor(90, 90, 90);
    doc.text(label, 20, ry);
    doc.setTextColor(13, 13, 13);
    doc.text(String(value), 70, ry);
  });

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    data.status === "paid"
      ? "Payment received — thank you. Orders are dispatched within 24–48 hours."
      : "Use your invoice number as the EFT payment reference. Orders dispatch once payment reflects.",
    14,
    y + 64,
  );

  return doc;
}

/**
 * Saves a PDF in a way that works on desktop AND mobile browsers.
 * iOS Safari ignores `doc.save()` in some contexts, so we fall back to an
 * object-URL anchor click and finally to opening the blob in a new tab.
 */
export function savePdfCrossPlatform(doc: jsPDF, filename: string) {
  const blob = doc.output("blob") as Blob;
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    window.open(url, "_blank");
  }

  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function downloadInvoicePdf(data: InvoiceData): Promise<string> {
  const doc = await buildInvoicePdf(data);
  const filename = `tripplefour-invoice-${data.orderRef}.pdf`;
  savePdfCrossPlatform(doc, filename);
  return filename;
}