// The QR code lives on join.html, never inside the activity layout.
function updateJoinScreenLink(){
  if(!state||!session)return;
  const url=new URL('/join.html',location.origin);url.searchParams.set('room',state.code);
  $('join-screen-link').href=url.href;
}
const renderBeforeJoinLink=render;
render=function(s){renderBeforeJoinLink(s);updateJoinScreenLink();};
const lessonBeforeJoinLink=renderLessonTeacher;
renderLessonTeacher=function(s){lessonBeforeJoinLink(s);updateJoinScreenLink();};
if(state)updateJoinScreenLink();
