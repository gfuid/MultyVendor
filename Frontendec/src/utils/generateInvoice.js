// src/utils/generateInvoice.js
// npm install jspdf

import jsPDF from 'jspdf';

export const generateInvoice = (order) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    const W = 595.28; // A4 width in pts
    const M = 28;     // margin
    const CW = W - M * 2; // content width

    const PINK = [255, 77, 109];
    const LPINK = [255, 240, 243];
    const DARK = [30, 30, 30];
    const GRAY = [107, 114, 128];
    const LGRAY = [248, 248, 248];
    const MGRAY = [229, 231, 235];
    const GREEN = [16, 185, 129];
    const AMBER = [245, 158, 11];
    const WHITE = [255, 255, 255];

    // ── Helpers ───────────────────────────────────────────
    const fillRect = (x, y, w, h, color) => {
        doc.setFillColor(...color);
        doc.setDrawColor(...color);
        doc.rect(x, y, w, h, 'F');
    };

    const strokeRect = (x, y, w, h, fill, stroke) => {
        doc.setFillColor(...fill);
        doc.setDrawColor(...stroke);
        doc.setLineWidth(0.5);
        doc.rect(x, y, w, h, 'FD');
    };

    const txt = (str, x, y, { font = 'normal', size = 9, color = DARK, align = 'left' } = {}) => {
        doc.setFont('helvetica', font);
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(String(str), x, y, { align });
    };

    const hline = (x1, y, x2, color = MGRAY, w = 0.5) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(w);
        doc.line(x1, y, x2, y);
    };

    // ── Data prep ─────────────────────────────────────────
    const orderId = order._id?.slice(-8).toUpperCase() || 'XXXXXXXX';
    const invoiceNum = `INV-${orderId}`;
    const buyerName = order.buyer?.name || 'Customer';
    const address = order.shippingAddress || 'N/A';
    const items = order.items || [];
    const subtotalRaw = items.reduce((s, i) => s + (i.price * i.quantity), 0);
    const igst = Math.round((subtotalRaw - subtotalRaw / 1.05) * 100) / 100;
    const taxable = Math.round((subtotalRaw / 1.05) * 100) / 100;
    const grandTotal = order.totalAmount || subtotalRaw;

    let dateStr = '—';
    try {
        const d = new Date(order.createdAt);
        dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (_) { }

    // ── HEADER ────────────────────────────────────────────
    fillRect(0, 0, W, 110, PINK);

    txt('TRIREME', M, 38, { font: 'bold', size: 26, color: WHITE });
    txt('KIDS', M, 54, { font: 'normal', size: 11, color: [255, 179, 191] });
    txt('www.triremekids.com', M, 68, { size: 8, color: [255, 208, 217] });

    txt('TAX INVOICE', W - M, 36, { font: 'bold', size: 18, color: WHITE, align: 'right' });
    txt('Original For Recipient', W - M, 50, { size: 9, color: [255, 208, 217], align: 'right' });
    txt(`Invoice No: ${invoiceNum}`, W - M, 64, { size: 8, color: WHITE, align: 'right' });
    txt(`Invoice Date: ${dateStr}`, W - M, 76, { size: 8, color: WHITE, align: 'right' });

    let y = 124;

    // ── ORDER NUMBER BAR ──────────────────────────────────
    fillRect(M, y, CW, 26, LPINK);
    txt('Order Number:', M + 8, y + 16, { size: 8, color: GRAY });
    txt(order._id?.toUpperCase() || '—', M + 80, y + 16, { font: 'bold', size: 8, color: DARK });
    txt(`Order Date: ${dateStr}`, W - M, y + 16, { size: 8, color: GRAY, align: 'right' });

    y += 36;

    // ── BILL TO / SHIP TO ─────────────────────────────────
    const colW = (CW - 10) / 2;

    const drawAddressBox = (bx, by, title) => {
        strokeRect(bx, by, colW, 75, LGRAY, MGRAY);
        txt(title, bx + 8, by + 16, { font: 'bold', size: 8, color: PINK });
        doc.setDrawColor(...PINK);
        doc.setLineWidth(0.8);
        doc.line(bx + 8, by + 20, bx + colW - 8, by + 20);
        txt(buyerName, bx + 8, by + 33, { font: 'bold', size: 10, color: DARK });
        const lines = doc.splitTextToSize(address, colW - 16);
        lines.slice(0, 3).forEach((l, i) => {
            txt(l, bx + 8, by + 47 + i * 11, { size: 7.5, color: GRAY });
        });
    };

    drawAddressBox(M, y, 'BILL TO:');
    drawAddressBox(M + colW + 10, y, 'SHIP TO:');

    y += 88;

    // ── TABLE HEADER ──────────────────────────────────────
    fillRect(M, y, CW, 22, PINK);

    const C = {
        sn: M + 6,
        desc: M + 22,
        hsn: M + 195,
        qty: M + 240,
        gross: M + 270,
        disc: M + 310,
        taxable: M + 348,
        tax: M + 393,
        total: W - M,
    };

    const headers = [
        ['SN.', C.sn], ['DESCRIPTION', C.desc], ['HSN', C.hsn],
        ['QTY', C.qty], ['GROSS', C.gross], ['DISC', C.disc],
        ['TAXABLE', C.taxable], ['IGST', C.tax], ['TOTAL', C.total]
    ];
    headers.forEach(([label, x]) => {
        txt(label, x, y + 15, { font: 'bold', size: 7, color: WHITE, align: x === C.total ? 'right' : 'left' });
    });

    y += 22;

    // ── TABLE ROWS ────────────────────────────────────────
    items.forEach((item, idx) => {
        const rowH = 24;
        fillRect(M, y, CW, rowH, idx % 2 === 0 ? WHITE : LGRAY);
        doc.setDrawColor(...MGRAY);
        doc.setLineWidth(0.3);
        doc.rect(M, y, CW, rowH, 'S');

        const ry = y + 15;
        const name = (item.product?.name || 'Product').substring(0, 36);
        const qty = item.quantity || 1;
        const price = item.price || 0;
        const gross = price * qty;
        const itemTaxable = Math.round((gross / 1.05) * 100) / 100;
        const itemIgst = Math.round((gross - itemTaxable) * 100) / 100;

        txt(`${idx + 1}.`, C.sn, ry, { size: 8, color: GRAY });
        txt(name, C.desc, ry, { font: 'bold', size: 8, color: DARK });
        txt('610333', C.hsn, ry, { size: 7, color: GRAY });
        txt(String(qty), C.qty, ry, { size: 8, color: DARK });
        txt(`Rs.${gross}`, C.gross, ry, { size: 7.5, color: DARK });
        txt('Rs.0', C.disc, ry, { size: 7.5, color: GRAY });
        txt(`Rs.${itemTaxable}`, C.taxable, ry, { size: 7.5, color: DARK });
        txt(`5%:Rs.${itemIgst}`, C.tax, ry, { size: 7, color: [245, 158, 11] });
        txt(`Rs.${gross}`, C.total, ry, { font: 'bold', size: 8, color: DARK, align: 'right' });

        y += rowH;
    });

    // ── TOTALS ────────────────────────────────────────────
    hline(M, y + 4, W - M, PINK, 1);
    y += 16;

    // Total box (right)
    strokeRect(W - M - 190, y, 190, 76, LPINK, PINK);

    txt('Subtotal (excl. tax):', W - M - 182, y + 18, { size: 8, color: GRAY });
    txt(`Rs.${taxable}`, W - M, y + 18, { size: 8, color: DARK, align: 'right' });
    txt('IGST @5%:', W - M - 182, y + 34, { size: 8, color: GRAY });
    txt(`Rs.${igst}`, W - M, y + 34, { size: 8, color: [245, 158, 11], align: 'right' });
    hline(W - M - 180, y + 40, W - M, PINK, 0.5);
    txt('TOTAL AMOUNT:', W - M - 182, y + 56, { font: 'bold', size: 10, color: DARK });
    txt(`Rs.${grandTotal}`, W - M, y + 56, { font: 'bold', size: 13, color: PINK, align: 'right' });

    // Payment badge (left)
    const isPaid = ['Completed', 'paid'].includes(order.paymentStatus);
    fillRect(M, y + 8, 120, 20, isPaid ? GREEN : AMBER);
    txt(`PAYMENT: ${(order.paymentStatus || 'PENDING').toUpperCase()}`, M + 8, y + 21, { font: 'bold', size: 7.5, color: WHITE });
    txt(`Method: ${order.paymentMethod || 'COD'}`, M, y + 38, { size: 8, color: GRAY });

    y += 90;

    // ── TERMS ─────────────────────────────────────────────
    hline(M, y, W - M, MGRAY);
    y += 14;

    txt('Terms & Conditions', M, y, { font: 'bold', size: 9, color: DARK });
    y += 12;

    [
        '• Sold by: Trireme Kids  |  support@triremekids.com  |  Panipat, Haryana',
        '• Tax is not payable on reverse charge basis.',
        '• All prices inclusive of applicable taxes (GST @5%).',
        '• This is a computer generated invoice and does not require a signature.',
        '• For returns/exchanges, contact support within 7 days of delivery.',
    ].forEach(t => {
        txt(t, M, y, { size: 7.5, color: GRAY });
        y += 11;
    });

    // ── FOOTER ────────────────────────────────────────────
    fillRect(0, 810, W, 32, PINK);
    txt('Thank you for shopping with Trireme Kids!', W / 2, 824, { font: 'bold', size: 11, color: WHITE, align: 'center' });
    txt('www.triremekids.com  |  support@triremekids.com  |  Panipat, Haryana', W / 2, 836, { size: 7.5, color: [255, 208, 217], align: 'center' });

    // ── SAVE ──────────────────────────────────────────────
    doc.save(`Trireme_Invoice_${orderId}.pdf`);
};