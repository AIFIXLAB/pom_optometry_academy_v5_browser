import { storage } from "./db.js";
import { starterQuestions } from "./questions.js";
import "./style.css";

const $ = (s) => document.querySelector(s);
const app = $("#app");
let state = {
  page: "dashboard",
  questions: [],
  attempts: [],
  sessions: [],
  settings: { learner: "Pom", language: "TH-EN", dailyGoal: 90 },
  currentQuiz: null,
  selected: null,
  feedback: null,
  filter: "ทั้งหมด"
};

const topics = ["ทั้งหมด", ...new Set(starterQuestions.map(q => q.topic))];
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const fmtDate = (v) => new Date(v).toLocaleDateString("th-TH", { day:"numeric", month:"short", year:"numeric" });

async function init() {
  try {
    state.questions = await storage.getAll("questions");
    if (!state.questions.length) {
      for (const q of starterQuestions) await storage.put("questions", q);
      state.questions = await storage.getAll("questions");
    }
    state.attempts = await storage.getAll("attempts");
    state.sessions = await storage.getAll("sessions");
    const settings = await storage.get("settings", "main");
    if (settings?.value) state.settings = { ...state.settings, ...settings.value };
    render();
    registerSW();
  } catch (error) {
    app.innerHTML = `<main class="fatal"><h1>เปิดคลังข้อมูลไม่ได้</h1><p>${esc(error.message)}</p><p>ลองเปิดด้วย Chrome, Edge หรือ Safari รุ่นปัจจุบัน และหลีกเลี่ยงโหมด Private/Incognito</p></main>`;
  }
}

function registerSW() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}

function navItem(id, label, icon) {
  return `<button class="nav-item ${state.page === id ? "active" : ""}" data-page="${id}"><span>${icon}</span>${label}</button>`;
}

