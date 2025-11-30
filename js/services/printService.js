// js/services/printService.js

// ตรวจสอบว่าโหลด Library มาหรือยัง
const checkLib = () => {
    if (!window.jspdf) {
        alert('กำลังโหลดระบบพิมพ์... กรุณารอสักครู่');
        return false;
    }
    return true;
};

export const printService = {
    // ฟังก์ชันพิมพ์ใบเสนอราคา / ใบเสร็จ
    printInvoice(docType, data) {
        if (!checkLib()) return;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // 1. หัวเอกสาร (Header)
        doc.setFontSize(22);
        doc.text(docType === 'QUOTATION' ? 'QUOTATION' : 'RECEIPT / TAX INVOICE', 14, 20);
        
        doc.setFontSize(10);
        doc.text(`Document No: ${data.soNo}`, 14, 30);
        doc.text(`Date: ${data.soDate}`, 14, 35);
        doc.text(`Customer: ${data.customer.firstName} ${data.customer.lastName}`, 14, 45);

        // 2. ตารางรายการสินค้า (ใช้ plugin autoTable)
        const tableColumn = ["#", "Item Name", "Qty", "Price", "Total"];
        const tableRows = [];

        data.items.forEach((item, index) => {
            const rowData = [
                index + 1,
                item.name || item.code,
                item.qty,
                parseFloat(item.price).toFixed(2),
                parseFloat(item.total).toFixed(2)
            ];
            tableRows.push(rowData);
        });

        // สร้างตาราง
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }, // สีน้ำเงินสวยๆ
            styles: { fontSize: 9 }
        });

        // 3. สรุปยอดเงิน (Footer)
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`Grand Total: ${parseFloat(data.payment?.total || 0).toFixed(2)} THB`, 14, finalY);
        
        // 4. ส่วนลายเซ็น
        doc.setLineWidth(0.5);
        doc.line(130, finalY + 20, 190, finalY + 20);
        doc.setFontSize(10);
        doc.text("Authorized Signature", 140, finalY + 25);

        // 5. สั่งดาวน์โหลดหรือเปิดดู
        // doc.save(`${data.soNo}.pdf`); // ถ้าอยากให้โหลดเลยใช้บรรทัดนี้
        window.open(doc.output('bloburl'), '_blank'); // เปิด Tab ใหม่
    }
};
