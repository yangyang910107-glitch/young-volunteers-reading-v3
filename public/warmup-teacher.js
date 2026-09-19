/* Teacher-only warm-up. Group tablets remain on the waiting screen until START READING. */
(()=>{
  const root=el('section',undefined,'teacher-warmup');
  root.id='teacher-warmup';
  document.querySelector('.teacher .room-line').after(root);
  const steps=[
    ['LEAD-IN','Teammate discussion · 90 sec'],
    ['QUICK CHECK','Homework · 1–2 min'],
    ['HOT POTATO','3 rounds · answer two'],
    ['START READING','Unlock student choices']
  ];
  const words=[
    ['persistently','repeatedly and with determination'],
    ['reluctant','unwilling or not eager to do something'],
    ['prioritize','treat something as more important'],
    ['contribute','give time, effort or skill to help'],
    ['underestimate','think something is less important than it really is'],
    ['draw on','use past experience or knowledge to help']
  ];
  const rightOrder=[3,4,0,5,1,2],matches=[2,4,5,0,1,3],matchColors=['#8264a8','#4f88a8','#d56c59','#4d956e','#5e718f','#b75d83'];
  const sentences=[
    ['Leo was','persistently','encouraged to join a clean-up.'],
    ['He had previously been','reluctant','to speak to a group.'],
    ['Maya reduced her volunteering to','prioritize','schoolwork.'],
    ['Leo uses a free-time skill to','contribute','to the organization.'],
    ['Oliver can','draw on','an earlier experience in his role.'],
    ['Sofia had initially','underestimated','the value of charity-shop work.']
  ];
  let context='',latest=null,warm={started:false,stage:0,match:0,pairs:0},knownReady=new Set();
  const stateKey=()=>context?'teacherWarmup:'+context:'';
  const readyGroups=s=>s.groups.filter(g=>g.members.some(m=>m.connected)).length;
  function load(s){
    const next=s.roomId+':'+s.round;
    if(next===context)return;
    context=next;knownReady=new Set();
    try{warm={started:false,stage:0,match:0,pairs:0,...JSON.parse(sessionStorage.getItem(stateKey()))};}
    catch{warm={started:false,stage:0,match:0,pairs:0};}
  }
  function save(){sessionStorage.setItem(stateKey(),JSON.stringify(warm));}
  function focusStage(){requestAnimationFrame(()=>root.scrollIntoView({behavior:'smooth',block:'start'}));}
  function setStage(n){if(!warm.started)return;warm.stage=Math.max(0,Math.min(3,n));save();draw();focusStage();}
  function button(text,handler,kind=''){const b=el('button',text,kind);b.onclick=handler;return b;}
  function lobby(){
    root.replaceChildren();
    const ready=readyGroups(latest),head=el('header',undefined,'warmup-lobby-head');
    head.append(el('p','BEFORE WE BEGIN','warmup-kicker'),el('h2','Are your groups ready?'),el('p','到课小组会亮起；准备好就开始，缺席小组可以稍后加入。','warmup-lobby-cn'));
    const count=el('div',ready+' / 6 GROUPS READY','warmup-ready-count'+(ready===6?' all-ready':'')),grid=el('div',undefined,'warmup-lobby-grid'),now=new Set();
    latest.groups.forEach(group=>{
      const member=group.members.find(m=>m.connected),card=el('article',undefined,'warmup-lobby-card'+(member?' ready':''));
      if(member)now.add(group.id);
      if(member&&!knownReady.has(group.id))card.classList.add('just-arrived');
      card.append(el('span',member?'✓':String(group.id),'warmup-lobby-icon'),el('strong','GROUP '+group.id),el('b',member?member.name:'WAITING…'),el('small',member?'READY · 已入场':'等待平板加入'));
      grid.append(card);
    });
    knownReady=now;
    const start=button('START CLASS →',()=>{},'warmup-lobby-start');
    start.disabled=!socket.connected;start.onclick=()=>{if(!socket.connected)return;warm.started=true;save();draw();focusStage();};
    root.append(head,count,grid,start);
  }
  function stageNav(){
    const nav=el('nav',undefined,'warmup-nav');
    steps.forEach(([name,sub],i)=>{const b=button('',()=>setStage(i),i===warm.stage?'active':i<warm.stage?'done':'');b.append(el('span',String(i+1),'warmup-step-number'),el('span',undefined,'warmup-step-copy'));b.lastElementChild.append(el('strong',name),el('small',sub));nav.append(b);});
    return nav;
  }
  function shell(title,kicker,subtitle='',time=''){
    root.replaceChildren();
    const head=el('header',undefined,'warmup-head'),copy=el('div');copy.append(el('p',kicker,'warmup-kicker'),el('h2',title));if(subtitle)copy.append(el('p',subtitle,'warmup-subtitle'));head.append(copy);
    if(time){const box=el('div',undefined,'warmup-timebox'),parts=time.split('|');box.append(el('strong',parts[0]),el('small',parts[1]||''));head.append(box);}
    root.append(stageNav(),head);
  }
  function lead(){
    root.replaceChildren();root.append(stageNav());
    const grid=el('section',undefined,'warmup-lead-grid'),photo=el('img');photo.src='/lead-volunteers.jpg?v=recommended12';photo.alt='Young volunteers sorting donated items';photo.className='warmup-lead-photo';
    const prompt=el('section',undefined,'warmup-lead-prompt');prompt.append(el('p','1 · LEAD-IN','warmup-kicker'),el('h2','You are joining a volunteer team. What could you contribute most?'));
    const choices=el('div',undefined,'warmup-lead-choices');
    [['📦','Practical organization skills'],['📣','Communication and media work'],['💛','Care and patience'],['🧭','Leadership and teaching']].forEach(([icon,text])=>{const c=el('div',undefined,'warmup-lead-choice');c.append(el('span',icon),el('strong',text));choices.append(c);});
    const talk=el('section',undefined,'warmup-talk');
    const directions=el('p',undefined,'warmup-instructions');directions.append(el('span','CHOOSE ONE'),el('i','→'),el('span','DISCUSS WITH YOUR TEAMMATE'),el('i','→'),el('span','90 SECONDS'));talk.append(directions,el('p','I chose ______ because ______.','warmup-frame'));
    const example=el('p',undefined,'warmup-example');example.append(el('small','EXAMPLE'),document.createTextNode('I chose care and patience because I am good at listening to people.'));talk.append(example);
    prompt.append(choices,talk);grid.append(photo,prompt);
    const footer=el('footer',undefined,'warmup-footer');footer.append(el('span','Student tablets are waiting. · 学生平板保持等待'),button('QUICK CHECK →',()=>setStage(1)));
    root.append(grid,footer);
  }
  function linePaths(board){
    const svg=board.querySelector('svg'),box=board.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);svg.replaceChildren();
    board.querySelectorAll('.warmup-word').forEach((item,i)=>{const target=board.querySelector(`.warmup-meaning[data-position="${matches[i]}"]`),a=item.getBoundingClientRect(),b=target.getBoundingClientRect(),x1=a.right-box.left,y1=a.top+a.height/2-box.top,x2=b.left-box.left,y2=b.top+b.height/2-box.top,mid=(x1+x2)/2,p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);p.style.setProperty('--link',matchColors[i]);p.classList.toggle('shown',i<warm.match);svg.append(p);});
  }
  function vocab(){
    shell('Say it. Then reveal it.','2 · VOCABULARY · HOMEWORK CHECK','Students give the meaning aloud. The teacher reveals one answer at a time.','1–2|MINUTES');
    const board=el('section',undefined,'warmup-match-board'),left=el('div',undefined,'warmup-match-column'),right=el('div',undefined,'warmup-match-column meanings');
    words.forEach(([word],i)=>{const c=el('div',undefined,'warmup-match-card warmup-word'+(i<warm.match?' revealed':''));c.style.setProperty('--link',matchColors[i]);c.append(el('strong',word));left.append(c);});
    rightOrder.forEach((wordIndex,position)=>{const c=el('div',undefined,'warmup-match-card warmup-meaning'+(matches[wordIndex]===position&&wordIndex<warm.match?' revealed':''));c.dataset.position=position;c.style.setProperty('--link',matchColors[wordIndex]);c.append(el('span',String.fromCharCode(65+position)),el('strong',words[wordIndex][1]));right.append(c);});
    const guide=el('div',undefined,'warmup-match-guide');guide.append(document.createTextNode('SAY IT'),el('br'),document.createTextNode('THEN DRAW'),el('br'),document.createTextNode('THE MATCH'));
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('warmup-match-lines');board.append(left,guide,svg,right);
    const next=button(warm.match<6?'REVEAL NEXT MATCH →':'HOT POTATO →',()=>{if(warm.match<6){warm.match++;save();draw();}else setStage(2);}),footer=el('footer',undefined,'warmup-footer');footer.append(el('span',(warm.match||0)+' / 6 matches revealed'),next);root.append(board,footer);requestAnimationFrame(()=>linePaths(board));
  }
  function monsterBall(){const wrap=el('div',undefined,'monster-ball-wrap'),photo=el('img');photo.src='/monster-red-ball.png?v=recommended12';photo.alt='Red Mayday Monster ball';wrap.append(photo,el('span',undefined,'monster-pupil left'),el('span',undefined,'monster-pupil right'));return wrap;}
  function hot(){
    shell('See all six. Reveal two at a time.','3 · VOCABULARY · HOT POTATO','When the music stops, the student holding the ball answers the next two.','3|ROUNDS · TWO ANSWERS EACH');
    const how=el('section',undefined,'hot-potato-how-strip'),runner=el('span',undefined,'hot-potato-runner');runner.append(el('span',undefined,'hot-mini-ball'));
    [['1 · PASS','传红色怪兽球','●'],['2 · MUSIC STOPS','老师停止音乐','♫'],['3 · ANSWER TWO','回答两题','2']].forEach(([en,zh,icon],i)=>{if(i)how.append(el('span','→','hot-how-arrow'));const s=el('div',undefined,'hot-how-step');s.append(el('span',icon==='●'?'':icon,icon==='●'?'hot-mini-ball':'hot-how-icon'),el('span',undefined,'hot-how-copy'));s.lastElementChild.append(el('strong',en),el('small',zh));how.append(s);});
    const replay=button('▶ REPLAY HOW TO PLAY',()=>{how.classList.remove('demo');void how.offsetWidth;how.classList.add('demo');},'hot-how-replay');how.append(replay,runner);
    const layout=el('section',undefined,'hot-potato-layout'),toy=el('aside',undefined,'hot-potato-toy');toy.append(monsterBall(),el('strong','ROUND '+Math.min(warm.pairs+1,3)+' READY','hot-round-title'),el('small','Pass the red Monster ball.'));
    const grid=el('div',undefined,'hot-potato-grid');sentences.forEach((parts,i)=>{const card=el('article',undefined,'hot-sentence'+(i<warm.pairs*2?' revealed':i>=warm.pairs*2&&i<warm.pairs*2+2?' current-pair':'')),text=el('p');text.append(document.createTextNode(parts[0]+' '),el('strong',i<warm.pairs*2?parts[1]:'__________','hot-answer'),document.createTextNode(' '+parts[2]));card.append(el('span',String(i+1),'hot-number'),text);if(i<warm.pairs*2)card.append(el('span','✓','hot-check'));grid.append(card);});
    const progress=el('div',undefined,'hot-pair-progress');for(let i=0;i<3;i++)progress.append(el('span','ROUND '+(i+1)+' · ANSWERS '+(i*2+1)+'–'+(i*2+2),'hot-pair-chip '+(i<warm.pairs?'done':i===warm.pairs&&warm.pairs<3?'now':'')));grid.append(progress);layout.append(toy,grid);
    const next=button(warm.pairs<3?`REVEAL ${warm.pairs*2+1}–${warm.pairs*2+2} →`:'READY TO READ →',()=>{if(warm.pairs<3){warm.pairs++;save();draw();}else setStage(3);}),footer=el('footer',undefined,'warmup-footer');footer.append(el('span','All six sentences stay on screen. · 每轮公布两题'),next);root.append(how,layout,footer);
  }
  function ready(){root.replaceChildren(stageNav());const layout=el('section',undefined,'warmup-ready-layout'),copy=el('div',undefined,'warmup-ready-copy');copy.append(el('p','4 · TRANSITION TO READING','warmup-kicker'),el('h2','Words ready. Now read.'),el('p','Use the words to understand the volunteers — then match every part of the question.','warmup-ready-bigline'),el('small','点击后，六个小组平板会自动进入 SKIM。','warmup-ready-cn'));const start=button('START READING ACTIVITY →',()=>action('teacher:start'),'warmup-start-reading');start.disabled=busy||!socket.connected;copy.append(start);const devices=el('div',undefined,'warmup-devices');latest.groups.forEach(g=>{const member=g.members.find(m=>m.connected),card=el('div','GROUP '+g.id,'warmup-device');card.append(el('small',member?'READY · '+member.name:'WAITING'));devices.append(card);});layout.append(copy,devices);root.append(layout);}
  function draw(){if(!latest)return;$('activity-title').textContent=warm.started?'CLASS WARM-UP':'GROUP CHECK-IN';if(!warm.started){lobby();return;}[lead,vocab,hot,ready][warm.stage]();}
  function hideStandard(showWarmup){root.hidden=!showWarmup;['lesson-panel','paper-exit','record-tools','demo-panel','interaction-guide','progress','results'].forEach(id=>{const node=$(id);if(node&&showWarmup)node.hidden=true;});const actions=document.querySelector('.teacher .actions');if(actions)actions.hidden=showWarmup;const note=$('stage-note');if(note&&showWarmup)note.hidden=true;if(showWarmup){$('activity-title').textContent=warm.started?'CLASS WARM-UP':'GROUP CHECK-IN';$('steps').hidden=true;document.body.dataset.lessonStage='warmup';}}
  const original=render;render=function(s){original(s);latest=s;load(s);const active=s.classStarted===false;hideStandard(active);if(active)draw();};socket.off('room:state');socket.on('room:state',render);
})();