function render() {
  const total = state.questions.length;
  const done = state.attempts.length;
  const correct = state.attempts.filter(a => a.isCorrect).length;
  const rate = done ? Math.round(correct / done * 100) : 0;
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand"><div class="brand-mark">P</div><div><strong>Pom Optometry</strong><small>ACADEMY · V5</small></div></div>
        <div class="learner"><div class="avatar">P</div><div><b>Pom</b><small>Personal Exam Prep</small></div><span class="online-dot"></span></div>
        <nav>
          ${navItem("dashboard","ภาพรวม","⌂")}
          ${navItem("practice","คลังข้อสอบ","▤")}
          ${navItem("progress","ผลการฝึก","◷")}
          ${navItem("plan","แผนอ่านหนังสือ","▦")}
          ${navItem("settings","ข้อมูลและสำรอง","⚙")}
        </nav>
        <div class="side-bottom"><span class="storage-dot"></span> บันทึกในอุปกรณ์นี้</div>
      </aside>
      <main class="main">
        <header class="topbar"><div><span class="eyebrow">OPTOMETRY LICENSING EXAM PREPARATION</span><h1>${pageTitle()}</h1></div><div class="top-actions"><span class="date">${new Date().toLocaleDateString("th-TH",{weekday:"short",day:"numeric",month:"long"})}</span><div class="avatar small">P</div></div></header>
        <section class="content">${pageContent({total,done,rate})}</section>
        <footer>Pom Optometry Academy <span>·</span> V5.1 Browser Edition</footer>
      </main>
    </div>`;
  app.querySelectorAll("[data-page]").forEach(b => b.addEventListener("click", () => { state.page = b.dataset.page; state.currentQuiz = null; render(); }));
  bindPageEvents();
}

function pageTitle() {
  return ({dashboard:"Dashboard",practice:"Question Bank",progress:"Learning Progress",plan:"Study Plan",settings:"Data & Backup"})[state.page];
}

function pageContent(stats) {
  if (state.page === "dashboard") return dashboard(stats);
  if (state.page === "practice") return practice();
  if (state.page === "progress") return progress();
  if (state.page === "plan") return plan();
  return settingsPage();
}

function dashboard({total,done,rate}) {
  const recent = [...state.attempts].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const topicCounts = topics.slice(1).map(t => ({t, n:state.questions.filter(q=>q.topic===t).length}));
  return `
    <div class="welcome"><div><div class="eyebrow light">YOUR PERSONAL STUDY SPACE</div><h2>พร้อมลุยสนามสอบหรือยัง, Pom?</h2><p>ฝึกอย่างสม่ำเสมอ วันละ 1–2 ชั่วโมง เพื่อเตรียมสอบเดือนกรกฎาคม 2570</p><button class="btn primary" data-action="start-quiz">เริ่มทำข้อสอบ <span>→</span></button></div><div class="welcome-art"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="eye-icon">◉</div><span class="art-label">SEE · LEARN · MASTER</span></div></div>
    <div class="stat-grid">
      ${statCard("คลังข้อสอบ",total,"ข้อ","▤","blue")}
      ${statCard("ตอบแล้ว",done,"ครั้ง","✓","green")}
      ${statCard("ความถูกต้อง",rate,"%","◎","purple")}
      ${statCard("เวลาอ่านสะสม",Math.round(state.sessions.reduce((s,x)=>s+(x.minutes||0),0)/60*10)/10,"ชม.","◷","orange")}
    </div>
    <div class="section-heading"><div><h3>ภาพรวมการเตรียมสอบ</h3><p>ข้อมูลจากการฝึกในอุปกรณ์นี้</p></div><button class="text-btn" data-page="progress">ดูรายละเอียด →</button></div>
    <div class="two-col">
      <div class="panel"><div class="panel-head"><h3>หัวข้อในคลังข้อสอบ</h3><span class="muted">STARTER BANK</span></div>${topicCounts.map(x=>`<div class="topic-row"><span>${esc(x.t)}</span><div class="mini-track"><i style="width:${Math.max(8,x.n/Math.max(1,total)*100)}%"></i></div><b>${x.n}</b></div>`).join("")}</div>
      <div class="panel"><div class="panel-head"><h3>กิจกรรมล่าสุด</h3><span class="muted">RECENT</span></div>${recent.length ? recent.map(a=>`<div class="activity-row"><div class="activity-icon">${a.isCorrect?"✓":"×"}</div><div><b>${esc(a.topic||"แบบฝึกหัด")}</b><small>${fmtDate(a.createdAt)}</small></div><strong class="${a.isCorrect?"good":"bad"}">${a.isCorrect?"ถูก":"ทบทวน"}</strong></div>`).join("") : `<div class="empty-small">ยังไม่มีประวัติการฝึก เริ่มทำข้อสอบชุดแรกได้เลย</div>`}</div>
    </div>
    <div class="notice"><span>✦</span><div><b>หมายเหตุเกี่ยวกับคลังข้อสอบ</b><p>ชุดเริ่มต้นเป็นข้อสอบฝึกที่สร้างเพื่อทบทวนหลักการ ไม่ใช่ข้อสอบจริงหรือข้อสอบย้อนหลังที่รับรองแล้ว ควรตรวจทานเฉลยกับตำราและอาจารย์ก่อนใช้เป็นแหล่งอ้างอิงสอบ</p></div></div>`;
}

function statCard(label,value,unit,icon,color) {
  return `<div class="stat-card"><div class="stat-icon ${color}">${icon}</div><div><span>${label}</span><strong>${value}<small>${unit}</small></strong></div></div>`;
}

function practice() {
  if (state.currentQuiz) return quizView();
  const filtered = state.questions.filter(q=>state.filter==="ทั้งหมด"||q.topic===state.filter);
  return `<div class="page-intro"><div><h2>ฝึกทำข้อสอบตามหมวดวิชา</h2><p>อ่านโจทย์ภาษาอังกฤษควบคู่คำแปลไทย พร้อมเฉลยและคำอธิบายหลังตอบ</p></div><button class="btn primary" data-action="start-quiz">สุ่มชุดฝึก 10 ข้อ →</button></div>
    <div class="filter-row">${topics.map(t=>`<button class="chip ${state.filter===t?"selected":""}" data-filter="${esc(t)}">${esc(t)}</button>`).join("")}</div>
    <div class="question-list">${filtered.map((q,i)=>`<article class="question-card"><div class="q-meta"><span>${esc(q.topic)}</span><span>${esc(q.subtopic)}</span><span class="level">${esc(q.difficulty)}</span></div><h3>${i+1}. ${esc(q.question)}</h3><div class="q-options">${q.options.map((o,j)=>`<span>${String.fromCharCode(65+j)}. ${esc(o)}</span>`).join("")}</div><div class="q-foot"><span>รหัส ${q.id}</span><button class="text-btn" data-open-question="${q.id}">ฝึกข้อนี้ →</button></div></article>`).join("")}</div>`;
}

function quizView() {
  const quiz = state.currentQuiz;
  const q = state.questions.find(x=>x.id===quiz.ids[quiz.index]);
  if (!q) return `<div class="panel">ไม่พบข้อสอบ <button class="btn" data-action="end-quiz">กลับคลังข้อสอบ</button></div>`;
  const chosen = state.selected;
  return `<div class="quiz-top"><button class="text-btn" data-action="end-quiz">← ออกจากชุดฝึก</button><span>ข้อ ${quiz.index+1} / ${quiz.ids.length}</span></div>
    <div class="quiz-progress"><i style="width:${(quiz.index/quiz.ids.length)*100}%"></i></div>
    <div class="quiz-card"><div class="q-meta"><span>${esc(q.topic)}</span><span>${esc(q.subtopic)}</span><span class="level">${esc(q.difficulty)}</span></div><div class="quiz-question">${esc(q.question)}</div>
    <div class="answer-list">${q.options.map((o,i)=>`<button class="answer-option ${chosen===i?"chosen":""} ${state.feedback!==null&&i===q.answer?"correct":""} ${state.feedback!==null&&chosen===i&&chosen!==q.answer?"incorrect":""}" data-answer="${i}" ${state.feedback!==null?"disabled":""}><span>${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join("")}</div>
    ${state.feedback!==null?`<div class="explanation ${state.feedback?"right":"wrong"}"><b>${state.feedback?"ถูกต้อง!":"ยังไม่ถูกต้อง — มาทบทวนกัน"}</b><p>${esc(q.explanation)}</p></div>`:""}
    <div class="quiz-actions">${state.feedback===null?`<button class="btn primary" data-action="check-answer" ${chosen===null?"disabled":""}>ตรวจคำตอบ</button>`:`<button class="btn primary" data-action="next-question">${quiz.index===quiz.ids.length-1?"ดูผลสรุป":"ข้อต่อไป →"}</button>`}</div></div>`;
}

function progress() {
  const total = state.attempts.length, correct = state.attempts.filter(a=>a.isCorrect).length;
  const byTopic = [...new Set(state.questions.map(q=>q.topic))].map(topic=>{
    const rows=state.attempts.filter(a=>a.topic===topic);
    return {topic,total:rows.length,correct:rows.filter(a=>a.isCorrect).length};
  });
  const sessions = [...state.sessions].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,10);
  return `<div class="page-intro"><div><h2>วัดผลและค้นหาจุดที่ต้องทบทวน</h2><p>ระบบบันทึกคำตอบและเวลาอ่านไว้ในเบราว์เซอร์เครื่องนี้</p></div></div>
    <div class="progress-summary"><div><span>จำนวนคำตอบทั้งหมด</span><b>${total}</b></div><div><span>ตอบถูก</span><b class="good">${correct}</b></div><div><span>ความถูกต้อง</span><b>${total?Math.round(correct/total*100):0}%</b></div></div>
    <div class="panel"><div class="panel-head"><h3>ผลแยกตามหมวดวิชา</h3><span class="muted">TOPIC ANALYSIS</span></div>
    ${byTopic.map(x=>`<div class="performance-row"><div class="performance-label"><b>${esc(x.topic)}</b><span>${x.correct}/${x.total} ถูก</span></div><div class="wide-track"><i style="width:${x.total?x.correct/x.total*100:0}%"></i></div></div>`).join("")}</div>
    <div class="panel session-panel"><div class="panel-head"><h3>บันทึกเวลาอ่านหนังสือ</h3><span class="muted">STUDY LOG</span></div><form id="session-form" class="session-form"><label>วันที่<input type="date" name="date" value="${new Date().toISOString().slice(0,10)}" required></label><label>เวลา (นาที)<input type="number" name="minutes" min="1" max="1440" value="60" required></label><label>หัวข้อที่อ่าน<input name="note" placeholder="เช่น Retinoscopy"></label><button class="btn primary" type="submit">บันทึกเวลาอ่าน</button></form>
    ${sessions.length?sessions.map(s=>`<div class="log-row"><span>${fmtDate(s.createdAt)}</span><b>${s.minutes} นาที</b><span>${esc(s.note||"อ่านทบทวน")}</span></div>`).join(""):`<div class="empty-small">ยังไม่มีบันทึกเวลาอ่าน</div>`}</div>`;
}

function plan() {
  const weeks = [
    ["Foundation","Optics · Visual acuity · Refraction","ทบทวนสูตรและหลักการพื้นฐาน ทำโจทย์สั้นทุกวัน"],
    ["Clinical Skills","Retinoscopy · Subjective refraction · Binocular vision","ฝึกขั้นตอนตรวจและการแปลผล พร้อมเขียนเหตุผล"],
    ["Clinical Knowledge","Ocular disease · Contact lens · Pharmacology","เน้น red flags, differential diagnosis และการส่งต่อ"],
    ["Exam Practice","Mixed cases · Timed mock tests · Weak areas","ทำข้อสอบจับเวลา วิเคราะห์ข้อผิดพลาด และวนทบทวน"]
  ];
  return `<div class="page-intro"><div><h2>แผนเตรียมสอบถึงกรกฎาคม 2570</h2><p>โครงสร้าง 4 ช่วง ปรับความเข้มข้นตามพื้นฐานและตารางฝึกงานของปอม</p></div><span class="goal-pill">เป้าหมาย 1–2 ชม./วัน</span></div>
    <div class="plan-grid">${weeks.map((w,i)=>`<div class="plan-card"><div class="plan-number">0${i+1}</div><div class="plan-period">${["ช่วงที่ 1","ช่วงที่ 2","ช่วงที่ 3","ช่วงที่ 4"][i]}</div><h3>${w[0]}</h3><b>${w[1]}</b><p>${w[2]}</p><div class="plan-check"><span>กิจวัตรแนะนำ</span><span>อ่าน 45–60 นาที · ทำโจทย์ 20–30 นาที · ทบทวน 10 นาที</span></div></div>`).join("")}</div>
    <div class="notice"><span>✦</span><div><b>หลักการวางแผน</b><p>ช่วงแรกเน้นความเข้าใจ ช่วงกลางเชื่อมโยงกับเคสคลินิก และช่วงท้ายทำข้อสอบแบบจับเวลา แผนนี้เป็นโครงร่างเบื้องต้น ควรปรับตามประกาศหัวข้อสอบและผลประเมินจริง</p></div></div>`;
}

function settingsPage() {
  return `<div class="page-intro"><div><h2>ข้อมูลของปอมและการสำรองข้อมูล</h2><p>ข้อมูลทั้งหมดเก็บในเบราว์เซอร์เครื่องนี้ ไม่มีบัญชีออนไลน์และไม่มีการส่งข้อมูลขึ้นเซิร์ฟเวอร์</p></div></div>
    <div class="settings-grid">
      <div class="panel"><div class="panel-head"><h3>พื้นที่จัดเก็บในเบราว์เซอร์</h3><span class="muted">INDEXEDDB</span></div><div class="storage-number" id="storage-number">กำลังตรวจสอบ…</div><div class="wide-track"><i id="storage-bar" style="width:0%"></i></div><p class="help-text" id="storage-detail">พื้นที่ที่ใช้และโควตาขึ้นกับเบราว์เซอร์ อุปกรณ์ และพื้นที่ว่าง ไม่ได้กำหนดตายตัวที่ 50 MB</p><button class="btn secondary" data-action="persist">ขอให้เบราว์เซอร์เก็บข้อมูลถาวร</button><p class="help-text" id="persist-status"></p></div>
      <div class="panel"><div class="panel-head"><h3>สำรองและกู้คืนข้อมูล</h3><span class="muted">BACKUP</span></div><p>ดาวน์โหลดไฟล์ JSON เพื่อเก็บไว้นอกอุปกรณ์ เช่น Google Drive, iCloud หรือแฟลชไดรฟ์</p><div class="backup-actions"><button class="btn primary" data-action="export">↓ ดาวน์โหลดไฟล์สำรอง</button><label class="btn secondary upload-label">↑ นำเข้าไฟล์สำรอง<input id="import-file" type="file" accept="application/json,.json" hidden></label></div><p class="help-text">การสำรองอัตโนมัติภายในแอปเป็นเพียง snapshot ในเบราว์เซอร์เดียวกัน ไม่ใช่ cloud backup และไม่ช่วยหากข้อมูลเบราว์เซอร์ถูกลบ</p><div id="backup-status" class="status-line"></div></div>
    </div>
    <div class="panel"><div class="panel-head"><h3>การตั้งค่าแอป</h3><span class="muted">PREFERENCES</span></div><div class="setting-row"><div><b>ชื่อผู้เรียน</b><small>โปรไฟล์ในเครื่องนี้</small></div><input id="learner-name" value="${esc(state.settings.learner)}"></div><div class="setting-row"><div><b>ภาษา</b><small>แสดงโจทย์สองภาษาไทยและอังกฤษ</small></div><span class="tag">THAI + ENGLISH</span></div><div class="setting-row"><div><b>ข้อมูลเริ่มต้น</b><small>ชุดคำถามตัวอย่างสำหรับฝึกหลักการ</small></div><span class="tag">${state.questions.length} ข้อ</span></div><button class="btn secondary" data-action="save-settings">บันทึกการตั้งค่า</button></div>
    <div class="notice warning"><span>!</span><div><b>ข้อควรระวังสำคัญ</b><p>หากล้างข้อมูลเว็บไซต์ เปลี่ยนเบราว์เซอร์ เปลี่ยนอุปกรณ์ หรืออุปกรณ์เสีย ข้อมูลในเครื่องอาจหายได้ ควรดาวน์โหลดไฟล์สำรองเป็นระยะ โดยเฉพาะหลังเพิ่มข้อสอบหรือทำข้อสอบจำนวนมาก</p></div></div>`;
}

function bindPageEvents() {
  app.querySelectorAll("[data-page]").forEach(b => b.addEventListener("click", () => { state.page=b.dataset.page; render(); }));
  app.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click",()=>{state.filter=b.dataset.filter;render();}));
  app.querySelectorAll("[data-open-question]").forEach(b => b.addEventListener("click",()=>startQuiz([b.dataset.openQuestion])));
  app.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>{if(state.feedback===null){state.selected=Number(b.dataset.answer);render();}}));
  app.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>handleAction(b.dataset.action)));
  const sf=$("#session-form");
  if(sf) sf.addEventListener("submit", async e=>{
    e.preventDefault(); const fd=new FormData(sf);
    const record={createdAt:new Date(fd.get("date")+"T12:00:00").toISOString(),minutes:Number(fd.get("minutes")),note:String(fd.get("note")||"")};
    await storage.add("sessions",record); await storage.snapshot(); state.sessions=await storage.getAll("sessions"); render();
  });
  const importInput=$("#import-file");
  if(importInput) importInput.addEventListener("change",importBackup);
  const learner=$("#learner-name");
  if(learner) learner.addEventListener("change",()=>{state.settings.learner=learner.value.trim()||"Pom";});
  if(state.page==="settings") updateStorageMeter();
}

