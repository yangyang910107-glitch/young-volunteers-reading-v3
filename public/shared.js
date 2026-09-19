const $=id=>document.getElementById(id),socket=io();
function el(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
function readStore(k,f=null){try{return JSON.parse(sessionStorage.getItem(k))??f;}catch{return f;}}
function error(m=''){$('error').textContent=m;}
function request(e,p){return new Promise((r,j)=>{if(!socket.connected)return j(Error('Wait for reconnection.'));socket.timeout(6000).emit(e,p,(err,x)=>err?j(Error('No response. Try again.')):x.ok?r(x):j(Error(x.error)));});}
function stageHeading(s){
  document.body.dataset.lessonStage=s.stage;
  document.body.classList.toggle('lesson-revealed',!!s.revealed);
  document.body.classList.toggle('vocabulary-stage',['vocabMatch','vocabUse'].includes(s.stage));
  const student=!!$('student-demo'),demo=['demo','bridgeDemo'].includes(s.stage);
  const shortTitles={summary:'RECAPTURE',lead:'CONTRIBUTE',vocabMatch:'WORD MATCH',vocabUse:'WORD USE',gist:'SKIM',demo:'DEMO 0',keys:'KEY IDEAS',bridgeDemo:'BRIDGE DEMO',combined:'TEXT BRIDGE',peer:'PEER CHECK',response:'YOUR ROLE',exit:s.exitMode==='homework'?'EXIT TICKET · HOMEWORK':'EXIT TICKET',awards:'MATCHING SUPERPOWERS',homework:'WRAP UP'};
  const stages=STAGES.filter(p=>!['demo','bridgeDemo'].includes(p.id));
  const current=s.stage==='demo'?'keys':s.stage==='bridgeDemo'?'combined':s.stage;
  let index=stages.findIndex(p=>p.id===current);
  if(s.finalOrder==='awards-first'&&current==='awards')index=stages.findIndex(p=>p.id==='exit');
  if(s.finalOrder==='awards-first'&&current==='exit')index=stages.findIndex(p=>p.id==='awards');
  $('steps').hidden=true;$('steps').replaceChildren();
  if(student){
    $('activity-title').textContent=(index+1)+'. '+(shortTitles[current]||STAGES.find(p=>p.id===current)?.title||'ACTIVITY');
    document.querySelector('.heading .eyebrow').textContent=demo?'TEACHER DEMO · WATCH THE CLASSROOM SCREEN':'DISCUSS TOGETHER · ONE ANSWER PER GROUP';
  }else{
    $('activity-title').textContent=demo?'EXAMPLE 0 · '+(s.stage==='demo'?'KEY IDEA':'TEXT BRIDGE'):(index+1)+'. '+(shortTitles[current]||STAGES.find(p=>p.id===current)?.title||'ACTIVITY');
  }
}
function sentenceText(id){return [...SENTENCES,...EVIDENCE_UNITS].find(s=>s.id===id)?.text||id;}
function personText(id){const p=PROFILES.find(p=>p.id===id);return p?id+' · '+p.name:'—';}
function evidenceBlock(ids=[]){const b=el('div',undefined,'evidence-block');ids.forEach(id=>b.append(el('p',sentenceText(id))));return b;}
const DEMO_QUESTION=DEMO_SOURCE.question;
function keyLabel(k,exit=false){return Number.isInteger(k)&&KEYS[k]!==undefined?(KEY_OPTION_IDS.indexOf(k)+1)+'. '+KEYS[k]:'—';}
function showReading(container,profile,ids=[],change=null,disabled=false){container.replaceChildren(...PROFILES.filter(p=>p.id===profile).map(p=>{const a=el('article',undefined,'profile'),text=el('p',undefined,'article-paragraph');a.append(el('h3',p.id+' '+p.name+': '+p.instrument));EVIDENCE_UNITS.filter(u=>u.who===p.id).forEach((u,i)=>{const s=u.text,id=u.id,span=el('span',undefined,'sentence'+((ids.includes(id)||ids.includes(u.parent))?' picked':''));span.append(document.createTextNode(s+' '));if(change){span.role='button';span.tabIndex=disabled?-1:0;span.setAttribute('aria-label',s);span.setAttribute('aria-pressed',ids.includes(id));span.setAttribute('aria-disabled',disabled);span.onclick=()=>{if(!disabled)change(id,!ids.includes(id));};span.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();span.click();}};}text.append(span,document.createTextNode(' '));});a.append(text);return a;}));}
function showTabs(container,profile,change,disabled=false){container.replaceChildren(...PROFILES.map(p=>{const b=el('button',undefined,'person'+(profile===p.id?' chosen':''));b.append(el('strong',p.id),el('span',p.name),el('small',p.instrument));b.setAttribute('aria-pressed',profile===p.id);b.disabled=disabled;b.onclick=()=>change(p.id);return b;}));}
function answerTable(rows,keysOnly=false){const wrap=el('div',undefined,'answer-table-wrap'),table=el('table',undefined,'answer-table'),head=el('thead'),tr=el('tr'),body=el('tbody');(keysOnly?['Q','Question','Key Idea','Correct']:['Q','Key Idea','Text Bridge','Who','Correct']).forEach(h=>{const th=el('th',h);th.scope='col';tr.append(th);});head.append(tr);table.append(head,body);rows.forEach(a=>{const row=el('tr',undefined,a.total&&a.percent<100?'needs-discussion':''),q=el('th',TASK_LABELS[a.q]);q.scope='row';row.append(q);if(keysOnly)row.append(el('td',QUESTIONS[a.q]),el('td',keyLabel(a.key,a.q>=6)));else{const e=el('td');e.append(evidenceBlock(a.evidence));row.append(el('td',keyLabel(a.key,a.q>=6)),e,el('td',personText(a.answer)));}const rate=el('td',undefined,'table-rate');rate.append(el('strong',a.total?a.percent+'%':'—'),el('small',a.total?a.correct+' / '+a.total:'NOT SUBMITTED'));if(!keysOnly&&a.total)rate.append(el('small','Evidence '+a.evidencePercent+'% · Who '+a.whoPercent+'%'));row.append(rate);body.append(row);});wrap.append(table);return wrap;}
socket.on('connect',()=>{$('connection').textContent='● LIVE';});socket.on('disconnect',()=>{$('connection').textContent='○ RECONNECTING';});

