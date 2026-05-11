import { isConfigured, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider, signOut, onAuthStateChanged, updateProfile, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from './firebase.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const body = document.body;
const root = document.documentElement;
const USER_DOMAIN = '9wing.local';

const cleanUsername = value => value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
const usernameToEmail = username => `${username}@${USER_DOMAIN}`;
const setMsg = (text='', type='') => { const el = $('#authMessage'); if(el){ el.textContent = text; el.className = `auth-message ${type}`.trim(); }};
const setTopupMsg = text => { const el = $('#topupMessage'); if(el) el.textContent = text; };

function lock(lock){ body.classList.toggle('lock', lock); }
function show(el){ el?.classList.add('show'); lock(true); }
function hide(el){ el?.classList.remove('show'); if(!$('.modal.show') && !$('.auth-modal.show') && !$('#navLinks')?.classList.contains('show')) lock(false); }

$('#nextPopup')?.addEventListener('click', () => { hide($('#previewPopup')); show($('#welcomePopup')); });
$('#enterSite')?.addEventListener('click', () => { $('#bgMusic')?.play().catch(()=>{}); hide($('#welcomePopup')); });

const menuToggle = $('#menuToggle'), navLinks = $('#navLinks'), navOverlay = $('#navOverlay');
function openMenu(){ navLinks.classList.add('show'); navOverlay.classList.add('show'); menuToggle.classList.add('active'); menuToggle.setAttribute('aria-expanded','true'); lock(true); }
function closeMenu(){ navLinks.classList.remove('show'); navOverlay.classList.remove('show'); menuToggle.classList.remove('active'); menuToggle.setAttribute('aria-expanded','false'); lock(false); }
menuToggle?.addEventListener('click', () => navLinks.classList.contains('show') ? closeMenu() : openMenu());
navOverlay?.addEventListener('click', closeMenu);
$$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));

let tx=0, ty=0, cx=0, cy=0;
function setPoint(x,y){ tx=((x-innerWidth/2)/(innerWidth/2))*-18; ty=((y-innerHeight/2)/(innerHeight/2))*-14; }
addEventListener('mousemove', e=>setPoint(e.clientX,e.clientY), {passive:true});
addEventListener('touchmove', e=>{ if(e.touches[0]) setPoint(e.touches[0].clientX,e.touches[0].clientY); }, {passive:true});
(function loop(){ cx+=(tx-cx)*.08; cy+=(ty-cy)*.08; root.style.setProperty('--px', cx.toFixed(2)+'px'); root.style.setProperty('--py', cy.toFixed(2)+'px'); root.style.setProperty('--sy', (scrollY*-.035).toFixed(2)+'px'); requestAnimationFrame(loop); })();

const reveal = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)), {threshold:.12});
$$('.reveal').forEach(el => reveal.observe(el));

function fakeStatus(){
  const pc = 158 + Math.floor(Math.random()*8), cloud = 118 + Math.floor(Math.random()*7);
  $('#pcUsers').textContent = pc; $('#cloudUsers').textContent = cloud;
  $('#pcBar').style.width = Math.min(100, pc/180*100)+'%'; $('#cloudBar').style.width = Math.min(100, cloud/140*100)+'%';
  $('#lastUpdate').textContent = new Date().toLocaleTimeString('th-TH');
}
fakeStatus(); setInterval(fakeStatus, 3000);

const authModal = $('#authModal');
$('#openAuth')?.addEventListener('click', () => show(authModal));
$('#authClose')?.addEventListener('click', () => hide(authModal));
authModal?.addEventListener('click', e => { if(e.target === authModal) hide(authModal); });
function switchAuth(tab){ const isLogin = tab === 'login'; $('#loginTab').classList.toggle('active', isLogin); $('#registerTab').classList.toggle('active', !isLogin); $('#loginForm').classList.toggle('active', isLogin); $('#registerForm').classList.toggle('active', !isLogin); setMsg(); }
$('#loginTab')?.addEventListener('click', () => switchAuth('login'));
$('#registerTab')?.addEventListener('click', () => switchAuth('register'));

async function saveUser(user, data={}){
  if(!db || !user) return;
  await setDoc(doc(db,'users',user.uid), { uid:user.uid, email:user.email || null, displayName:user.displayName || data.name || data.username || 'USER', role:'user', balance:0, lastLoginAt:serverTimestamp(), ...data }, {merge:true});
}

function updateUI(user, profile={}){
  if(user){ $('#openAuth').style.display='none'; $('#userChip').classList.add('show'); $('#currentUserName').textContent = profile.displayName || profile.name || profile.username || user.displayName || 'USER'; }
  else { $('#openAuth').style.display=''; $('#userChip').classList.remove('show'); $('#currentUserName').textContent='USER'; }
}

