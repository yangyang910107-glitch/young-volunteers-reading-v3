// Shared presentation: reference answers arrive only in the teacher's reveal payload.
function coloredText(text,groups=[[],[]]){const n=el('span'),marks=Array(text.length).fill(-1);groups.forEach((terms,g)=>terms.forEach(term=>{let at=0;while((at=text.toLowerCase().indexOf(term.toLowerCase(),at))>=0){for(let i=at;i<at+term.length;i++)if(marks[i]<0)marks[i]=g;at+=term.length;}}));for(let i=0;i<text.length;){let j=i+1;while(j<text.length&&marks[j]===marks[i])j++;n.append(el('span',text.slice(i,j),marks[i]<0?'':'bridge-mark mark-'+marks[i]));i=j;}return n;}
function proofBox(text,index=-1){return el('div',text,'proof-box'+(index>=0?' proof-'+index:''));}
// One question at a time: their selection sits directly beside the reference answer.
let keyReviewQuestion=0,keyReviewContext='';
function keyComparison(rows,answers=null,markings=[]){
  const list=el('div',undefined,'key-comparison-list'),context=(state?.roomId||'view')+':'+(state?.round||0)+':'+(answers?'student':'teacher');
  if(context!==keyReviewContext){keyReviewContext=context;keyReviewQuestion=rows[0]?.q||0;}
  if(!rows.some(a=>a.q===keyReviewQuestion))keyReviewQuestion=rows[0]?.q||0;
  function draw(){
    list.replaceChildren();
    const nav=el('nav',undefined,'key-review-nav');
    rows.forEach(a=>{const b=el('button','QUESTION '+TASK_LABELS[a.q].toUpperCase(),a.q===keyReviewQuestion?'active':'');b.onclick=()=>{keyReviewQuestion=a.q;draw();};nav.append(b);});
    list.append(nav);
    const a=rows.find(row=>row.q===keyReviewQuestion);if(!a)return;
    const card=el('section',undefined,'key-comparison-card'),question=el('p',undefined,'comparison-question');
    card.append(el('small','QUESTION '+TASK_LABELS[a.q].toUpperCase()));
    if(answers)markQuestion(question,el('div'),QUESTIONS[a.q],markings[a.q]||[],null);
    else question.append(coloredText(QUESTIONS[a.q],a.reference.parts.map(t=>[t])));
    card.append(question);
    const choices=answers?[{key:answers[a.q],group:null,submitted:true}]:(a.groupKeys||[]),compare=el('div',undefined,'key-review-compare'),chosen=el('div',undefined,'chosen-key-ideas'+(answers?'':' class-key-ideas'));
    choices.filter(g=>answers||Number.isInteger(g.key)).forEach(g=>{const line=el('p',undefined,'chosen-key-idea');line.append(el('small',g.group?'GROUP '+g.group+(g.submitted?'':' · DRAFT'):'THEIR SELECTION'),el('span',Number.isInteger(g.key)?keyLabel(g.key):'Not answered yet'));if(g.submitted&&Number.isInteger(g.key))line.append(el('span',g.key===a.key?'✓':'×',g.key===a.key?'comparison-match':'comparison-revise'));chosen.append(line);});
    if(!chosen.childElementCount)chosen.append(el('p','No group choices recorded.','chosen-key-idea'));
    const arrow=el('span','→','key-review-arrow'),reference=el('p',undefined,'reference-key-idea');reference.append(el('small','REFERENCE ANSWER'),el('strong',keyLabel(a.key)));compare.append(chosen,arrow,reference);card.append(compare);list.append(card);
  }
  draw();return list;
}
function bridgeTable(rows){const table=el('table',undefined,'bridge-comparison'),head=el('thead'),h=el('tr'),body=el('tbody');['WHO?','TEXT EVIDENCE · FULL SENTENCE','COMPARE WITH THE KEY IDEA'].forEach(t=>h.append(el('th',t)));head.append(h);table.append(head,body);rows.forEach(a=>{const shown=a.revealed!==false;const tr=el('tr',undefined,shown?(a.correct?'complete-proof':'partial-proof'):'pending-proof');tr.append(el('th',personText(a.who)));const quote=el('td');quote.append(coloredText(a.text,shown?a.hits:[[],[]]));const proof=el('td');(shown?a.proof||[]:[]).forEach((t,i)=>proof.append(proofBox((a.correct?'✓ ':t.startsWith('No proof')?'✗ ':'△ ')+t,i)));if(shown)proof.append(el('strong',a.correct?'COMPLETE MATCH':'RELATED DETAILS · INCOMPLETE PROOF','proof-status'));tr.append(quote,proof);body.append(tr);});return table;}
function explanationRows(a){
  const r=a.reference,trapLabels=['b','d','f'],rows=[{correct:true,who:a.answer,text:a.evidence.map(id=>sentenceText(id)).join(' '),hits:r.matches,proof:r.proof}],extra=trapLabels.includes(TASK_LABELS[a.q])?r.distractors.filter(d=>d.hits.some(terms=>terms.length)).slice(0,2):[];
  extra.forEach(d=>{
    const text=sentenceText(d.id),hits=d.hits.map(terms=>terms.filter(term=>text.toLowerCase().includes(term.toLowerCase())));
    rows.push({correct:false,who:d.id[0],text:text,hits,proof:hits.map((terms,i)=>terms.length?terms.join(' / ')+' ↔ related to '+r.keyParts[i]:'No proof of '+r.parts[i]),note:d.note});
  });return rows;
}
// One answer per row, with matching colours across the question, evidence and explanation.
answerTable=function(rows,keysOnly=false){
  if(keysOnly)return keyComparison(rows);
  const wrap=el('div',undefined,'bridge-answer-list');
  rows.forEach(a=>{
    const card=el('section',undefined,'bridge-result'),head=el('div',undefined,'bridge-question');
    head.append(el('small','QUESTION '+TASK_LABELS[a.q].toUpperCase()+(state?.stage==='peer'?' · GROUP '+(a.q+1):'')));
    if(state?.stage==='peer'){const chosen=el('section',undefined,'review-choice');chosen.append(el('strong',a.total&&a.correct===a.total?'✓ COMPLETE MATCH':'LET’S CHECK THIS MATCH'),el('p','Selected Who: '+personText(a.reviewAnswer?.who)));card.append(chosen);} 
    head.append(coloredText(QUESTIONS[a.q],a.reference.parts.map(t=>[t])));card.append(head);
    const key=el('div',undefined,'key-idea-pair');
    key.append(el('small','KEY IDEA'),coloredText(keyLabel(a.key,a.q>=6),a.reference.keyParts.map(t=>[t])));
    card.append(key,bridgeTable(explanationRows(a)),el('p',a.explanation,'bridge-reason'));wrap.append(card);
  });return wrap;
};

