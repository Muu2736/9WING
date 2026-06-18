const CONFIG = window.KEY_SYSTEM_CONFIG;
const $ = (id) => document.getElementById(id);

function setBox(el,type,html){
  el.className = `result-box show ${type}`;
  el.innerHTML = html;
}

function setMini(el,type,html){
  el.className = `live-key-result ${type}`;
  el.innerHTML = html;
}

function updateStock(){
  const stock = $('keyStock');
  if(stock) stock.textContent = 'API';
}

function renderPackages(){
  const grid = $('packageGrid');
  grid.innerHTML = CONFIG.packages.map((pkg) => `
    <div class="package-card ${pkg.style || ''}" data-id="${pkg.id}" data-name="${pkg.name}" data-amount="${pkg.amount}">
      ${pkg.ribbon ? `<div class="ribbon">${pkg.ribbon}</div>` : ''}
      <div class="package-icon">${pkg.icon || '🔑'}</div>
      <div class="package-name">${pkg.name}</div>
      <div class="package-price">${pkg.amount.toLocaleString('th-TH')} <small>บาท</small></div>
      <div class="package-desc">${pkg.desc || ''}</div>
      <div class="select-label">เลือกแพคเกจนี้</div>
    </div>
  `).join('');

  grid.querySelectorAll('.package-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      $('selectedPackage').value = card.dataset.id;
      $('selectedAmount').value = card.dataset.amount;
      $('selectedPackageText').value = `${card.dataset.name} / ${Number(card.dataset.amount).toLocaleString('th-TH')} บาท`;
      $('selectedPrice').textContent = Number(card.dataset.amount).toLocaleString('th-TH');
      $('resultBox').className = 'result-box';
    });
  });
}

function fileToBase64(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const base64 = dataUrl.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function requestKeyFromAppsScript(file){
  if(!CONFIG.googleAppsScriptApiUrl){
    throw new Error('ยังไม่ได้ใส่ Google Apps Script API URL ใน config.js');
  }

  const payload = {
    action: 'buy_key',
    package_id: $('selectedPackage').value,
    expected_amount: Number($('selectedAmount').value),
    slip_filename: file.name,
    slip_mime_type: file.type || 'image/png',
    slip_base64: await fileToBase64(file)
  };

  // ใช้ text/plain เพื่อลดปัญหา CORS preflight กับ Google Apps Script
  const res = await fetch(CONFIG.googleAppsScriptApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });

  if(!res.ok){
    throw new Error('ไม่สามารถเชื่อมต่อ API ได้');
  }

  const data = await res.json();
  if(!data.success){
    throw new Error(data.message || 'ตรวจสลิปไม่ผ่าน');
  }

  return data;
}

function switchScreen(screenId){
  document.querySelectorAll('[data-screen]').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll(`[data-screen="${screenId}"]`).forEach(b => b.classList.add('active'));
  $(screenId).classList.add('active');
  updateStock();
}

function bindEvents(){
  document.querySelectorAll('[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
  });

  $('slipFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if(!file) return;
    $('preview').src = URL.createObjectURL(file);
    $('preview').style.display = 'block';
  });

  $('slipForm').addEventListener('submit', async e => {
    e.preventDefault();
    const result = $('resultBox');

    try{
      if(!$('selectedPackage').value) throw new Error('กรุณาเลือกแพคเกจก่อน');
      const file = $('slipFile').files[0];
      if(!file) throw new Error('กรุณาอัปโหลดสลิปก่อน');

      setBox(result, 'pending', '⏳ กำลังส่งสลิปไปตรวจสอบ กรุณารอสักครู่...');

      const data = await requestKeyFromAppsScript(file);

      setBox(result, 'ok', `
        <h3>✅ ตรวจสอบสำเร็จ</h3>
        <p>ระบบตรวจสลิปผ่าน และออก KEY ให้แล้ว</p>
        <div class="key-output">${data.key}</div>
        <p class="muted">กรุณาคัดลอก KEY เก็บไว้ทันที</p>
      `);

      $('slipForm').reset();
      $('preview').style.display = 'none';
      document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
      $('selectedPackageText').value = '';
      $('selectedPrice').textContent = '-';

    }catch(err){
      setBox(result, 'err', `❌ ${err.message}`);
    }
  });

  const saveBtn = $('saveKeysBtn');
  if(saveBtn){
    saveBtn.style.display = 'none';
  }
  const adminKeys = $('adminKeys');
  if(adminKeys){
    adminKeys.value = 'ใช้งานจริงให้เพิ่ม KEY ใน Google Sheets แทน ไม่ต้องใส่ KEY ในหน้าเว็บ';
    adminKeys.readOnly = true;
  }

  $('liveLoginBtn')?.addEventListener('click', () => {
    const key = $('liveKeyInput').value.trim();
    const box = $('liveKeyResult');
    if(!key) return setMini(box, 'err', 'กรุณาใส่ KEY ก่อน');
    setMini(box, 'ok', `✅ รับ KEY แล้ว: <b>${key}</b><br>ขั้นตอนต่อไปสามารถนำ KEY ไปเช็กกับ API หรือระบบโปรแกรมหลักได้`);
  });
}

function init(){
  $('receiverNameText').textContent = CONFIG.receiverName;
  $('bankText').textContent = CONFIG.bankName;
  $('accountText').textContent = CONFIG.accountNumber;
  $('qrImage').src = 'assets/payment-qr.png';
  $('qrImage').onerror = () => $('qrImage').style.display = 'none';

  renderPackages();
  bindEvents();
  updateStock();
}

document.addEventListener('DOMContentLoaded', init);
