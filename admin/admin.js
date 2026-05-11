import { isConfigured, auth, db, signInWithEmailAndPassword, doc, getDoc, collection, addDoc, serverTimestamp } from '../assets/js/firebase.js';
const $ = s => document.querySelector(s); const msg = t => $('#adminMessage').textContent = t;
let isAdmin = false;
if(!isConfigured) msg('กรุณาใส่ Firebase config ก่อน');
$('#adminLogin')?.addEventListener('submit', async e => { e.preventDefault(); try{ const cred=await signInWithEmailAndPassword(auth,$('#adminEmail').value,$('#adminPass').value); const snap=await getDoc(doc(db,'users',cred.user.uid)); isAdmin = snap.exists() && snap.data().role === 'admin'; msg(isAdmin ? 'เข้าสู่ระบบแอดมินแล้ว' : 'บัญชีนี้ไม่ใช่ admin'); }catch(err){ msg(err.message); }});
$('#newsForm')?.addEventListener('submit', async e => { e.preventDefault(); if(!isAdmin) return msg('ต้อง login admin ก่อน'); await addDoc(collection(db,'announcements'),{title:$('#newsTitle').value,body:$('#newsBody').value,createdAt:serverTimestamp()}); msg('เพิ่มประกาศแล้ว'); e.target.reset(); });
