/* Shared guest presentation. All writes are isolated by the server. */
function decorateGuestPractice(){
  if(!session?.practice||!state||!personal)return;
  document.body.classList.add('guest-practice');
  $('view-group-label').hidden=false;
  $('view-group').value=String(session.group);
  $('identity').textContent=session.name+' · GUEST PRACTICE · GROUP '+personal.group+' · ROOM '+state.code;
  let banner=$('practice-banner');
  if(!banner){banner=el('section',undefined,'practice-banner');banner.id='practice-banner';$('game').insertBefore(banner,$('identity').nextSibling);}
  banner.replaceChildren(el('strong','GUEST PRACTICE · NOT INCLUDED IN CLASS RESULTS'),el('span','Your choices, highlights and notes belong only to you. Answers appear when your teacher reveals them.'));
  const result=personal.practiceResult;
  if(result?.correct){const score=result.correct.filter(Boolean).length;banner.append(el('strong','MY PRACTICE · '+score+' / '+result.correct.length+' correct'+(result.submitted?'':' · unfinished draft')));}
  if(state.lesson&&!state.revealed&&personal.lessonAnswer!==null){const h=$('lesson-panel').querySelector('h2');if(h)h.textContent='✓ MY PRACTICE SUBMITTED';}
  if(state.lesson){for(const button of $('lesson-panel').querySelectorAll('button'))if(button.textContent==='SUBMIT GROUP ANSWER →')button.textContent='SAVE MY PRACTICE ANSWER →';}
  if($('submit'))$('submit').textContent=busy?'SAVING…':state.stage==='keys'?'SAVE ALL MY PRACTICE ANSWERS →':state.stage==='peer'?'SAVE MY PRACTICE REVISION →':'SAVE MY PRACTICE ANSWER →';
  if($('waiting-title')&&!state.revealed&&personal.answers)$('waiting-title').textContent='✓ MY PRACTICE SUBMITTED';
  if($('waiting-message')&&!state.revealed&&personal.answers)$('waiting-message').textContent='Your practice answer is saved separately. Wait for your teacher to open the next step.';
  if($('task-note')&&!$('task-note').hidden)$('task-note').textContent='GUEST PRACTICE · GROUP '+personal.group+(state.stage==='keys'?' · ALL KEY IDEAS':' · QUESTION '+TASK_LABELS[personal.q])+' · Try the same task independently.';
  if($('selection'))$('selection').textContent='Your practice work is saved separately from the class.';
  if($('feedback-status'))$('feedback-status').textContent=personal.sent?'Your practice check is saved. Wait for the teacher to reveal.':'Practice the peer check. Your feedback will not be sent to the class.';
  if($('record-tools')&&!$('record-tools').hidden){$('export-student').textContent='DOWNLOAD MY GUEST PRACTICE · PDF';if(document.activeElement!==$('personal-notes'))$('personal-notes').value=personal.notes||'';}
}
const renderBeforeGuestPractice=render;
render=function(){renderBeforeGuestPractice();decorateGuestPractice();};
const lessonBeforeGuestPractice=renderLessonStudent;
renderLessonStudent=function(){lessonBeforeGuestPractice();decorateGuestPractice();};
if(state&&personal)render();
