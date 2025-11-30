// app.js — simple client-side canned chat logic + UI behaviors

const CANNED = [
  { triggers: ["hi","hello","hey"], reply: "Hello — I’m **PY-X**, your AI Co-Founder. Tell me your skills, budget and location (e.g., 'I know video editing, ₹10,000, Ranchi')." },
  { triggers: ["i know","skills","skill"], reply: "Suggested ideas: 1) Short-form editing agency\n2) Cloud kitchen\n3) Creator branding studio\nType '1'/'2'/'3' to build." },
  { triggers: ["1"], reply: "Plan: Short-form editing agency — Target creators & SMBs; pricing ₹800–1500/video; break-even ~4 months." },
  { triggers: ["finance","projection"], reply: "12-mo snapshot: Starting revenue ₹22k/mo; margin ~42%; 12-mo profit est. ₹1.2L." },
  { triggers: ["simulate","6 months"], reply: "6-mo sim: Revenue ₹1.2–1.5L; growth score 84/100. Focus: content ads + outreach." },
  { triggers: ["legal","register"], reply: "Legal: Start as Sole / Udyam MSME. Docs: Aadhaar, PAN, bank proof." }
];

const chatArea = document.getElementById('chatArea');
const msgIn = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typing = document.getElementById('typing');

function now(){
  const d = new Date();
  return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function seedStarter(){
  // seed a short conversation immediately so box never looks empty
  appendAssistant("Hello — I’m <b>PY-X</b>, your AI Co-Founder. Tell me your skills, budget and location (e.g., 'I know video editing, ₹10,000, Ranchi'). <i>Tip: use short canned commands for demo flow.</i>");
  appendUser("I know video editing, ₹10,000, Ranchi");
  appendAssistant("Thanks — generating validated ideas... Type '1' to build plan for idea 1. <small>"+now()+"</small>");
  chatArea.scrollTop = chatArea.scrollHeight;
}

function findCanned(text){
  const t = text.toLowerCase();
  for(const c of CANNED){
    for(const k of c.triggers){
      if(t.includes(k)) return c.reply;
    }
  }
  return null;
}

function showTypingBrief(cb){
  typing.style.display = 'flex';
  setTimeout(()=>{ typing.style.display='none'; cb(); }, 600);
}

function appendAssistant(html){
  const wrap = document.createElement('div'); wrap.className='message assistant';
  const avatar = document.createElement('div'); avatar.className='msg-avatar'; avatar.textContent='PY';
  const content = document.createElement('div'); content.className='content'; content.innerHTML = html;
  wrap.appendChild(avatar); wrap.appendChild(content);
  chatArea.appendChild(wrap);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function appendUser(text){
  const wrap = document.createElement('div'); wrap.className='message user';
  const content = document.createElement('div'); content.className='content'; content.textContent = text + "  ("+now()+")";
  wrap.appendChild(content);
  chatArea.appendChild(wrap);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function handleSend(){
  const text = msgIn.value.trim();
  if(!text) return;
  appendUser(text);
  msgIn.value = '';
  // simulate typing + response
  const canned = findCanned(text);
  showTypingBrief(()=>{
    if(canned){
      // keep simple markup safe (replace **bold**)
      const html = canned.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') + " <small>" + now() + "</small>";
      appendAssistant(html);
    } else {
      appendAssistant("I didn't catch that. Try: 'I know video editing', '1', 'finance', 'simulate', 'legal'. <small>"+now()+"</small>");
    }
  });
}

// events
sendBtn.addEventListener('click', handleSend);
msgIn.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleSend(); } });

// seed once on load
window.addEventListener('DOMContentLoaded', seedStarter);