function startQuiz(ids) {
  const pool=ids || state.questions.map(q=>q.id).sort(()=>Math.random()-.5).slice(0,Math.min(10,state.questions.length));
  state.currentQuiz={ids:pool,index:0,correct:0};
  state.selected=null; state.feedback=null; state.page="practice"; render();
}

async function handleAction(action) {
  if(action==="start-quiz") startQuiz();
  if(action==="end-quiz"){state.currentQuiz=null;state.feedback=null;render();}
  if(action==="check-answer"){
    if(state.selected===null)return;
    const q=state.questions.find(x=>x.id===state.currentQuiz.ids[state.currentQuiz.index]);
    const isCorrect=state.selected===q.answer;
    state.feedback=isCorrect;
    if(isCorrect)state.currentQuiz.correct++;
    await storage.add("attempts",{questionId:q.id,topic:q.topic,selected:state.selected,correctAnswer:q.answer,isCorrect,createdAt:new Date().toISOString()});
    await storage.snapshot();
    state.attempts=await storage.getAll("attempts"); render();
  }
  if(action==="next-question"){
    if(state.currentQuiz.index<state.currentQuiz.ids.length-1){state.currentQuiz.index++;state.selected=null;state.feedback=null;render();}
    else{
      const score=state.currentQuiz.correct, count=state.currentQuiz.ids.length;
      state.currentQuiz=null;state.feedback=null;render();
      showToast(`จบชุดฝึกแล้ว: ${score}/${count} ข้อ (${Math.round(score/count*100)}%)`);
    }
  }
  if(action==="export") await exportBackup();
  if(action==="persist"){
    const status=$("#persist-status");
    if(navigator.storage?.persist){const ok=await navigator.storage.persist();status.textContent=ok?"เบราว์เซอร์อนุญาตให้เก็บข้อมูลแบบ persistent แล้ว":"เบราว์เซอร์ยังไม่อนุญาต persistent storage แต่ยังใช้งานได้ตามปกติ";}
    else status.textContent="เบราว์เซอร์นี้ไม่รองรับการขอ persistent storage";
  }
  if(action==="save-settings"){
    state.settings.learner=$("#learner-name")?.value.trim()||"Pom";
    await storage.put("settings",{id:"main",value:state.settings});
    await storage.snapshot(); showToast("บันทึกการตั้งค่าแล้ว");
  }
}

