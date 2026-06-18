# 9WING KEY SYSTEM  
## GitHub Pages + Google Apps Script API

ชุดนี้ใช้หน้าเว็บสไตล์เก่า 9WING เหมือนเดิม แต่เปลี่ยนระบบให้ปลอดภัยขึ้น:

ลูกค้าทำแค่:

1. เลือกแพคเกจ
2. อัปโหลดสลิป
3. กดตรวจสลิปและรับ KEY

ลูกค้าไม่ต้องกรอกชื่อ ไม่ต้องกรอกเวลา และไม่ต้องกรอกเลขอ้างอิงเอง

---

## โครงสร้างไฟล์

### หน้าเว็บ GitHub Pages

- `index.html`
- `style.css`
- `config.js`
- `app.js`
- `assets/payment-qr.png`

### หลังบ้าน Google Apps Script

- `google-apps-script/Code.gs`
- `google-apps-script/keys-template.csv`

---

## วิธีตั้งค่า Google Sheets

สร้าง Google Sheets ใหม่ แล้วสร้างชีต 3 แท็บนี้:

### 1) keys

| key | package_id | status | sold_at |
|---|---|---|---|
| 9WING-1DAY-001 | 1day | available | |
| 9WING-2DAY-001 | 2day | available | |
| 9WING-PERM-001 | permanent | available | |

### 2) orders

| created_at | package_id | amount | receiver_name | transfer_datetime | transaction_ref | key |
|---|---|---|---|---|---|---|

### 3) used_slips

| transfer_datetime | transaction_ref | amount | created_at |
|---|---|---|---|

หรือใช้ฟังก์ชัน `setupSheets()` ใน Apps Script เพื่อสร้างหัวตารางให้อัตโนมัติ

---

## วิธีตั้งค่า Apps Script

1. เปิด Google Sheets ที่จะเก็บ KEY
2. ไปที่ Extensions > Apps Script
3. วางโค้ดจากไฟล์ `google-apps-script/Code.gs`
4. แก้ค่าตรงนี้:

```js
const CONFIG = {
  RECEIVER_NAME: 'ชื่อบัญชีของคุณ',
  SPREADSHEET_ID: 'ใส่ Spreadsheet ID ตรงนี้',
  SLIP_VERIFY_API_URL: '',
  SLIP_VERIFY_API_KEY: '',
  DEMO_MODE: false
};
```

5. กด Run ฟังก์ชัน `setupSheets()` หนึ่งครั้ง
6. Deploy > New deployment
7. Type เลือก Web app
8. Execute as: Me
9. Who has access: Anyone
10. Copy Web App URL

---

## วิธีตั้งค่าหน้าเว็บ GitHub Pages

เปิดไฟล์ `config.js` แล้วใส่ URL ที่ได้จาก Apps Script:

```js
googleAppsScriptApiUrl: 'https://script.google.com/macros/s/xxxx/exec',
```

แล้วแก้ข้อมูลบัญชี:

```js
receiverName: 'ชื่อบัญชีของคุณ',
bankName: 'ธนาคาร / TrueMoney / PromptPay',
accountNumber: '000-000-0000',
```

---

## เรื่องตรวจสลิปจริง

Google Apps Script เป็น API หลังบ้านได้ แต่ตัวมันเองไม่ได้อ่านสลิปธนาคารได้แม่นแบบธนาคารโดยตรง  
ดังนั้นควรต่อกับบริการ Slip Verify API ภายนอก เช่น SlipOK / EasySlip / ผู้ให้บริการตรวจสลิปที่คุณใช้อยู่

ในไฟล์ `Code.gs` ให้แก้ฟังก์ชันนี้ให้ตรงกับ API ที่ใช้:

```js
verifySlipWithProvider()
```

API หลังบ้านจะต้องคืนข้อมูลหลัก ๆ นี้:

```json
{
  "receiver_name": "ชื่อบัญชีผู้รับ",
  "amount": 250,
  "transfer_datetime": "2026-06-17 12:30:00",
  "transaction_ref": "ABC123456"
}
```

จากนั้น Apps Script จะตรวจต่อให้ว่า:

- ชื่อผู้รับเงินตรงไหม
- ยอดเงินตรงกับแพคเกจไหม
- เวลาโอนซ้ำไหม
- เลขอ้างอิงซ้ำไหม
- KEY ยังมีไหม
- ถ้าผ่านจึงส่ง KEY กลับไปให้ลูกค้า

---

## ทดสอบก่อนขายจริง

ถ้าต้องการลองระบบโดยยังไม่มี Slip Verify API ให้ตั้งใน `Code.gs`:

```js
DEMO_MODE: true
```

ห้ามใช้ `DEMO_MODE: true` ตอนขายจริง เพราะระบบจะอนุมัติสลิปแบบจำลอง
