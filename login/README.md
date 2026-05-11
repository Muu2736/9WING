# 9WING Upgraded Frontend

## สิ่งที่ปรับแล้ว
- แยกไฟล์ `index.html`, `assets/css/styles.css`, `assets/js/app.js`, `assets/js/firebase.js`
- ปรับ UI เป็น Dark Neon Gaming
- แก้โครงสร้าง popup ให้ปิด div ถูกต้อง
- เพิ่มระบบ Login/Register, Google Login, Discord OIDC placeholder
- เพิ่ม Firestore collections: users, usernames, announcements, topupRequests
- เพิ่มหน้า `admin/index.html` สำหรับเพิ่มประกาศ
- เพิ่ม Firestore rules
- เพิ่ม SEO meta/OpenGraph เบื้องต้น
- เพิ่ม mobile optimization และ reveal animation

## ต้องทำก่อนใช้งานจริง
1. สร้าง Firebase project
2. เปิด Authentication: Email/Password และ Google
3. สำหรับ Discord ให้ตั้งค่า OIDC provider ชื่อ `oidc.discord` ใน Firebase Authentication
4. ใส่ค่า config จริงใน `assets/js/firebase.js`
5. Deploy `firestore.rules`
6. ตั้ง role admin ใน Firestore: `users/{uid}.role = "admin"`
7. ระบบเติมเงินจริงต้องทำผ่าน Cloud Functions/Server เท่านั้น ห้ามยืนยันยอดเงินจาก client โดยตรง

## หมายเหตุด้านความปลอดภัย
- API key ของ Firebase บนเว็บไม่ใช่ secret แต่ต้องป้องกันด้วย Firestore Rules และ App Check
- ป้องกัน inspect/devtools 100% ไม่ได้ ทำได้แค่ลดการคัดลอก/obfuscate
- Logic สำคัญ เช่น เติมเงิน, เพิ่ม balance, อนุมัติคำสั่งซื้อ ต้องอยู่ฝั่ง server
