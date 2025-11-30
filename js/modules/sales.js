// js/modules/sales.js
import { printService } from '../services/printService.js';

export default function salesModule() {
    return {
        // --- Data Models ---
        orders: [],
        
        form: {
            soNo: '', 
            soDate: new Date().toISOString().slice(0,10),
            customer: { code:'', firstName:'', lastName:'', address:'' },
            items: [],
            payment: { total: 0 }
        },

        isEditing: false,

        // --- Init ---
        init() {
            console.log("Sales App Ready");
            // โหลดข้อมูลตัวอย่าง (Mock Data) ไปก่อน เดี๋ยวเฟสหน้าค่อยต่อ Backend
            this.orders = [
                { soNo: 'SO-001', soDate: '2023-10-01', customer: {firstName:'Somchai', lastName:'Dee'}, items: [{name:'Service A', qty:1, price:1000, total:1000}], payment:{total:1000} }
            ];
        },

        // --- Actions ---
        addItem() {
            this.form.items.push({ code: '', name: '', qty: 1, price: 0, total: 0 });
        },

        removeItem(index) {
            this.form.items.splice(index, 1);
            this.calculateTotal();
        },

        calculateTotal() {
            let sum = 0;
            this.form.items.forEach(item => {
                item.total = item.qty * item.price;
                sum += item.total;
            });
            this.form.payment = { ...this.form.payment, total: sum };
        },

        saveOrder() {
            // จำลองการบันทึก
            if(!this.form.soNo) this.form.soNo = `SO-${Date.now()}`;
            
            const existingIdx = this.orders.findIndex(o => o.soNo === this.form.soNo);
            if(existingIdx >= 0) {
                this.orders[existingIdx] = JSON.parse(JSON.stringify(this.form));
            } else {
                this.orders.push(JSON.parse(JSON.stringify(this.form)));
            }
            
            alert('บันทึกเรียบร้อย (Frontend Only)');
            this.resetForm();
        },

        // --- Print Feature (จุดขาย) ---
        printQuotation() {
            this.calculateTotal(); // คำนวณก่อนพิมพ์
            printService.printInvoice('QUOTATION', this.form);
        },

        printReceipt(order) {
            printService.printInvoice('RECEIPT', order);
        },

        // --- Utils ---
        editOrder(order) {
            this.isEditing = true;
            this.form = JSON.parse(JSON.stringify(order));
        },

        resetForm() {
            this.isEditing = false;
            this.form = {
                soNo: '', soDate: new Date().toISOString().slice(0,10),
                customer: { code:'', firstName:'', lastName:'', address:'' },
                items: [],
                payment: { total: 0 }
            };
        }
    }
}
