// ===============================
// 9WING KEY SYSTEM CONFIG
// GitHub Pages + Google Apps Script API
// ===============================

window.KEY_SYSTEM_CONFIG = {
  receiverName: 'ชื่อบัญชีของคุณ',
  bankName: 'ธนาคาร / TrueMoney / PromptPay',
  accountNumber: '000-000-0000',

  // ใส่ URL Web App ของ Google Apps Script หลัง Deploy
  // ตัวอย่าง: https://script.google.com/macros/s/AKfycbxxxx/exec
  googleAppsScriptApiUrl: 'https://script.google.com/macros/s/AKfycbwUF9xJVWk9lCC4b5puULGRrlqXX2QoH0b7gT-BcLyvcpgbmc0xlZYodqXeRH13PjDcLQ/exec',

  packages: [
    { id: '1day', name: '1 วัน', amount: 250, desc: 'เหมาะสำหรับทดลองใช้งานระยะสั้น', icon:'⚡', style:'' },
    { id: '2day', name: '2 วัน', amount: 400, desc: 'คุ้มกว่าสำหรับใช้งานต่อเนื่อง', icon:'🔥', style:'featured', ribbon:'ฟรีโปรตีเร็ว' },
    { id: 'permanent', name: 'ถาวร', amount: 4000, desc: 'ใช้งานยาว ไม่ต้องต่ออายุบ่อย', icon:'👑', style:'gold', ribbon:'ฟรีโปรตีเร็ว' }
  ]
};