async function exportBackup() {
  try{
    const data=await storage.exportAll();
    const payload={app:"Pom Optometry Academy",schemaVersion:1,createdAt:new Date().toISOString(),data};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url;a.download=`pom-optometry-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
    showToast("สร้างไฟล์สำรองแล้ว กรุณาเก็บไฟล์ไว้ในที่ปลอดภัย");
  }catch(e){showToast("สำรองข้อมูลไม่สำเร็จ: "+e.message,true);}
}

async function importBackup(event) {
  const file=event.target.files?.[0]; if(!file)return;
  const status=$("#backup-status");
  try{
    if(file.size>20*1024*1024)throw new Error("ไฟล์ใหญ่เกิน 20 MB");
    const payload=JSON.parse(await file.text());
    if(payload.app!=="Pom Optometry Academy"||payload.schemaVersion!==1||!payload.data)throw new Error("รูปแบบไฟล์หรือเวอร์ชันไม่ถูกต้อง");
    for(const name of ["questions","attempts","sessions","settings","backups"]){
      if(payload.data[name]!==undefined&&!Array.isArray(payload.data[name]))throw new Error(`ข้อมูล ${name} ไม่ถูกต้อง`);
    }
    const mode=confirm("กด OK เพื่อรวมข้อมูลกับข้อมูลเดิม หรือ Cancel เพื่อแทนที่ข้อมูลเดิมทั้งหมดในหมวดที่อยู่ในไฟล์")?"merge":"replace";
    await storage.importAll(payload.data,mode);
    state.questions=await storage.getAll("questions");state.attempts=await storage.getAll("attempts");state.sessions=await storage.getAll("sessions");
    status.textContent=mode==="merge"?"นำเข้าแบบรวมข้อมูลสำเร็จ":"นำเข้าและแทนที่ข้อมูลสำเร็จ";
    render();
  }catch(e){if(status)status.textContent="นำเข้าไม่สำเร็จ: "+e.message;}
  event.target.value="";
}

async function updateStorageMeter() {
  const n=$("#storage-number"), detail=$("#storage-detail"), bar=$("#storage-bar");
  if(!n)return;
  try{
    if(navigator.storage?.estimate){
      const est=await navigator.storage.estimate(), used=est.usage||0, quota=est.quota||0, pct=quota?Math.min(100,used/quota*100):0;
      n.textContent=`${(used/1024/1024).toFixed(2)} MB`;
      detail.textContent=quota?`ใช้ไปประมาณ ${(used/1024/1024).toFixed(2)} MB จากโควตาที่เบราว์เซอร์รายงาน ${(quota/1024/1024).toFixed(1)} MB (ตัวเลขอาจเปลี่ยนได้)`:"เบราว์เซอร์ไม่รายงานโควตาพื้นที่จัดเก็บ";
      bar.style.width=pct+"%";
    }else{n.textContent="ไม่รองรับการตรวจสอบ";detail.textContent="เบราว์เซอร์นี้ไม่รองรับ Storage Estimate API";}
  }catch{n.textContent="ตรวจสอบไม่ได้";detail.textContent="ไม่สามารถอ่านข้อมูลพื้นที่จัดเก็บได้ในขณะนี้";}
}

function showToast(message,error=false){
  const old=$(".toast");if(old)old.remove();
  const el=document.createElement("div");el.className="toast"+(error?" error":"");el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),3500);
}

init();
