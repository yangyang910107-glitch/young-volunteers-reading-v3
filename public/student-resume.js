/* Remember entry details and recover private notes; never replay shared group answers. */
function resumeNameKey(name){return String(name||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase();}
function readLocalResume(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
function writeLocalResume(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
function rememberedEntry(code,observer){return readLocalResume('lessonEntry:'+String(code||'').toUpperCase()+':'+(observer?'guest':'student'));}
function rememberEntry(value){writeLocalResume('lessonEntry:'+value.code+':'+(value.observer?'guest':'student'),{name:value.name,group:value.group});}
function noteRecoveryKey(){return 'lessonNotes:'+state.roomId+':'+state.round+':'+(session.observer?'guest:':'student:')+resumeNameKey(session.name);}
function cachePrivateNotes(value){writeLocalResume(noteRecoveryKey(),{value,base:personal?.notesRevision||0,unsaved:true});}
function acknowledgePrivateNotes(value,p){const cached=readLocalResume(noteRecoveryKey());if(cached?.value===value)writeLocalResume(noteRecoveryKey(),{value,base:p.notesRevision||0,unsaved:false});else if(cached?.unsaved)writeLocalResume(noteRecoveryKey(),{...cached,base:p.notesRevision||0});}
function restorePrivateNotes(p){
  if(!session||!state)return p;
  const cached=readLocalResume(noteRecoveryKey());
  if(cached?.unsaved&&cached.base===(p.notesRevision||0)&&typeof cached.value==='string'&&cached.value.length<=4000&&['exit','homework'].includes(p.stage)){
    p={...p,notes:cached.value,notesRestored:true};
    setTimeout(()=>{if(personal?.notesRestored)savePersonalNotes().catch(()=>{});},0);
  }
  return p;
}
