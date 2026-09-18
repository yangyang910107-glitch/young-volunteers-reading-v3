/* Reveal-only leaderboard. One animation per scored reveal, never on submission. */
let liveBoard=null,liveTimers=[],liveEpoch=0,liveCurrent=null;
const scoreTitles={gist:'SKIM',keys:'KEY IDEAS',peer:'TEXT BRIDGE + PEER CHECK',exit:'EXIT TICKET'};
function liveClear(){liveEpoch++;liveTimers.forEach(clearTimeout);liveTimers=[];}
function liveLater(fn,ms){liveTimers.push(setTimeout(fn,ms));}
function liveStoreKey(s){return 'volunteersLeaderboard:'+s.roomId+':'+s.round;}
function updateLiveLeaderboard(s){const changed=liveCurrent&&(liveCurrent.roomId!==s.roomId||liveCurrent.round!==s.round||liveCurrent.stage!==s.stage);liveCurrent=s;if(liveBoard&&(changed||s.answersShown)){liveClear();liveBoard.hidden=true;}if(s.answersShown)return;if(!s.classStarted||!s.scoreboard||!s.revealed||!scoreTitles[s.stage])return;
 const key=liveStoreKey(s),prior=readStore(key,{seen:[],scores:[]}),stamp=s.stage+':'+(s.scoreRound?.keys||0)+':'+(s.scoreRound?.bridge||0);
 if(prior.seen.includes(stamp))return;
 sessionStorage.setItem(key,JSON.stringify({seen:[...prior.seen,stamp],scores:s.scoreboard}));
 openLiveLeaderboard(s,true,prior.scores);
}
function openLiveLeaderboard(s,animate=false,previous=null){if(!s)return;liveClear();if(!liveBoard){liveBoard=el('section',undefined,'live-leaderboard-overlay');liveBoard.setAttribute('role','dialog');liveBoard.setAttribute('aria-modal','true');liveBoard.setAttribute('aria-label','Group leaderboard');document.body.append(liveBoard);}
 const scores=s.scoreboard||s.groups.map(g=>({group:g.id,total:0})),old=previous||scores;
 const initial=[...old];s.groups.forEach(g=>{if(!initial.some(t=>t.group===g.id))initial.push({group:g.id,total:0});});
 const panel=el('div',undefined,'live-leaderboard-panel'),head=el('div',undefined,'live-leaderboard-heading'),title=el('h2','GROUP LEADERBOARD'),sub=el('p',scoreTitles[s.stage]||'LIVE CLASS'),close=el('button','SHOW ANSWERS · 展示答案','live-board-continue'),board=el('div',undefined,'live-score-board');
 head.append(el('small','YOUNG VOLUNTEERS'),title,sub);panel.append(head,board,close);liveBoard.replaceChildren(panel);liveBoard.hidden=false;const rows=new Map();
 initial.forEach((t,i)=>{const actual=scores.find(g=>g.group===t.group),g=s.groups.find(g=>g.id===t.group),row=el('article',undefined,'live-score-row'),rank=el('span',String(i+1),'live-rank'),avatar=el('span',undefined,'live-avatar avatar-'+t.group),name=el('div',undefined,'live-score-name'),score=el('strong',String(animate?t.total:actual.total),'live-score-total'),gain=el('span',undefined,'live-score-gain');
 avatar.setAttribute('aria-hidden','true');name.append(el('strong','GROUP '+t.group),el('small',g.members.map(m=>m.name).join(' · ')||'—'));row.append(rank,avatar,name,gain,score);row.style.setProperty('--place',i);board.append(row);rows.set(t.group,{row,rank,score,gain,before:t.total});});
 function positions(){scores.forEach((t,i)=>{const n=rows.get(t.group);n.row.style.setProperty('--place',i);n.rank.textContent=i+1;n.row.classList.toggle('live-first',i===0&&t.total>0);n.row.setAttribute('aria-label','Group '+t.group+', '+t.total+' points, rank '+(i+1));});}
 const teacherView=!!document.querySelector('.teacher .actions');close.hidden=!teacherView;if(!teacherView)panel.append(el('p','等待老师展示答案','live-board-wait'));close.onclick=()=>{if(s.revealed&&!s.answersShown){close.disabled=true;action('teacher:answers').finally(()=>{close.disabled=false;});}else{liveClear();liveBoard.hidden=true;}};if(teacherView)close.focus();
 if(!animate){positions();return;}
 const epoch=liveEpoch;
 liveLater(()=>scores.forEach(t=>{const n=rows.get(t.group),delta=t.total-n.before;n.gain.textContent=delta>0?'+'+delta:delta<0?String(delta):'—';n.row.classList.add('live-added');const start=performance.now();function tick(now){if(epoch!==liveEpoch)return;const f=Math.min(1,(now-start)/450);n.score.textContent=Math.round(n.before+(t.total-n.before)*(1-(1-f)**3));if(f<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);}),200);
 liveLater(positions,750);
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&liveBoard&&!liveBoard.hidden&&(!liveCurrent?.revealed||liveCurrent?.answersShown)){liveClear();liveBoard.hidden=true;}});
if(document.getElementById('student-demo'))socket.on('room:state',updateLiveLeaderboard);
