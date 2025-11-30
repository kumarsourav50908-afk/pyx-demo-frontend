// app.js — upgraded: invites banner + hybrid bubbles + premium UX

const CANNED = [
  { triggers: ["hi","hello","hey"], reply: "Hello — I’m <b>PY-X</b>, your AI Co-Founder. Tell me your skills, budget and location (e.g., 'I know video editing, ₹10,000, Ranchi')." },
  { triggers: ["i know","skills","skill"], reply: "Suggested ideas: <br/>1) Short-form editing agency<br/>2) Cloud kitchen<br/>3) Creator branding studio<br/><br/>Type '<b>1</b>'/'<b>2</b>'/'<b>3</b>' to build." },
  { triggers: ["1"], reply: "Plan: <b>Short-form editing agency</b> — Target creators & SMBs; pricing ₹800–1,500/video; break-even ~4 months." },
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

// create invite banner DOM node
function injectInviteBanner(){
  const banner = document.createElement('div');
  banner.className = 'invite-banner';
  banner.innerHTML = `
    <div class="invite-left">PY</div>
    <div style="flex:1">
      <div class="invite-text"><strong>Grow your startup with us</strong> — Meet <strong>PY-X</strong>, your AI Co-Founder</div>
      <div class="invite-sub">Fast idea validation • CA-style financials • Legal & investor guidance</div>
    </div>
    <div style="margin-left:12px"><button id="startDemoBtn" style="background: linear-gradient(90deg,#2b8cff,#1f6feb); border:none; color:white; padding:8px 12px; border-radius:999px; cursor:pointer; font-weight:700">Try Quick Demo</button></div>
  `;
  chatArea.appendChild(banner);

  // start demo quick button
  document.getElementById('startDemoBtn').addEventListener('click', ()=> {
    // remove banner with fade
    banner.style.transition = 'opacity .25s ease, height .25s ease';
    banner.style.opacity = 0;
    setTimeout(()=> banner.remove(), 260);
    // then seed starter conversation
    seedStarter();
  });
}

// seed starter conversation (keeps chat non-empty)
function seedStarter(){
  appendAssistant("Hello — I’m <b>PY-X</b>, your AI Co-Founder. Tell me your skills, budget and location (e.g., 'I know video editing, ₹10,000, Ranchi'). <i>Tip: use short canned commands for a smooth demo.</i>");
  appendUser("I know video editing, ₹10,000, Ranchi");
  appendAssistant("Thanks — generating validated ideas... Type '1' to build plan for idea 1. <small>" + now() + "</small>");
  chatArea.scrollTop = chatArea.scrollHeight;
}

// find canned reply
function findCanned(text){
  const t = text.toLowerCase();
  for(const c of CANNED){
    for(const k of c.triggers){
      if(t.includes(k)) return c.reply;
    }
  }
  return null;
}

// show typing briefly then callback
function showTypingBrief(cb){
  typing.style.display = 'flex';
  setTimeout(()=>{ typing.style.display='none'; cb(); }, 650);
}

// append assistant message (light bubble)
function appendAssistant(html){
  const wrap = document.createElement('div'); wrap.className='message assistant';
  const avatar = document.createElement('div'); avatar.className='msg-avatar'; avatar.textContent='PY';
  const content = document.createElement('div'); content.className='content'; content.innerHTML = html;
  wrap.appendChild(avatar); wrap.appendChild(content);
  chatArea.appendChild(wrap);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// append user message (dark bubble)
function appendUser(text){
  const wrap = document.createElement('div'); wrap.className='message user';
  const content = document.createElement('div'); content.className='content'; content.textContent = text + "  ("+now()+")";
  wrap.appendChild(content);
  chatArea.appendChild(wrap);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// on send
function handleSend(){
  const text = msgIn.value.trim();
  if(!text) return;
  appendUser(text);
  msgIn.value = '';
  const canned = findCanned(text);
  showTypingBrief(()=>{
    if(canned){
      const html = canned.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') + " <small>" + now() + "</small>";
      appendAssistant(html);
    } else {
      appendAssistant("I didn't catch that. Try: 'I know video editing', '1', 'finance', 'simulate', 'legal'. <small>" + now() + "</small>");
    }
  });
}

// events
sendBtn.addEventListener('click', handleSend);
msgIn.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleSend(); } });

// on load: inject banner + keep chat empty until user clicks quick demo
window.addEventListener('DOMContentLoaded', ()=>{
  injectInviteBanner();
  // optional: if you prefer auto-seed (remove comment)
  // seedStarter();
});