function renderPaperExit(container){container.hidden=false;if(container.childElementCount)return;container.append(el('p','WORK ALONE','eyebrow'),el('h2','Complete h + i on your paper.'));const steps=el('ol');['Underline the key words in each question.','Write your answer: A, B, C or D.','Copy the key evidence from the article and underline the matching parts.'].forEach(t=>steps.append(el('li',t)));container.append(steps,el('p','Hand your paper to your teacher when you finish.','paper-hand-in'));}

function guestReadOnly(){return !!session?.observer && !session.practice;}
const guestClientId=sessionStorage.getItem('guestPracticeClientId')||crypto.randomUUID();sessionStorage.setItem('guestPracticeClientId',guestClientId);

const LEARNING_OBJECTIVES=[
  ['1','IDENTIFY & SIMPLIFY','Identify and simplify the key ideas in reading matching questions.'],
  ['2','LOCATE THE SAME MEANING','Locate evidence that expresses the same meaning in different words.'],
  ['3','MATCH & JUSTIFY','Match every part of the question to the text and justify the final answer with evidence.']
];
function learningObjectivesView(){
  const panel=el('section',undefined,'learning-objectives-view');
  const head=el('header',undefined,'learning-objectives-head');
  head.append(el('p','TODAY’S READING GOAL','learning-objectives-kicker'),el('h2','Learning Objectives'),el('p','Learn how to answer reading matching questions accurately by using a clear step-by-step strategy.','learning-objectives-subtitle'));
  const cards=el('div',undefined,'learning-objectives-grid');
  LEARNING_OBJECTIVES.forEach(([number,title,body])=>{const card=el('article',undefined,'learning-objective-card');card.append(el('span',number,'learning-objective-number'),el('div'));card.lastElementChild.append(el('h3',title),el('p',body));cards.append(card);});
  const route=el('div',undefined,'learning-objectives-route');
  ['KEY IDEA','SAME MEANING','EVERY PART','EVIDENCE'].forEach((label,i)=>{if(i)route.append(el('span','→','learning-route-arrow'));route.append(el('strong',label));});
  panel.append(head,cards,route);
  return panel;
}
