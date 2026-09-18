/* Stable name chips: pulse only on a new arrival or an offline-to-online change. */
(()=>{
 const isJoin=!!document.querySelector('.join-screen'),host=isJoin?document.querySelector('.join-screen'):document.getElementById('game');
 if(!host)return;
 const box=document.createElement('section');box.className='arrival-panel';box.hidden=true;
 const heading=document.createElement('div');heading.className='arrival-heading';const title=document.createElement('h2');title.textContent='READY TO READ';const count=document.createElement('span');heading.append(title,count);
 const grid=document.createElement('div');grid.className='arrival-grid';const note=document.createElement('p');note.className='arrival-note';note.textContent='学生进入，名字亮起 · 等大家准备好再开始';box.append(heading,grid,note);
 if(isJoin)host.insertBefore(box,document.querySelector('.return-note'));else host.insertBefore(box,document.getElementById('progress'));
 const chips=new Map();let context='',current=null;
 function paint(s){current=s;box.hidden=!!s.classStarted;if(box.hidden)return;const key=s.roomId+':'+s.round;if(key!==context){context=key;grid.replaceChildren();chips.clear();}
 count.textContent=s.connected+' / '+Math.max(s.expectedStudents||0,s.joined)+' ONLINE';
 const present=new Set();for(const group of s.groups)for(const member of group.members){const key=group.id+':'+member.name;present.add(key);let item=chips.get(key);if(!item){const chip=document.createElement('div');chip.className='arrival-chip';const dot=document.createElement('span');dot.className='arrival-dot';const name=document.createElement('strong');name.textContent=member.name;const label=document.createElement('small');label.textContent='GROUP '+group.id;chip.append(dot,name,label);grid.append(chip);item={chip,online:false};chips.set(key,item);}
 if(member.connected&&!item.online){item.chip.classList.remove('arrival-pop');void item.chip.offsetWidth;item.chip.classList.add('arrival-pop');}
 item.online=!!member.connected;item.chip.classList.toggle('arrival-online',item.online);item.chip.setAttribute('aria-label',member.name+(item.online?' · online':' · offline'));}
 for(const [key,item] of chips)if(!present.has(key)){item.chip.remove();chips.delete(key);}
 if(!chips.size){const empty=document.createElement('p');empty.className='arrival-empty';empty.textContent='等待学生扫码加入…';grid.replaceChildren(empty);}else grid.querySelector('.arrival-empty')?.remove();
 }
 if(!isJoin){const original=render;render=function(s){original(s);paint(s);};socket.off('room:state');socket.on('room:state',render);return;}
 let auth;try{auth=JSON.parse(sessionStorage.getItem('readingV3TeacherSession'));}catch{}
 const code=new URLSearchParams(location.search).get('room')?.toUpperCase();if(!auth?.token||auth.code!==code)return;
 const connection=io();const start=document.createElement('button');start.textContent='START CLASS →';start.className='arrival-start';box.append(start);
 connection.on('room:state',paint);connection.on('connect',()=>connection.timeout(6000).emit('teacher:join',{...auth,resumeOnly:true},(err,response)=>{if(err||!response?.ok){box.hidden=false;note.textContent=response?.error||'正在重连房间…';start.disabled=true;return;}paint(response.state);start.disabled=false;}));
 connection.on('disconnect',()=>{count.textContent='正在重连…';start.disabled=true;});
 start.onclick=()=>{if(!current||!connection.connected)return;start.disabled=true;connection.timeout(6000).emit('teacher:start',{...auth,stage:current.stage,round:current.round},(err,response)=>{if(err||!response?.ok){note.textContent=response?.error||'暂时未能开始，请重试。';start.disabled=false;return;}location.assign('/teacher.html');});};
})();