const MODEL_KEYS=MODEL_OPTIONS;
function renderModel(container,s,change=null,busy=false){
  container.replaceChildren();const d=s.demo,bridge=s.stage==='bridgeDemo',phase=d.phase||0,correct=d.key===DEMO_SOURCE.key;
  container.classList.toggle('model-bridge-demo',bridge);
  if(!bridge){
    const layout=el('div',undefined,'model-key-layout'),left=el('div',undefined,'model-question'),tools=el('div'),question=el('p');
    left.append(el('small','ORIGINAL QUESTION · 0'),tools,question);
    markQuestion(question,tools,DEMO_QUESTION,d.markings||[],change&&!busy&&!d.revealed?value=>change('mark',value):null);
    if(d.key){const match=el('p',undefined,'model-match');match.append(el('small','KEY IDEA · '+(correct?'MATCHED':'CHECK THE WHOLE MEANING')),coloredText((MODEL_KEYS.indexOf(d.key)+1)+'. '+d.key,correct?DEMO_SOURCE.keyParts.map(t=>[t]):[[],[]]));left.append(match);if(correct)question.replaceChildren(coloredText(DEMO_QUESTION,DEMO_SOURCE.parts.map(t=>[t])));}
    const options=el('div',undefined,'model-options');
    MODEL_KEYS.forEach((key,i)=>{const b=el('button',(i+1)+'. '+key,'model-option'+(d.key===key?' selected-model':''));b.disabled=!change||busy||d.revealed;b.onclick=()=>change('key',key);options.append(b);});
    layout.append(left,options);container.append(layout);return;
  }
  const question=el('div',undefined,'bridge-question'),key=el('div',undefined,'key-idea-pair');
  question.append(el('small','EXAMPLE 0'),coloredText(DEMO_QUESTION,DEMO_SOURCE.parts.map(t=>[t])));
  key.append(el('small','KEY IDEA'),coloredText((MODEL_KEYS.indexOf(DEMO_SOURCE.key)+1)+'. '+DEMO_SOURCE.key,DEMO_SOURCE.keyParts.map(t=>[t])));
  question.append(key);container.append(question);

  const rows=DEMO_SOURCE.rows.map((r,i)=>({...r,text:r.ids.map(id=>sentenceText(id)).join(' '),revealed:phase>i}));
  if(change&&!d.revealed){
    const next=DEMO_SOURCE.rows[phase],p=next&&PROFILES.find(p=>p.id===next.who),b=el('button',p?'EXPLAIN '+p.id+' · '+p.name.toUpperCase()+' →':'EXAMPLE 0 COMPLETED');
    b.disabled=busy||!next;b.onclick=()=>change('phase',phase+1);container.append(b);
  }
  container.append(bridgeTable(rows));
  if(phase>=rows.length)container.append(el('div','TEXT BRIDGE · gets ready first + then leads a group · WHO: D · OLIVER','model-complete'),el('p','A complete answer needs evidence for ALL required parts. Related words or one matching detail are not enough.','bridge-reason'));
}