if(!isConfigured){ setMsg('ยังไม่ได้ใส่ firebaseConfig ใน assets/js/firebase.js', 'error'); }
else{
  $('#logoutBtn')?.addEventListener('click', () => signOut(auth));
  $('#registerForm')?.addEventListener('submit', async e => {
    e.preventDefault(); const name=$('#regName').value.trim(); const raw=$('#regUser').value; const username=cleanUsername(raw); const password=$('#regPass').value;
    if(username.length<3 || raw.trim().toLowerCase()!==username) return setMsg('ยูสเซอร์ใช้ได้เฉพาะ a-z, 0-9 หรือ _ และอย่างน้อย 3 ตัว', 'error');
    try{ setMsg('กำลังสมัครสมาชิก...'); const cred=await createUserWithEmailAndPassword(auth, usernameToEmail(username), password); await updateProfile(cred.user,{displayName:name||username}); await saveUser(cred.user,{name:name||username,username,loginEmail:usernameToEmail(username),createdAt:serverTimestamp()}); await setDoc(doc(db,'usernames',username),{uid:cred.user.uid,username,createdAt:serverTimestamp()}); setMsg('สมัครสมาชิกสำเร็จ','success'); e.target.reset(); setTimeout(()=>hide(authModal),500); }catch(err){ setMsg(thaiError(err),'error'); }
  });
  $('#loginForm')?.addEventListener('submit', async e => {
    e.preventDefault(); const raw=$('#loginUser').value; const username=cleanUsername(raw); const password=$('#loginPass').value;
    if(username.length<3 || raw.trim().toLowerCase()!==username) return setMsg('ยูสเซอร์ไม่ถูกต้อง','error');
    try{ setMsg('กำลังเข้าสู่ระบบ...'); const cred=await signInWithEmailAndPassword(auth, usernameToEmail(username), password); await saveUser(cred.user,{username,loginEmail:usernameToEmail(username)}); setMsg('เข้าสู่ระบบสำเร็จ','success'); e.target.reset(); setTimeout(()=>hide(authModal),500); }catch(err){ setMsg(thaiError(err),'error'); }
  });
  $('#googleLogin')?.addEventListener('click', async () => { try{ const cred=await signInWithPopup(auth,new GoogleAuthProvider()); await saveUser(cred.user,{provider:'google'}); hide(authModal); }catch(err){ setMsg(thaiError(err),'error'); }});
  $('#discordLogin')?.addEventListener('click', async () => { try{ const provider=new OAuthProvider('oidc.discord'); const cred=await signInWithPopup(auth,provider); await saveUser(cred.user,{provider:'discord'}); hide(authModal); }catch(err){ setMsg('ต้องตั้งค่า Discord OIDC Provider ใน Firebase ก่อน: '+(err.code||err.message),'error'); }});
  onAuthStateChanged(auth, async user => { if(!user) return updateUI(null); let profile={}; try{ const snap=await getDoc(doc(db,'users',user.uid)); if(snap.exists()) profile=snap.data(); }catch{} updateUI(user,profile); });
  loadNews();
}

async function loadNews(){
  const box = $('#newsList'); if(!box || !db) return;
  const q = query(collection(db,'announcements'), orderBy('createdAt','desc'), limit(5));
  onSnapshot(q, snap => {
    if(snap.empty){ box.innerHTML='<p>ยังไม่มีประกาศ</p>'; return; }
    box.innerHTML = snap.docs.map(d => { const n=d.data(); return `<article class="news-item"><h3>${escapeHtml(n.title||'ประกาศ')}</h3><p>${escapeHtml(n.body||'')}</p></article>`; }).join('');
  }, () => box.innerHTML='<p>โหลดประกาศไม่สำเร็จ</p>');
}

$('#topupForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const amount = Number($('#topupAmount').value);
  if(!auth?.currentUser) return setTopupMsg('กรุณาเข้าสู่ระบบก่อนเติมเงิน');
  if(!db) return setTopupMsg('ยังไม่ได้เชื่อม Firebase');
  if(amount < 10) return setTopupMsg('ขั้นต่ำ 10 บาท');
  await addDoc(collection(db,'topupRequests'), { uid:auth.currentUser.uid, amount, status:'pending', createdAt:serverTimestamp() });
  setTopupMsg('สร้างรายการเติมเงินแล้ว รอระบบหลังบ้านยืนยัน'); e.target.reset();
});

function thaiError(error){ const code=error?.code||''; if(code.includes('email-already-in-use')) return 'ยูสเซอร์นี้มีคนใช้แล้ว'; if(code.includes('weak-password')) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'; if(code.includes('invalid-credential')||code.includes('wrong-password')||code.includes('user-not-found')) return 'ยูสเซอร์หรือรหัสผ่านไม่ถูกต้อง'; return 'เกิดข้อผิดพลาด: '+(error?.message||code); }
function escapeHtml(v){ return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

// Deterrent only: browser source cannot be protected 100%.
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => { if((e.ctrlKey||e.metaKey) && ['u','s','p'].includes(e.key.toLowerCase())) e.preventDefault(); if(e.key === 'F12') e.preventDefault(); });
