/* Teacher-only warm-up. Group tablets remain on the waiting screen until START READING. */
(()=>{
  const root=el('section',undefined,'teacher-warmup');
  root.id='teacher-warmup';
  const roomLine=document.querySelector('.teacher .room-line');
  roomLine.after(root);
  const steps=['LEAD-IN','QUICK CHECK','HOT POTATO','START READING'];
  const words=[
    ['persistently','repeatedly and with determination'],
    ['reluctant','unwilling or not eager to do something'],
    ['prioritize','treat something as more important'],
    ['contribute','give time, effort or skill to help'],
    ['underestimate','think something is less important than it is'],
    ['draw on','use past experience or knowledge to help']
  ];
  const rightOrder=[1,5,3,2,0,4],matches=[4,0,3,2,5,1];
  const sentences=[
    ['Leo was','persistently','encouraged to join a clean-up.'],
    ['He had previously been','reluctant','to speak to a group.'],
    ['Maya reduced her volunteering to','prioritize','schoolwork.'],
    ['Leo uses a free-time skill to','contribute','to the organization.'],
    ['Oliver can','draw on','an earlier experience in his role.'],
    ['Sofia had initially','underestimated','the value of charity-shop work.']
  ];
  let context='',warm={stage:0,match:0,pairs:0};
  const stateKey=()=>context?'teacherWarmup:'+context:'';
  function load(s){
    const next=s.roomId+':'+s.round;
    if(next===context)return;
    context=next;
    try{warm={stage:0,match:0,pairs:0,...JSON.parse(sessionStorage.getItem(stateKey()))};}catch{warm={stage:0,match:0,pairs:0};}
  }
  function save(){sessionStorage.setItem(stateKey(),JSON.stringify(warm));}
  function setStage(n){warm.stage=Math.max(0,Math.min(3,n));save();draw();}
  function button(text,handler,kind=''){const b=el('button',text,kind);b.onclick=handler;return b;}
  function shell(title,kicker){
    root.replaceChildren();
    const nav=el('nav',undefined,'warmup-nav');
    steps.forEach((name,i)=>{const b=button((i+1)+' · '+name,()=>setStage(i),i===warm.stage?'active':i<warm.stage?'done':'');nav.append(b);});
    const head=el('header',undefined,'warmup-head');head.append(el('p',kicker,'warmup-kicker'),el('h2',title));
    root.append(nav,head);
  }
  function lead(){
    shell('What could you contribute most?','LEAD-IN · THINK, CHOOSE, SPEAK');
    const choices=el('div',undefined,'warmup-lead-choices');
    [['🧰','Practical organization skills'],['📣','Communication and media work'],['💛','Care and patience'],['🧭','Leadership and teaching']].forEach(([icon,text])=>{const c=el('div',undefined,'warmup-lead-choice');c.append(el('span',icon),el('strong',text));choices.append(c);});
    const talk=el('section',undefined,'warmup-talk');
    const instructions=el('p','1 · CHOOSE ONE     2 · DISCUSS WITH YOUR TEAMMATE     ⏱ 90 SECONDS','warmup-instructions');
    const frame=el('p','I chose ______ because ______.','warmup-frame');
    const example=el('p',undefined,'warmup-example');example.append(el('small','EXAMPLE'),document.createTextNode('I chose care and patience because I am good at listening to people.'));
    talk.append(instructions,frame,example);
    const footer=el('footer',undefined,'warmup-footer');footer.append(el('span','Student tablets are waiting. · 学生平板保持等待'),button('QUICK CHECK →',()=>setStage(1)));
    root.append(choices,talk,footer);
  }
  function linePaths(board){
    const svg=board.querySelector('svg'),box=board.getBoundingClientRect();
    svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);svg.replaceChildren();
    board.querySelectorAll('.warmup-word').forEach((item,i)=>{
      const target=board.querySelector(`.warmup-meaning[data-position="${matches[i]}"]`),a=item.getBoundingClientRect(),b=target.getBoundingClientRect();
      const x1=a.right-box.left,y1=a.top+a.height/2-box.top,x2=b.left-box.left,y2=b.top+b.height/2-box.top,mid=(x1+x2)/2;
      const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);p.classList.toggle('shown',i<warm.match);p.setAttribute('data-line',i);svg.append(p);
    });
  }
  function vocab(){
    shell('Match the words to their meanings.','VOCABULARY · SAY IT, THEN REVEAL IT');
    const board=el('section',undefined,'warmup-match-board'),left=el('div',undefined,'warmup-match-column'),right=el('div',undefined,'warmup-match-column meanings');
    words.forEach(([word],i)=>{const c=el('div',undefined,'warmup-match-card warmup-word'+(i<warm.match?' revealed':''));c.dataset.word=i;c.append(el('span',String(i+1)),el('strong',word));left.append(c);});
    rightOrder.forEach((wordIndex,position)=>{const c=el('div',undefined,'warmup-match-card warmup-meaning'+(matches[wordIndex]===position&&wordIndex<warm.match?' revealed':''));c.dataset.position=position;c.append(el('span',String.fromCharCode(65+position)),el('strong',words[wordIndex][1]));right.append(c);});
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('warmup-match-lines');board.append(left,svg,right);
    const next=button(warm.match<6?'REVEAL NEXT MATCH →':'HOT POTATO →',()=>{if(warm.match<6){warm.match++;save();draw();}else setStage(2);});
    const footer=el('footer',undefined,'warmup-footer');footer.append(el('span',(warm.match||0)+' / 6 matches revealed'),next);root.append(board,footer);
    requestAnimationFrame(()=>linePaths(board));
  }
  function monsterBall(){
    const wrap=el('div',undefined,'monster-ball-wrap'),photo=el('img');photo.src='/monster-red-ball.png?v=recommended10';photo.alt='Red Mayday Monster ball';
    const left=el('span',undefined,'monster-eye left'),right=el('span',undefined,'monster-eye right');wrap.append(photo,left,right);return wrap;
  }
  function hot(){
    shell('Pass it. Stop. Answer two.','HOT POTATO · SIX SENTENCES');
    const top=el('section',undefined,'hot-potato-top'),how=el('div',undefined,'hot-potato-how');
    how.append(el('h3','HOW TO PLAY'),el('div',undefined,'hot-potato-steps'));
    const stepsBox=how.lastElementChild;
    [['1','PASS THE RED BALL','传球'],['2','MUSIC STOPS','老师暂停音乐'],['3','ANSWER TWO','回答两题']].forEach(([n,en,zh])=>{const s=el('div');s.append(el('b',n),el('strong',en),el('small',zh));stepsBox.append(s);});
    top.append(monsterBall(),how);
    const grid=el('div',undefined,'hot-potato-grid');
    sentences.forEach((parts,i)=>{const card=el('article',undefined,'hot-sentence'+(i<warm.pairs*2?' revealed':''));const text=el('p');text.append(document.createTextNode(parts[0]+' '),el('strong',i<warm.pairs*2?parts[1]:'__________','hot-answer'),document.createTextNode(' '+parts[2]));card.append(el('span',String(i+1),'hot-number'),text);if(i<warm.pairs*2)card.append(el('span','✓','hot-check'));grid.append(card);});
    const next=button(warm.pairs<3?`REVEAL ${warm.pairs*2+1}–${warm.pairs*2+2} →`:'READY TO READ →',()=>{if(warm.pairs<3){warm.pairs++;save();draw();}else setStage(3);});
    const footer=el('footer',undefined,'warmup-footer');footer.append(el('span','All six sentences stay on screen. · 每轮公布两题'),next);root.append(top,grid,footer);
  }
  function ready(){
    shell('Ready for the reading challenge?','WARM-UP COMPLETE');
    const card=el('section',undefined,'warmup-ready');card.append(el('div','✓','warmup-ready-check'),el('h3','Lead-in complete'),el('h3','Vocabulary checked'),el('h3','Hot Potato complete'),el('p','When you start reading, all group tablets will open SKIM automatically.'),el('small','点击后，学生平板会自动进入阅读活动。'));
    const start=button('START READING →',()=>action('teacher:start'),'warmup-start-reading');start.disabled=busy||!socket.connected;card.append(start);root.append(card);
  }
  function draw(){[lead,vocab,hot,ready][warm.stage]();}
  function hideStandard(showWarmup){
    root.hidden=!showWarmup;
    ['lesson-panel','paper-exit','record-tools','demo-panel','interaction-guide','progress','results'].forEach(id=>{const node=$(id);if(node&&showWarmup)node.hidden=true;});
    const actions=document.querySelector('.teacher .actions');if(actions)actions.hidden=showWarmup;
    const note=$('stage-note');if(note&&showWarmup)note.hidden=true;
    if(showWarmup){$('activity-title').textContent='CLASS WARM-UP';$('steps').hidden=true;document.body.dataset.lessonStage='warmup';}
  }
  const original=render;
  render=function(s){original(s);load(s);const active=s.classStarted===false;hideStandard(active);if(active)draw();};
  socket.off('room:state');socket.on('room:state',render);
})();
